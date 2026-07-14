"use client";

import { subjectInitial } from "./subjects";
import type { Subject } from "@/lib/types";
import type { SubjectLevel } from "@/lib/onboarding";

interface HomeFeedProps {
  hasProfile: boolean;
  subjects: Subject[];
  subjectLevels?: Record<string, SubjectLevel>;
  onSelectSubject: (id: string) => void;
  onOpenSettings: () => void;
}

const SUBJECT_META: Record<string, { focus: string; next: string }> = {
  maths: { focus: "Calculus and algebra", next: "Mock paper practice" },
  english: { focus: "Comparative and poetry", next: "Essay planning" },
  chemistry: { focus: "Stoichiometry", next: "Class test prep" },
  biology: { focus: "Genetics and ecology", next: "Short questions" },
  physics: { focus: "Mechanics", next: "Experiment questions" },
  irish: { focus: "Oral and prose", next: "Grammar refresh" },
};

export function HomeFeed({ hasProfile, subjects, subjectLevels, onSelectSubject, onOpenSettings }: HomeFeedProps) {
  if (!hasProfile) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[680px] items-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-3xl border border-white/80 bg-white/86 px-6 py-8 text-center shadow-[0_18px_50px_-34px_rgba(15,23,42,.55)] backdrop-blur-sm sm:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dcfce7,#cffafe)] text-emerald-700 shadow-[0_14px_30px_-20px_rgba(34,211,238,.8)]">
            <GridIcon />
          </div>
          <h1 className="font-heading m-0 text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
            Set up your subjects first
          </h1>
          <p className="mx-auto mt-2 max-w-[430px] text-[14.5px] leading-relaxed text-gray-500">
            Choose your Leaving Cert subjects so your tutor knows what to help with.
          </p>
          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-6 w-full rounded-xl bg-[linear-gradient(135deg,#10b981,#06b6d4)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-24px_rgba(6,182,212,.85)] transition-transform hover:scale-[1.01] sm:w-auto"
          >
            Set up study profile
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
      <section className="mb-6">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-cyan-600">
          My subjects
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[36px]">
              What are you studying today?
            </h1>
            <p className="m-0 mt-2 max-w-[580px] text-[14.5px] leading-relaxed text-gray-500">
              Pick a subject to open its tutor, practice, tracker, and progress tools.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full rounded-xl border border-cyan-100 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 shadow-[0_10px_30px_-28px_rgba(8,145,178,.85)] transition-[background-color,border-color,color,box-shadow,transform] hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-[0_18px_38px_-24px_rgba(8,145,178,.9)] focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/15 sm:w-auto dark:hover:bg-cyan-400/12 dark:hover:text-cyan-100"
          >
            Need to add a subject?
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            level={subjectLevels?.[subject.id] ?? "HL"}
            onOpen={() => onSelectSubject(subject.id)}
          />
        ))}
      </div>

      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.72fr]">
        <div className="rounded-2xl border border-cyan-100 bg-white/86 px-4 py-4 shadow-[0_12px_34px_-30px_rgba(8,145,178,.7)] backdrop-blur-sm sm:px-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-heading m-0 text-[17px] font-semibold text-gray-900">Upcoming</h2>
            <span className="text-xs font-medium text-gray-400">Visual for now</span>
          </div>
          <div className="space-y-2">
            <UpcomingRow title="Study plan review" meta="Today / all subjects" />
            <UpcomingRow title="Next class test" meta="Add exact dates in Exam Tracker" />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-[linear-gradient(135deg,rgba(255,251,235,.92),rgba(240,253,244,.86))] px-4 py-4 shadow-[0_12px_34px_-30px_rgba(245,158,11,.7)] backdrop-blur-sm sm:px-5">
          <h2 className="font-heading m-0 text-[17px] font-semibold text-gray-900">Study profile</h2>
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">
            {subjects.length} subjects selected. Levels: {levelSummary(subjects, subjectLevels)}.
          </p>
          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-3 rounded-xl border border-amber-100 bg-white/85 px-3.5 py-2.5 text-[13px] font-medium text-gray-700 transition-[background-color,border-color,color,box-shadow,transform] hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow-[0_14px_30px_-24px_rgba(245,158,11,.9)] focus-visible:border-amber-500 focus-visible:ring-4 focus-visible:ring-amber-500/15 dark:hover:bg-amber-400/12 dark:hover:text-amber-100"
          >
            Edit profile
          </button>
        </div>
      </section>
    </div>
  );
}

function SubjectCard({ subject, level, onOpen }: { subject: Subject; level: SubjectLevel; onOpen: () => void }) {
  const meta = SUBJECT_META[subject.id] ?? {
    focus: "Exam practice",
    next: "Build a revision plan",
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group rounded-2xl border border-white/80 bg-white/88 p-4 text-left shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] backdrop-blur-sm transition-[background-color,border-color,transform,box-shadow] hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-[0_24px_54px_-30px_rgba(8,145,178,.95)] focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/15 sm:p-5 dark:hover:bg-cyan-400/12"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff,#dcfce7)] text-[13px] font-semibold text-cyan-800">
            {subjectInitial(subject.id)}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-[19px] font-semibold text-gray-900">{subject.name}</span>
            <span className="text-[12.5px] text-gray-400">{level === "OL" ? "Ordinary Level" : "Higher Level"}</span>
          </span>
        </div>
      </div>

      <p className="m-0 min-h-[42px] text-[14px] leading-relaxed text-gray-500">
        Next step: <span className="font-medium text-gray-800">{meta.next}</span>
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="truncate text-[12.5px] text-gray-400">{meta.focus}</span>
        <span className="ml-3 shrink-0 rounded-xl bg-[linear-gradient(135deg,#10b981,#22d3ee)] px-3 py-1.5 text-[13px] font-semibold text-white shadow-[0_10px_24px_-18px_rgba(34,211,238,.9)] transition-[transform,box-shadow,filter] group-hover:scale-[1.06] group-hover:brightness-110 group-hover:shadow-[0_14px_28px_-16px_rgba(34,211,238,1)]">
          Open
        </span>
      </div>
    </button>
  );
}

function UpcomingRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-[linear-gradient(135deg,#f8fafc,#ecfeff)] px-3 py-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,.14)]" />
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-gray-900">{title}</span>
        <span className="block truncate text-xs text-gray-400">{meta}</span>
      </span>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
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
