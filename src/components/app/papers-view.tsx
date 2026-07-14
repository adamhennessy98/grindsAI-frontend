"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import { requestExamQuestions, type ExamQuestionDifficulty, type ExamQuestionType, type GeneratedExamQuestion } from "@/lib/exam-generator";
import { MathMarkdown } from "@/components/math-markdown";
import type { FocusArea } from "./study-state";
import { subjectLabel, subjectThemeStyle } from "./subjects";
import type { TutorQuestionHandoff } from "./conversation-view";

interface PapersViewProps {
  subjectId: string;
  level: string;
  initialTopicId?: string;
  focusAreas: FocusArea[];
  onOpenConvo: (handoff: TutorQuestionHandoff) => void;
  onQuestionGenerated: (topic: { id: string; name: string }) => void;
  onReflect: (outcome: "Comfortable" | "Needed some help" | "Still stuck", topic: { id: string; name: string }) => void;
}

export function PapersView({ subjectId, level, initialTopicId, focusAreas, onOpenConvo, onQuestionGenerated, onReflect }: PapersViewProps) {
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId]);
  const [topicId, setTopicId] = useState(() => initialTopicId && topics.some((topic) => topic.id === initialTopicId) ? initialTopicId : topics[0]?.id ?? "general");
  const [questionType, setQuestionType] = useState<ExamQuestionType>("mixed");
  const [difficulty, setDifficulty] = useState<ExamQuestionDifficulty>("exam");
  const [includeHints, setIncludeHints] = useState(true);
  const [generated, setGenerated] = useState<GeneratedExamQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reflection, setReflection] = useState<"Comfortable" | "Needed some help" | "Still stuck" | null>(null);
  const activeTopic = topics.find((topic) => topic.id === topicId) ?? topics[0];

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeTopic) return;
    setLoading(true);
    setError("");
    setReflection(null);
    try {
      const result = await requestExamQuestions({ subjectId, level, topicId: activeTopic.id, questionType, difficulty, count: 1, includeHints, includeWorkedSolution: true, includeMarkingScheme: false });
      const question = result.questions[0];
      if (!question) throw new Error("No question was returned.");
      setGenerated(question);
      onQuestionGenerated(activeTopic);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not generate a question."); } finally { setLoading(false); }
  };

  const handoff = () => {
    if (!generated || !activeTopic) return;
    // TODO: send this same payload to the persisted Tutor conversation when that integration is available.
    onOpenConvo({ title: generated.title, question: generated.question, topicId: activeTopic.id, topicName: activeTopic.name, level });
  };
  const chooseReflection = (outcome: "Comfortable" | "Needed some help" | "Still stuck") => { if (!activeTopic) return; setReflection(outcome); onReflect(outcome, activeTopic); };

  return <div style={subjectThemeStyle(subjectId)} className="mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9"><div className="mb-6"><div className="subject-context-label mb-1 text-[12px] font-semibold uppercase tracking-[.08em]">{subjectLabel(subjectId)} / {level === "OL" ? "Ordinary Level" : "Higher Level"}</div><h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white">Exam Questions</h1><p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">Generate one exam-style question, attempt it yourself, then choose the support you need.</p></div>
    <div className={`grid grid-cols-1 gap-4 ${generated ? "xl:grid-cols-[300px_minmax(0,1fr)]" : "xl:grid-cols-[360px_minmax(0,1fr)]"}`}><GeneratorControls topics={topics} activeTopicId={activeTopic?.id ?? ""} questionType={questionType} difficulty={difficulty} includeHints={includeHints} focusAreas={focusAreas} loading={loading} onTopic={(value) => { setTopicId(value); setGenerated(null); setReflection(null); }} onQuestionType={setQuestionType} onDifficulty={setDifficulty} onHints={setIncludeHints} onGenerate={generate} />
      <section className={`rounded-2xl border border-lime-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(101,163,13,.55)] dark:bg-slate-900 ${generated ? "" : "flex min-h-[210px] items-center"}`}>{error && <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-800">{error}</div>}{!error && !generated && <div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-lime-700">Ready when you are</div><h2 className="font-heading m-0 mt-2 text-[21px] font-semibold text-gray-900 dark:text-white">Generate one exam-style question tailored to this topic and level.</h2><p className="m-0 mt-2 max-w-[560px] text-[14px] leading-relaxed text-gray-500">Try it before revealing support. When you are ready, bring the exact question into your Tutor session.</p></div>}{generated && <GeneratedQuestion question={generated} topic={activeTopic!} onTutor={handoff} reflection={reflection} onReflect={chooseReflection} />}</section>
    </div><ArchivedQuestionsPlaceholder subject={subjectLabel(subjectId)} topic={activeTopic} /></div>;
}

function ArchivedQuestionsPlaceholder({ subject, topic }: { subject: string; topic: { id: string; name: string } | undefined }) {
  const isGeneral = topic?.id === "general";
  const scope = isGeneral ? `all ${subject} topics` : topic?.name ?? subject;
  return <section className="mt-5 rounded-2xl border border-dashed border-lime-200 bg-lime-50/35 px-5 py-5 dark:border-lime-900 dark:bg-lime-400/5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-lime-700 dark:text-lime-300">Coming soon</div><h2 className="font-heading m-0 mt-1 text-lg font-semibold text-gray-900 dark:text-white">Archived exam questions</h2><p className="m-0 mt-1 max-w-[650px] text-[13px] leading-relaxed text-gray-500">{isGeneral ? `When the archive is available, it will show questions across all ${subject} topics.` : `When the archive is available, it will show ${subject} questions tagged to ${scope}.`}</p></div><span className="w-fit rounded-full border border-lime-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-lime-700 dark:border-lime-900 dark:bg-slate-900 dark:text-lime-200">Filtered by topic</span></div><div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">{["2025", "2024", "2023"].map((year) => <div key={year} className="rounded-xl border border-lime-100 bg-white/85 px-3.5 py-3 dark:border-lime-900 dark:bg-slate-900/75"><div className="font-heading text-[15px] font-semibold text-gray-900 dark:text-white">{year}</div><p className="m-0 mt-1 text-[12.5px] leading-relaxed text-gray-500">{isGeneral ? `All ${subject} topics` : scope}</p><span className="mt-3 inline-block text-[11.5px] font-semibold text-lime-700 dark:text-lime-200">Archive being added</span></div>)}</div></section>;
}

function GeneratorControls({ topics, activeTopicId, questionType, difficulty, includeHints, focusAreas, loading, onTopic, onQuestionType, onDifficulty, onHints, onGenerate }: { topics: ReturnType<typeof getSubjectTopics>; activeTopicId: string; questionType: ExamQuestionType; difficulty: ExamQuestionDifficulty; includeHints: boolean; focusAreas: FocusArea[]; loading: boolean; onTopic: (value: string) => void; onQuestionType: (value: ExamQuestionType) => void; onDifficulty: (value: ExamQuestionDifficulty) => void; onHints: (value: boolean) => void; onGenerate: (event: React.FormEvent) => void; }) {
  return <form onSubmit={onGenerate} className="rounded-2xl border border-lime-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(101,163,13,.55)] dark:bg-slate-900"><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Question settings</h2>{focusAreas[0] && <p className="mb-4 mt-2 rounded-xl bg-lime-50 px-3 py-2 text-[12.5px] leading-relaxed text-lime-800 dark:bg-lime-400/10 dark:text-lime-200">Current focus: {focusAreas[0].label}</p>}<div className="mt-4 space-y-4"><Field label="Topic"><select value={activeTopicId} onChange={(event) => onTopic(event.target.value)} className={inputClass}>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></Field><Field label="Question type"><Segmented value={questionType} options={[["mixed", "Mixed"], ["short", "Short"], ["long", "Long"]]} onChange={(value) => onQuestionType(value as ExamQuestionType)} /></Field><Field label="Difficulty"><Segmented value={difficulty} options={[["exam", "Exam standard"], ["easy", "Confidence build"]]} onChange={(value) => onDifficulty(value as ExamQuestionDifficulty)} /></Field><button type="button" onClick={() => onHints(!includeHints)} className="flex w-full items-center justify-between rounded-xl border border-lime-100 bg-lime-50/60 px-3.5 py-3 text-left dark:bg-lime-400/10"><span className="text-[13px] font-medium text-gray-700 dark:text-slate-200">Include hints</span><span className={`h-5 w-9 rounded-full p-0.5 ${includeHints ? "bg-lime-500" : "bg-gray-200"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${includeHints ? "translate-x-4" : "translate-x-0"}`} /></span></button><button type="submit" disabled={loading} className="w-full rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lime-600 disabled:bg-gray-200">{loading ? "Generating..." : "Generate question"}</button></div></form>;
}

function GeneratedQuestion({ question, topic, onTutor, reflection, onReflect }: { question: GeneratedExamQuestion; topic: { id: string; name: string }; onTutor: () => void; reflection: string | null; onReflect: (outcome: "Comfortable" | "Needed some help" | "Still stuck") => void; }) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  return <div><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-lime-700">{question.topic} / {question.marks} marks</div><h2 className="font-heading m-0 mt-1 text-[22px] font-semibold text-gray-900 dark:text-white">{question.title}</h2></div><span className="rounded-full bg-lime-50 px-2.5 py-1 text-[12px] font-semibold text-lime-700 dark:bg-lime-400/10 dark:text-lime-200">{question.level}</span></div><MathMarkdown className="mt-5 text-[15px] leading-relaxed text-gray-800 dark:text-slate-100">{question.question}</MathMarkdown><div className="mt-5 flex flex-wrap gap-2">{question.hint && <button type="button" onClick={() => setHintOpen((current) => !current)} className="rounded-xl border border-lime-200 bg-lime-50 px-3 py-2 text-[12.5px] font-semibold text-lime-700 hover:border-lime-500 dark:bg-lime-400/10 dark:text-lime-200">{hintOpen ? "Hide hint" : "Give me a hint"}</button>}<button type="button" onClick={onTutor} className="rounded-xl bg-cyan-500 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-cyan-600">Work through with Tutor</button>{question.workedSolution && <button type="button" onClick={() => setSolutionOpen((current) => !current)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-semibold text-gray-700 hover:border-gray-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{solutionOpen ? "Hide solution" : "Reveal solution"}</button>}</div>{hintOpen && question.hint && <SupportPanel label="Hint"><MathMarkdown>{question.hint}</MathMarkdown></SupportPanel>}{solutionOpen && question.workedSolution && <SupportPanel label="Worked solution"><MathMarkdown>{question.workedSolution}</MathMarkdown></SupportPanel>}<div className="mt-6 border-t border-lime-100 pt-5 dark:border-lime-900"><div className="font-heading text-[16px] font-semibold text-gray-900 dark:text-white">How did that go?</div><p className="m-0 mt-1 text-[13px] text-gray-500">Your choice helps shape the next useful step.</p><div className="mt-3 flex flex-wrap gap-2">{(["Comfortable", "Needed some help", "Still stuck"] as const).map((option) => <button key={option} type="button" onClick={() => onReflect(option)} className={`rounded-xl border px-3 py-2 text-[12.5px] font-semibold ${reflection === option ? "border-lime-500 bg-lime-500 text-white" : "border-lime-100 bg-lime-50 text-lime-700 dark:bg-lime-400/10 dark:text-lime-200"}`}>{option}</button>)}</div>{reflection && <p className="mb-0 mt-3 text-[13px] text-gray-500">{reflection === "Comfortable" ? "Nice. Try another question or move to your next topic." : reflection === "Needed some help" ? "Use Tutor to talk through the first step before trying another question." : `Try ${topic.name} with your Tutor, then add it to your focus areas if it still feels difficult.`}</p>}</div></div>;
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">{label}</span>{children}</label>; }
function Segmented({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (value: string) => void }) { return <div className="grid gap-1 rounded-xl border border-lime-100 bg-lime-50/60 p-1 dark:bg-lime-400/10" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>{options.map(([key, label]) => <button key={key} type="button" onClick={() => onChange(key)} className={`rounded-lg px-2 py-2 text-[12px] font-medium ${value === key ? "bg-white text-lime-700 shadow-sm dark:bg-slate-900 dark:text-lime-200" : "text-gray-500 dark:text-slate-300"}`}>{label}</button>)}</div>; }
function SupportPanel({ label, children }: { label: string; children: React.ReactNode }) { return <div className="mt-4 rounded-xl border border-lime-100 bg-lime-50/60 px-4 py-3 text-[13px] leading-relaxed text-gray-700 dark:bg-lime-400/10 dark:text-slate-200"><div className="mb-1 text-[11px] font-semibold uppercase tracking-[.07em] text-lime-700 dark:text-lime-300">{label}</div>{children}</div>; }
