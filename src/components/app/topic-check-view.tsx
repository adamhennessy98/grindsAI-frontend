"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import { requestExamQuestions, type GeneratedExamQuestion } from "@/lib/exam-generator";
import { MathMarkdown } from "@/components/math-markdown";
import { QuestionTutorActions } from "./question-tutor-actions";
import { QuestionTutorPanel } from "./question-tutor-panel";
import type { TutorQuestionHandoff } from "./conversation-view";
import type { TopicCheckEntry } from "./study-state";
import { subjectLabel, subjectThemeStyle } from "./subjects";

const TOPIC_CHECK_MAX_QUESTION_COUNT = 10;

type ReviewStatus = "correct" | "partial" | "needs-correction" | "reviewed";

type TopicCheckReview = {
  questionIndex: number;
  status: ReviewStatus;
  text: string;
};

interface TopicCheckViewProps {
  subjectId: string;
  level: string;
  onComplete: (entry: TopicCheckEntry) => void;
  onAddFocusArea: (label: string) => void;
  onOpenTutor: (topicId: string) => void;
  onOpenGenerator: (topicId: string) => void;
}

function reviewStatus(text: string): ReviewStatus {
  const opening = text.slice(0, 280).toLowerCase();
  if (/assessment:\s*(partly|partially) correct/.test(opening)) return "partial";
  if (/assessment:\s*(needs correction|incorrect)/.test(opening)) return "needs-correction";
  if (/assessment:\s*(fully )?correct/.test(opening)) return "correct";
  if (/\bneeds correction\b|\bincorrect\b/.test(opening)) return "needs-correction";
  if (/\bpartly correct\b|\bpartially correct\b/.test(opening)) return "partial";
  if (/\bfully correct\b|\bcorrect\b/.test(opening)) return "correct";
  return "reviewed";
}

async function readTutorReview(input: {
  subjectId: string;
  level: string;
  topicId: string;
  topicName: string;
  question: GeneratedExamQuestion;
  answer: string;
  assisted: boolean;
}) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectId: input.subjectId,
      level: input.level,
      topicId: input.topicId,
      text: "Review my Topic Check answer using the required assessment format.",
      history: [],
      studentContext: [
        "Topic Check answer review.",
        `Topic: ${input.topicName}.`,
        "Question:",
        input.question.question,
        "Student answer:",
        input.answer,
        input.question.workedSolution ? `Reference worked solution:\n${input.question.workedSolution}` : "No worked solution is available.",
        input.assisted ? "The student used Tutor support while answering this question." : "The student completed this question without Tutor support.",
        "Review the answer against the reference solution. Do not use a Socratic response for this review.",
        "Start with exactly one line in this format: Assessment: Correct, Assessment: Partly correct, or Assessment: Needs correction.",
        "Then use short headings: What was correct and What to improve. Be specific, concise, and show the correct method or answer where needed.",
      ].join("\n\n").slice(0, 12000),
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(payload?.error ?? "The answer review could not be completed.");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("The answer review could not be completed.");
  const decoder = new TextDecoder();
  let review = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    review += decoder.decode(value, { stream: true });
  }
  if (!review.trim()) throw new Error("The answer review could not be completed.");
  return review.trim();
}

export function TopicCheckView({ subjectId, level, onComplete, onAddFocusArea, onOpenTutor, onOpenGenerator }: TopicCheckViewProps) {
  const topics = useMemo(() => getSubjectTopics(subjectId).filter((topic) => topic.id !== "general"), [subjectId]);
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [questions, setQuestions] = useState<GeneratedExamQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [assistedQuestionIndexes, setAssistedQuestionIndexes] = useState<number[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [tutorHandoff, setTutorHandoff] = useState<TutorQuestionHandoff | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [reviews, setReviews] = useState<TopicCheckReview[]>([]);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<TopicCheckEntry | null>(null);
  const activeTopic = topics.find((topic) => topic.id === topicId) ?? topics[0];
  const activeQuestion = questions[activeQuestionIndex];
  const allAnswered = questions.length > 0 && answers.length === questions.length && answers.every((answer) => answer.trim());
  const correctCount = reviews.filter((review) => review.status === "correct").length;
  const needsWorkCount = reviews.filter((review) => review.status === "needs-correction").length;
  const allCorrect = reviews.length === questions.length && correctCount === questions.length;

  const resetCheck = () => {
    setQuestions([]);
    setAnswers([]);
    setAssistedQuestionIndexes([]);
    setActiveQuestionIndex(0);
    setTutorHandoff(null);
    setReviews([]);
    setError("");
    setCompleted(null);
  };

  const changeTopic = (nextTopicId: string) => {
    if (questions.length && !completed && !window.confirm("Change topic and discard this unfinished Topic Check?")) return;
    resetCheck();
    setTopicId(nextTopicId);
  };

  const startCheck = async () => {
    if (!activeTopic) return;
    setIsGenerating(true);
    resetCheck();

    try {
      const result = await requestExamQuestions({
        subjectId,
        level,
        topicId: activeTopic.id,
        questionType: "short",
        difficulty: "easy",
        count: TOPIC_CHECK_MAX_QUESTION_COUNT,
        includeHints: true,
        includeWorkedSolution: true,
        includeMarkingScheme: false,
        purpose: "topic-check",
        topicCheckTotal: TOPIC_CHECK_MAX_QUESTION_COUNT,
      });
      if (!result.questions.length) throw new Error("A Topic Check could not be created.");
      setQuestions(result.questions);
      setAnswers(result.questions.map(() => ""));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Could not create this Topic Check. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateAnswer = (value: string) => {
    setAnswers((current) => current.map((answer, index) => index === activeQuestionIndex ? value : answer));
  };

  const markAssisted = () => {
    setAssistedQuestionIndexes((current) => current.includes(activeQuestionIndex) ? current : [...current, activeQuestionIndex]);
  };

  const finishCheck = async () => {
    if (!activeTopic || !allAnswered || isReviewing) return;
    setIsReviewing(true);
    setReviewStep(0);
    setReviews([]);
    setError("");

    const nextReviews: TopicCheckReview[] = [];
    for (let index = 0; index < questions.length; index += 1) {
      setReviewStep(index + 1);
      try {
        const text = await readTutorReview({
          subjectId,
          level,
          topicId: activeTopic.id,
          topicName: activeTopic.name,
          question: questions[index],
          answer: answers[index],
          assisted: assistedQuestionIndexes.includes(index),
        });
        nextReviews.push({ questionIndex: index, status: reviewStatus(text), text });
      } catch (reviewError) {
        nextReviews.push({
          questionIndex: index,
          status: "reviewed",
          text: reviewError instanceof Error ? reviewError.message : "The answer review could not be completed.",
        });
      }
    }

    const entry: TopicCheckEntry = {
      id: `topic-check-${Date.now()}`,
      topicId: activeTopic.id,
      topicName: activeTopic.name,
      completedAt: new Date().toISOString(),
      status: assistedQuestionIndexes.length ? "assisted" : "independent",
      assistedCount: assistedQuestionIndexes.length,
      questionCount: questions.length,
    };
    setReviews(nextReviews);
    setCompleted(entry);
    onComplete(entry);
    setIsReviewing(false);
    setReviewStep(0);
  };

  const beginAnotherCheck = () => {
    resetCheck();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div style={subjectThemeStyle(subjectId)} className="animate-fade-up mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
    <header className="mb-5">
      <div className="subject-context-label text-[12px] font-semibold uppercase tracking-[.08em]">{subjectLabel(subjectId)} / {level === "OL" ? "Ordinary Level" : "Higher Level"}</div>
      <h1 className="font-heading m-0 mt-1 text-[30px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white">Topic Check</h1>
      <p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">Answer a short sequence of core questions that build from the first essential step to the common procedures.</p>
    </header>

    {!questions.length && !completed && <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_14px_38px_-34px_rgba(217,119,6,.55)] dark:border-amber-900 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">Topic</span>
            <select value={topicId} onChange={(event) => changeTopic(event.target.value)} disabled={isGenerating} className="w-full rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-900 dark:bg-amber-400/10 dark:text-white dark:[color-scheme:dark]">
              {topics.map((topic) => <option key={topic.id} value={topic.id} className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">{topic.name}</option>)}
            </select>
          </label>
          <p className="m-0 mt-2 text-[12.5px] leading-relaxed text-gray-500">Choose one topic to check its most common core procedures, one step at a time.</p>
        </div>
        <button type="button" onClick={() => void startCheck()} disabled={isGenerating || !activeTopic} className="shrink-0 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-wait disabled:bg-amber-300 dark:disabled:bg-amber-900">{isGenerating ? "Building your check..." : "Start a check"}</button>
      </div>
      {isGenerating && <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-xl border border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-950" />)}</div>}
      {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800 dark:border-red-950 dark:bg-red-950/25 dark:text-red-200">{error}</div>}
    </section>}

    {isReviewing && <section aria-live="polite" className="rounded-2xl border border-amber-100 bg-white px-5 py-6 shadow-[0_14px_38px_-34px_rgba(217,119,6,.55)] dark:border-amber-900 dark:bg-slate-900"><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-amber-700 dark:text-amber-300">Checking your answers</div><h2 className="font-heading m-0 mt-2 text-[21px] font-semibold text-gray-900 dark:text-white">Reviewing question {reviewStep} of {questions.length}</h2><p className="m-0 mt-2 text-[14px] text-gray-500">Your Tutor is comparing your working with the question&apos;s worked solution.</p><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{Array.from({ length: questions.length }, (_, index) => <div key={index} className={`h-20 animate-pulse rounded-xl border ${index < reviewStep ? "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-400/10" : "border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-950"}`} />)}</div></section>}

    {activeQuestion && !completed && !isReviewing && <section className="rounded-2xl border border-amber-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(217,119,6,.55)] dark:border-amber-900 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-amber-700 dark:text-amber-300">{activeTopic?.name} / Topic Check</div><h2 className="font-heading m-0 mt-1 text-[20px] font-semibold text-gray-900 dark:text-white">Question {activeQuestionIndex + 1} of {questions.length}</h2></div>
        {assistedQuestionIndexes.includes(activeQuestionIndex) && <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[12px] font-semibold text-cyan-700 dark:border-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-200">Help used</span>}
      </div>
      <MathMarkdown className="mt-5 text-[15px] leading-relaxed text-gray-800 dark:text-slate-100">{activeQuestion.question}</MathMarkdown>
      <label className="mt-5 block"><span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">Your answer</span><textarea value={answers[activeQuestionIndex] ?? ""} onChange={(event) => updateAnswer(event.target.value)} rows={6} placeholder="Write your answer or working here" className="w-full resize-y rounded-xl border border-amber-100 bg-amber-50/35 px-3.5 py-3 text-sm leading-relaxed text-gray-800 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-amber-900 dark:bg-slate-950 dark:text-white" /></label>
      <QuestionTutorActions sourceLabel="Topic Check question" title={`${activeTopic?.name} Topic Check: Question ${activeQuestionIndex + 1}`} topic={activeTopic!} level={level} question={activeQuestion.question} supportingMaterialLabel="worked solution" supportingMaterial={activeQuestion.workedSolution ?? activeQuestion.markingScheme ?? ""} studentAnswer={answers[activeQuestionIndex] ?? ""} onAssisted={markAssisted} onOpen={setTutorHandoff} />
      {tutorHandoff && <QuestionTutorPanel key={tutorHandoff.id} subjectId={subjectId} level={level} handoff={tutorHandoff} onClose={() => setTutorHandoff(null)} />}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-5 dark:border-amber-900"><button type="button" onClick={() => { setTutorHandoff(null); setActiveQuestionIndex((index) => Math.max(0, index - 1)); }} disabled={activeQuestionIndex === 0} className="rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-amber-700 hover:border-amber-500 disabled:cursor-not-allowed disabled:opacity-45 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-200">Previous</button>{activeQuestionIndex < questions.length - 1 ? <button type="button" onClick={() => { setTutorHandoff(null); setActiveQuestionIndex((index) => Math.min(questions.length - 1, index + 1)); }} className="rounded-xl bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-amber-600">Next question</button> : <div className="flex flex-col items-end gap-1"><button type="button" onClick={() => void finishCheck()} disabled={!allAnswered} className="rounded-xl bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-200 dark:disabled:bg-amber-900">Finish and check answers</button>{!allAnswered && <span className="text-[11.5px] text-gray-500">Answer every question to finish.</span>}</div>}</div>
    </section>}

    {completed && <section className="rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,.96),rgba(255,255,255,.96))] px-5 py-6 shadow-[0_18px_44px_-34px_rgba(217,119,6,.7)] dark:border-amber-900 dark:!bg-none dark:!bg-[#2d2415]">
      <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-amber-700 dark:text-amber-300">Topic Check complete</div>
      <h2 className="font-heading m-0 mt-2 text-[23px] font-semibold text-gray-900 dark:text-white">{allCorrect ? "Your foundations look secure" : completed.status === "independent" ? "Foundation check completed independently" : "Completed with Tutor support"}</h2>
      <p className="m-0 mt-2 max-w-[700px] text-[14px] leading-relaxed text-gray-600 dark:text-slate-300">{allCorrect ? `You got all ${questions.length} questions correct. Try an Exam Question next to practise the same topic in a more exam-like format.` : reviews.length ? `${correctCount} of ${questions.length} answers were assessed as correct${needsWorkCount ? `, with ${needsWorkCount} needing correction` : ""}. Read each review below before choosing your next step.` : "Your answer reviews could not be completed."}</p>
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">{reviews.map((review) => <ReviewCard key={review.questionIndex} review={review} assisted={assistedQuestionIndexes.includes(review.questionIndex)} />)}</div>
      <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => onOpenGenerator(completed.topicId)} className="rounded-xl bg-lime-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-lime-600">Try an Exam Question</button><button type="button" onClick={() => onOpenTutor(completed.topicId)} className="rounded-xl bg-cyan-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-cyan-600">Review with Tutor</button>{(completed.status === "assisted" || needsWorkCount > 0) && <button type="button" onClick={() => onAddFocusArea(completed.topicName)} className="rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-[13px] font-semibold text-violet-700 hover:border-violet-500 dark:border-violet-900 dark:bg-violet-400/10 dark:text-violet-200">Add as focus area</button>}<button type="button" onClick={beginAnotherCheck} className="rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-amber-700 hover:border-amber-500 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-200">Start another check</button></div>
    </section>}
  </div>;
}

function ReviewCard({ review, assisted }: { review: TopicCheckReview; assisted: boolean }) {
  const tone = {
    correct: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-400/[.07]",
    partial: "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-400/[.07]",
    "needs-correction": "border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-400/[.07]",
    reviewed: "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900",
  }[review.status];
  const label = { correct: "Correct", partial: "Partly correct", "needs-correction": "Needs correction", reviewed: "Tutor review" }[review.status];
  return <article className={`rounded-xl border px-4 py-4 ${tone}`}><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-heading m-0 text-[16px] font-semibold text-gray-900 dark:text-white">Question {review.questionIndex + 1}</h3><div className="flex items-center gap-2"><span className="rounded-full bg-white/80 px-2.5 py-1 text-[11.5px] font-semibold text-gray-700 dark:bg-slate-950 dark:text-slate-200">{label}</span>{assisted && <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[11.5px] font-semibold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-200">Help used</span>}</div></div><MathMarkdown className="mt-3 text-[13px] leading-relaxed text-gray-700 dark:text-slate-200">{review.text}</MathMarkdown></article>;
}
