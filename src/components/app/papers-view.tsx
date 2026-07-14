"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import {
  requestExamQuestions,
  type ExamQuestionDifficulty,
  type ExamQuestionType,
  type GeneratedExamQuestion,
} from "@/lib/exam-generator";
import { MathMarkdown } from "@/components/math-markdown";
import { buildPapers, subjectLabel } from "./subjects";

interface PapersViewProps {
  subjectId: string;
  level: string;
  onOpenConvo: () => void;
}

export function PapersView({ subjectId, level, onOpenConvo }: PapersViewProps) {
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId]);
  const papers = buildPapers(subjectId);
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "general");
  const [questionType, setQuestionType] = useState<ExamQuestionType>("mixed");
  const [difficulty, setDifficulty] = useState<ExamQuestionDifficulty>("exam");
  const [includeHints, setIncludeHints] = useState(true);
  const [includeWorkedSolution, setIncludeWorkedSolution] = useState(false);
  const [generated, setGenerated] = useState<GeneratedExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeTopicId = topics.some((topic) => topic.id === topicId) ? topicId : topics[0]?.id ?? "general";

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await requestExamQuestions({
        subjectId,
        level,
        topicId: activeTopicId,
        questionType,
        difficulty,
        count: 1,
        includeHints,
        includeWorkedSolution,
        includeMarkingScheme: false,
      });
      setGenerated(result.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate a question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1060px] px-5 pb-16 pt-[30px] sm:px-7">
      <div className="mb-6">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
          {subjectLabel(subjectId)} / {level === "OL" ? "Ordinary Level" : "Higher Level"}
        </div>
        <h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-0.02em] text-gray-900">
          Exam Questions
        </h1>
        <p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">
          Generate one Leaving Cert-style question by topic and difficulty, then work through it independently or with the
          tutor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <form onSubmit={generate} className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
          <h2 className="font-heading m-0 text-lg font-semibold text-gray-900">Question generator</h2>
          <p className="m-0 mb-5 mt-1 text-[13px] leading-relaxed text-gray-500">
            Pick a topic, style, and difficulty. If generation is unavailable, the error will appear clearly here.
          </p>

          <div className="space-y-4">
            <Field label="Topic">
              <select value={activeTopicId} onChange={(event) => setTopicId(event.target.value)} className={inputCls}>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Question type">
              <SegmentedControl
                value={questionType}
                options={[
                  ["mixed", "Mixed"],
                  ["short", "Short"],
                  ["long", "Long"],
                ]}
                onChange={(value) => setQuestionType(value as ExamQuestionType)}
              />
            </Field>

            <Field label="Difficulty">
              <SegmentedControl
                value={difficulty}
                options={[
                  ["exam", "Exam standard"],
                  ["easy", "Confidence build"],
                ]}
                onChange={(value) => setDifficulty(value as ExamQuestionDifficulty)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Toggle checked={includeHints} label="Include hints" onChange={setIncludeHints} />
              <Toggle checked={includeWorkedSolution} label="Worked solution" onChange={setIncludeWorkedSolution} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[10px] bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? "Generating..." : "Generate question"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading m-0 text-lg font-semibold text-gray-900">Generated question</h2>
              <p className="m-0 mt-1 text-[13px] text-gray-500">Attempt it here, then open the tutor if you want guidance.</p>
            </div>
            <button
              type="button"
              onClick={onOpenConvo}
              className="rounded-[10px] border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:text-emerald-600"
            >
              Work through this with Tutor
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-800">
              {error}
            </div>
          )}

          {generated.length ? (
            <div className="space-y-4">
              {generated.map((question, index) => (
                <GeneratedCard key={`${question.title}-${index}`} question={question} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <QuestionIcon />
              </div>
              <h3 className="font-heading m-0 text-lg font-semibold text-gray-900">Ready to generate</h3>
              <p className="m-0 mt-1 max-w-[420px] text-[13.5px] leading-relaxed text-gray-500">
                Pick a topic and generate a question. You can attempt it yourself first, then bring it into the tutor for
                step-by-step help.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-heading text-[16px] font-semibold text-gray-900">Recommended starts</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          <RecommendedRow
            tag="Focus area"
            title="Practise something you find difficult"
            sub="Add a focus area in Progress & Results, then use it here."
            onClick={onOpenConvo}
          />
          <RecommendedRow
            tag="Exam skill"
            title="Turn one question into a guided session"
            sub="Attempt first, then ask the tutor for hints only."
            onClick={onOpenConvo}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-heading text-[16px] font-semibold text-gray-900">Past-paper archive</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {papers.map((paper) => (
            <div
              key={paper.key}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white px-5 py-[18px] shadow-[0_1px_2px_rgba(17,24,39,.04)]"
            >
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-heading text-[19px] font-semibold text-gray-900">{paper.year}</span>
                <span className="text-[13px] font-semibold text-emerald-600">{paper.paper}</span>
              </div>
              <div className="mb-3.5 text-[12.5px] leading-snug text-gray-400">{paper.topics}</div>
              <div className="flex-1" />
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-gray-400">{paper.qCount} questions</span>
                <button
                  type="button"
                  onClick={onOpenConvo}
                  className="rounded-[9px] border border-gray-200 bg-gray-100 px-3 py-[7px] text-[12.5px] font-semibold text-emerald-600 transition-colors hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                >
                  Work through
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-[border-color,box-shadow] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1 rounded-[10px] border border-gray-200 bg-gray-50 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={[
            "rounded-[8px] px-3 py-2 text-[12.5px] font-medium transition-colors",
            value === key ? "bg-white text-emerald-700 shadow-[0_1px_2px_rgba(17,24,39,.08)]" : "text-gray-500 hover:text-gray-800",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white px-3.5 py-3 text-left"
    >
      <span className="text-[13px] font-medium text-gray-700">{label}</span>
      <span className={["h-5 w-9 rounded-full p-0.5 transition-colors", checked ? "bg-emerald-500" : "bg-gray-200"].join(" ")}>
        <span className={["block h-4 w-4 rounded-full bg-white transition-transform", checked ? "translate-x-4" : "translate-x-0"].join(" ")} />
      </span>
    </button>
  );
}

function GeneratedCard({ question }: { question: GeneratedExamQuestion }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="m-0 text-[15px] font-semibold text-gray-900">{question.title}</h3>
          <div className="text-[12.5px] text-gray-400">
            {question.topic} / {question.marks} marks
          </div>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-gray-500">{question.level}</span>
      </div>
      <MathMarkdown className="text-[14px] leading-relaxed text-gray-800">{question.question}</MathMarkdown>
      {question.hint && (
        <div className="mt-3 rounded-[12px] border border-emerald-100 bg-emerald-50 px-3.5 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-emerald-600">Hint</div>
          <MathMarkdown className="text-[13px] leading-relaxed text-gray-700">{question.hint}</MathMarkdown>
        </div>
      )}
      {question.workedSolution && (
        <div className="mt-3 rounded-[12px] border border-gray-200 bg-white px-3.5 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-400">Worked solution</div>
          <MathMarkdown className="text-[13px] leading-relaxed text-gray-700">{question.workedSolution}</MathMarkdown>
        </div>
      )}
    </article>
  );
}

function RecommendedRow({
  tag,
  title,
  sub,
  onClick,
}: {
  tag: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[11px] border border-gray-200 bg-white px-4 py-[13px] text-left transition-colors hover:border-emerald-500"
    >
      <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-500">{tag}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-400">{sub}</span>
      </span>
    </button>
  );
}

function QuestionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
