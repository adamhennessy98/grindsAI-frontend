"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import { subjectLabel } from "./subjects";

interface ExamTrackerViewProps {
  subjectId: string;
  level: string;
  onOpenTutor: () => void;
}

type ExamMilestone = {
  id: string;
  topic: string;
  date: string;
  result?: string;
  studentFeedback?: string;
  teacherFeedback?: string;
  source: "sample" | "session";
};

const SAMPLE_MILESTONES: Record<string, ExamMilestone[]> = {
  maths: [
    {
      id: "maths-1",
      topic: "Algebra",
      date: "2026-09-18",
      result: "74%",
      studentFeedback: "Good on factorising, slower on worded functions.",
      teacherFeedback: "Show more working for method marks.",
      source: "sample",
    },
    {
      id: "maths-2",
      topic: "Calculus",
      date: "2026-10-21",
      result: "61%",
      studentFeedback: "Chain rule and rates of change need practice.",
      source: "sample",
    },
    {
      id: "maths-3",
      topic: "Differentiation class test",
      date: "2026-11-12",
      source: "sample",
    },
  ],
  chemistry: [
    {
      id: "chem-1",
      topic: "Atomic theory",
      date: "2026-09-25",
      result: "78%",
      source: "sample",
    },
    {
      id: "chem-2",
      topic: "Stoichiometry",
      date: "2026-10-30",
      source: "sample",
    },
  ],
};

export function ExamTrackerView({ subjectId, level, onOpenTutor }: ExamTrackerViewProps) {
  const topics = getSubjectTopics(subjectId);
  const [topic, setTopic] = useState(topics[0]?.name ?? "General");
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");
  const [studentFeedback, setStudentFeedback] = useState("");
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [sessionMilestones, setSessionMilestones] = useState<ExamMilestone[]>([]);

  const milestones = useMemo(() => {
    const sample = SAMPLE_MILESTONES[subjectId] ?? [
      {
        id: `${subjectId}-baseline`,
        topic: "First tracked assessment",
        date: "2026-09-20",
        source: "sample" as const,
      },
    ];

    return [...sample, ...sessionMilestones].sort((a, b) => a.date.localeCompare(b.date));
  }, [sessionMilestones, subjectId]);

  const canAdd = Boolean(topic && date);

  const addMilestone = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canAdd) return;

    setSessionMilestones((current) => [
      ...current,
      {
        id: `session-${Date.now()}`,
        topic,
        date,
        result: result.trim() || undefined,
        studentFeedback: studentFeedback.trim() || undefined,
        teacherFeedback: teacherFeedback.trim() || undefined,
        source: "session",
      },
    ]);
    setDate("");
    setResult("");
    setStudentFeedback("");
    setTeacherFeedback("");
  };

  return (
    <div className="mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-amber-600">
            {subjectLabel(subjectId)} / {level === "OL" ? "Ordinary Level" : "Higher Level"}
          </div>
          <h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-0.02em] text-gray-900">
            Exam tracker
          </h1>
          <p className="m-0 mt-1 max-w-[660px] text-sm leading-relaxed text-gray-500">
            Add school tests, past-paper attempts, mocks, and upcoming assessments. Topic and date are enough to create
            the milestone; results and feedback can be added when you have them.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTutor}
          className="rounded-[10px] border border-amber-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-amber-500 hover:text-amber-700"
        >
          Prep with tutor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <form onSubmit={addMilestone} className="rounded-2xl border border-amber-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(245,158,11,.75)]">
          <h2 className="font-heading m-0 text-lg font-semibold text-gray-900">Create exam instance</h2>
          <p className="m-0 mb-5 mt-1 text-[13px] leading-relaxed text-gray-500">
            Required now: topic and date. Optional later: result, feedback, teacher feedback, and corrected PDF.
          </p>

          <div className="space-y-4">
            <Field label="Topic">
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className={inputCls}
              >
                {topics.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date">
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputCls} />
            </Field>

            <Field label="Result, optional">
              <input
                value={result}
                onChange={(event) => setResult(event.target.value)}
                placeholder="Example: 72%, H3, 42/60"
                className={inputCls}
              />
            </Field>

            <Field label="Your feedback, optional">
              <textarea
                value={studentFeedback}
                onChange={(event) => setStudentFeedback(event.target.value)}
                placeholder="What felt easy or difficult?"
                className={`${inputCls} min-h-[82px] resize-none py-3`}
              />
            </Field>

            <Field label="Teacher feedback, optional">
              <textarea
                value={teacherFeedback}
                onChange={(event) => setTeacherFeedback(event.target.value)}
                placeholder="Add teacher comments when you get them back."
                className={`${inputCls} min-h-[82px] resize-none py-3`}
              />
            </Field>

            <div className="rounded-[12px] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 dark:bg-amber-400/10">
              <div className="text-[13px] font-semibold text-gray-700">Corrected test PDF</div>
              <p className="m-0 mt-1 text-[12.5px] leading-relaxed text-gray-400">
                Upload and automatic scan analysis are planned for the next implementation pass.
              </p>
            </div>

            <button
              type="submit"
              disabled={!canAdd}
              className="w-full rounded-[10px] bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400"
            >
              Add test
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-amber-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(245,158,11,.75)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading m-0 text-lg font-semibold text-gray-900">Chronological roadmap</h2>
              <p className="m-0 mt-1 text-[13px] text-gray-500">Past attempts, upcoming assessments, and future milestones.</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700">
              {milestones.length} milestones
            </span>
          </div>

          <div className="relative">
            <div className="absolute bottom-3 left-[15px] top-3 w-px bg-gray-200" />
            <div className="space-y-4">
              {milestones.map((item) => (
                <MilestoneCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-[border-color,box-shadow] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/[0.1]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function MilestoneCard({ item }: { item: ExamMilestone }) {
  const hasResult = Boolean(item.result);

  return (
    <article className="relative ml-10 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-4 dark:bg-amber-400/10">
      <span
        className={[
          "absolute -left-[33px] top-5 h-[15px] w-[15px] rounded-full border-[3px] border-white",
          hasResult ? "bg-amber-500" : "bg-gray-400",
        ].join(" ")}
      />
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="m-0 text-[15px] font-semibold text-gray-900">{item.topic}</h3>
          <div className="text-[12.5px] text-gray-400">{formatDate(item.date)}</div>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-gray-500">
          {hasResult ? item.result : "No result yet"}
        </span>
      </div>

      {item.studentFeedback || item.teacherFeedback ? (
        <div className="space-y-2">
          {item.studentFeedback && <Feedback label="Student note" value={item.studentFeedback} />}
          {item.teacherFeedback && <Feedback label="Teacher note" value={item.teacherFeedback} />}
        </div>
      ) : (
        <p className="m-0 text-[13px] leading-relaxed text-gray-500">
          Add a result or feedback when this assessment is returned. Until then, it still acts as an upcoming milestone.
        </p>
      )}

      {item.source === "session" && (
        <div className="mt-3 text-[11.5px] font-medium text-amber-700">Added this session</div>
      )}
    </article>
  );
}

function Feedback({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-amber-100 bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-400">{label}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-gray-700">{value}</div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
