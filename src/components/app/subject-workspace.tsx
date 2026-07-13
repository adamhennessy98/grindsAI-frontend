"use client";

import { subjectInitial, subjectLabel } from "./subjects";

interface SubjectWorkspaceProps {
  subjectId: string;
  level: string;
  onOpenTutor: () => void;
  onOpenGenerator: () => void;
  onOpenTracker: () => void;
  onOpenProgress: () => void;
}

const WORKSPACE_COPY: Record<string, { focus: string; nextExam: string }> = {
  maths: {
    focus: "Calculus, algebra, and exam timing",
    nextExam: "Differentiation class test",
  },
  chemistry: {
    focus: "Moles, acids and bases, and organic chemistry",
    nextExam: "Stoichiometry class test",
  },
  english: {
    focus: "Comparative essays and poetry",
    nextExam: "Comparative essay checkpoint",
  },
  biology: {
    focus: "Genetics, ecology, and experiment questions",
    nextExam: "Short-question practice",
  },
};

const ACTIONS = [
  {
    title: "Tutor",
    body: "Get step-by-step help.",
    cta: "Start",
    accent: "cyan",
  },
  {
    title: "Practice Questions",
    body: "Generate exam-style questions.",
    cta: "Practise",
    accent: "lime",
  },
  {
    title: "Exam Tracker",
    body: "Log tests, mocks, and results.",
    cta: "Track",
    accent: "amber",
  },
  { title: "My Progress", body: "See strengths, weak areas, and next steps.", cta: "View", accent: "violet" },
] as const;

export function SubjectWorkspace({
  subjectId,
  level,
  onOpenTutor,
  onOpenGenerator,
  onOpenTracker,
  onOpenProgress,
}: SubjectWorkspaceProps) {
  const subject = subjectLabel(subjectId);
  const copy = WORKSPACE_COPY[subjectId] ?? {
    focus: "Exam practice and revision planning",
    nextExam: "Next assessment",
  };
  const handlers = [onOpenTutor, onOpenGenerator, onOpenTracker, onOpenProgress];

  return (
    <div className="mx-auto max-w-[1040px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
      <section className="mb-5 rounded-3xl border border-white/80 bg-white/88 px-5 py-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,.55)] backdrop-blur-sm sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff,#fef3c7)] font-heading text-lg font-semibold text-cyan-900 shadow-[0_14px_30px_-22px_rgba(34,211,238,.8)]">
            {subjectInitial(subjectId)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-cyan-600">
              {level === "OL" ? "Ordinary Level" : "Higher Level"}
            </div>
            <h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[34px]">
              {subject}
            </h1>
            <p className="m-0 mt-1 text-[14px] leading-relaxed text-gray-500">{copy.focus}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACTIONS.map((action, index) => (
          <ActionCard
            key={action.title}
            title={action.title}
            body={action.body}
            cta={action.cta}
            accent={action.accent}
            onClick={handlers[index]}
          />
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-amber-100 bg-white/88 px-4 py-4 shadow-[0_14px_38px_-34px_rgba(245,158,11,.8)] backdrop-blur-sm sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-heading m-0 text-[17px] font-semibold text-gray-900">Upcoming in this subject</h2>
          <span className="text-xs font-medium text-gray-400">Short view</span>
        </div>
        <div className="rounded-xl border border-amber-100 bg-[linear-gradient(135deg,#fffbeb,#ecfeff)] px-3.5 py-3">
          <div className="text-[14px] font-semibold text-gray-900">{copy.nextExam}</div>
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">
            Add the exact topic and date in Exam Tracker, then use Tutor or Practice Questions to prepare.
          </p>
        </div>
      </section>
    </div>
  );
}

function ActionCard({
  title,
  body,
  cta,
  accent,
  onClick,
}: {
  title: string;
  body: string;
  cta: string;
  accent: "cyan" | "lime" | "amber" | "violet";
  onClick: () => void;
}) {
  const accentClass = {
    cyan: "border-cyan-100 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-[0_24px_54px_-30px_rgba(8,145,178,.95)] active:border-cyan-500 active:bg-cyan-100/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15 dark:hover:bg-cyan-400/12 dark:hover:border-cyan-300/80",
    lime: "border-lime-100 hover:border-lime-400 hover:bg-lime-50 hover:shadow-[0_24px_54px_-30px_rgba(101,163,13,.9)] active:border-lime-500 active:bg-lime-100/70 focus-visible:border-lime-500 focus-visible:ring-lime-500/15 dark:hover:bg-lime-400/12 dark:hover:border-lime-300/80",
    amber: "border-amber-100 hover:border-amber-400 hover:bg-amber-50 hover:shadow-[0_24px_54px_-30px_rgba(245,158,11,.95)] active:border-amber-500 active:bg-amber-100/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/15 dark:hover:bg-amber-400/12 dark:hover:border-amber-300/80",
    violet: "border-violet-100 hover:border-violet-400 hover:bg-violet-50 hover:shadow-[0_24px_54px_-30px_rgba(139,92,246,.95)] active:border-violet-500 active:bg-violet-100/70 focus-visible:border-violet-500 focus-visible:ring-violet-500/15 dark:hover:bg-violet-400/12 dark:hover:border-violet-300/80",
  }[accent];
  const pillClass = {
    cyan: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_12px_26px_-18px_rgba(8,145,178,1)] dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950",
    lime: "bg-lime-50 text-lime-700 group-hover:bg-lime-500 group-hover:text-white group-hover:shadow-[0_12px_26px_-18px_rgba(101,163,13,1)] dark:group-hover:bg-lime-400 dark:group-hover:text-slate-950",
    amber: "bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_12px_26px_-18px_rgba(245,158,11,1)] dark:group-hover:bg-amber-400 dark:group-hover:text-slate-950",
    violet: "bg-violet-50 text-violet-700 group-hover:bg-violet-500 group-hover:text-white group-hover:shadow-[0_12px_26px_-18px_rgba(139,92,246,1)] dark:group-hover:bg-violet-400 dark:group-hover:text-slate-950",
  }[accent];
  const arrowClass = {
    cyan: "text-cyan-600 group-hover:text-cyan-700 dark:group-hover:text-cyan-200",
    lime: "text-lime-600 group-hover:text-lime-700 dark:group-hover:text-lime-200",
    amber: "text-amber-600 group-hover:text-amber-700 dark:group-hover:text-amber-200",
    violet: "text-violet-600 group-hover:text-violet-700 dark:group-hover:text-violet-200",
  }[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        `feature-action-card feature-action-${accent}`,
        "group min-h-[150px] rounded-2xl border bg-white/88 p-5 text-left text-gray-900 shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] backdrop-blur-sm transition-[border-color,transform,box-shadow,background-color]",
        "hover:-translate-y-1 focus-visible:ring-4",
        accentClass,
      ].join(" ")}
    >
      <div className="font-heading text-[22px] font-semibold">{title}</div>
      <p className="m-0 mt-2 text-[14px] leading-relaxed text-gray-500">{body}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className={["feature-action-pill rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-[background-color,color,box-shadow,transform] group-hover:scale-[1.04]", pillClass].join(" ")}>
          {cta}
        </span>
        <span aria-hidden="true" className={["transition-transform group-hover:translate-x-0.5", arrowClass].join(" ")}>
          &rarr;
        </span>
      </div>
    </button>
  );
}
