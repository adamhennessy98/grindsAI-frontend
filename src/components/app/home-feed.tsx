"use client";

import { subjectInitial } from "./subjects";
import type { Subject } from "@/lib/types";
import type { SubjectLevel } from "@/lib/onboarding";

interface HomeFeedProps {
  subjects: Subject[];
  subjectLevels?: Record<string, SubjectLevel>;
  onSelectSubject: (id: string) => void;
  onOpenTutor: () => void;
  onOpenSettings: () => void;
}

const SUBJECT_META: Record<string, { focus: string; next: string; score: string; trend: string }> = {
  maths: {
    focus: "Calculus and algebra",
    next: "Mock paper practice",
    score: "72%",
    trend: "+8 pts",
  },
  english: {
    focus: "Comparative and poetry",
    next: "Essay planning",
    score: "68%",
    trend: "+6 pts",
  },
  chemistry: {
    focus: "Stoichiometry",
    next: "Class test prep",
    score: "64%",
    trend: "+4 pts",
  },
  biology: {
    focus: "Genetics and ecology",
    next: "Short questions",
    score: "76%",
    trend: "+5 pts",
  },
  physics: {
    focus: "Mechanics",
    next: "Experiment questions",
    score: "70%",
    trend: "+3 pts",
  },
  irish: {
    focus: "Oral and prose",
    next: "Grammar refresh",
    score: "66%",
    trend: "+4 pts",
  },
};

export function HomeFeed({ subjects, subjectLevels, onSelectSubject, onOpenTutor, onOpenSettings }: HomeFeedProps) {
  const hasProfileSubjects = Boolean(subjectLevels && Object.keys(subjectLevels).length > 0);

  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-16 pt-[30px] sm:px-7">
      <section className="mb-7 overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,.04),0_18px_40px_-32px_rgba(17,24,39,.45)]">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="px-6 py-7 sm:px-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[12.5px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Personal Leaving Cert workspace
            </div>
            <h1 className="font-heading mb-3 max-w-[680px] text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[34px]">
              Choose a subject, then work with the tutor around your exams.
            </h1>
            <p className="m-0 max-w-[650px] text-[14.5px] leading-relaxed text-gray-500">
              Each subject keeps its own tutor session, practice questions, exam tracker, and progress view. The more
              results and feedback you add, the more useful the guidance becomes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => subjects[0] && onSelectSubject(subjects[0].id)}
                className="rounded-[10px] bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Open first subject
              </button>
              <button
                type="button"
                onClick={onOpenTutor}
                className="rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:text-emerald-600"
              >
                Start tutor session
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-6 lg:border-l lg:border-t-0">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">
              Study profile
            </div>
            <div className="space-y-3">
              <ProfileRow label="Subjects shown" value={`${subjects.length}`} />
              <ProfileRow label="Levels" value={levelSummary(subjects, subjectLevels)} />
              <ProfileRow label="Memory source" value="Tutor sessions + exam tracker" />
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              className="mt-5 w-full rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              {hasProfileSubjects ? "Edit subjects and levels" : "Set up selected subjects"}
            </button>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-heading m-0 text-[18px] font-semibold text-gray-900">
          {hasProfileSubjects ? "Your subjects" : "Available subjects"}
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
        <button type="button" onClick={onOpenSettings} className="text-[13px] font-medium text-emerald-700 hover:text-emerald-800">
          Request or edit subjects
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            level={subjectLevels?.[subject.id] ?? "HL"}
            onOpen={() => onSelectSubject(subject.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({ subject, level, onOpen }: { subject: Subject; level: SubjectLevel; onOpen: () => void }) {
  const meta = SUBJECT_META[subject.id] ?? {
    focus: "Exam practice",
    next: "Build a revision plan",
    score: "New",
    trend: "Ready",
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group min-h-[188px] rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[0_1px_2px_rgba(17,24,39,.04)] transition-colors hover:border-emerald-500"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-[13px] font-semibold text-gray-600">
            {subjectInitial(subject.id)}
          </span>
          <span>
            <span className="block font-heading text-[19px] font-semibold text-gray-900">{subject.name}</span>
            <span className="text-[12.5px] text-gray-400">{level === "OL" ? "Ordinary Level" : "Higher Level"}</span>
          </span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
          {meta.trend}
        </span>
      </div>

      <div className="space-y-2.5">
        <MiniMetric label="Current focus" value={meta.focus} />
        <MiniMetric label="Next best step" value={meta.next} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-[12.5px] text-gray-400">
          Average test score <span className="font-semibold text-gray-700">{meta.score}</span>
        </span>
        <span className="text-[13px] font-semibold text-emerald-600 transition-transform group-hover:translate-x-0.5">
          Open workspace
        </span>
      </div>
    </button>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-gray-400">{label}</span>
      <span className="truncate font-medium text-gray-800">{value}</span>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[11px] border border-gray-200 bg-white px-3.5 py-3">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="text-[13px] font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function levelSummary(subjects: Subject[], levels?: Record<string, SubjectLevel>) {
  if (!levels) return "Higher by default";
  const selected = subjects.map((subject) => levels[subject.id] ?? "HL");
  const higher = selected.filter((level) => level === "HL").length;
  const ordinary = selected.length - higher;
  if (!ordinary) return "Higher Level";
  if (!higher) return "Ordinary Level";
  return `${higher} HL / ${ordinary} OL`;
}
