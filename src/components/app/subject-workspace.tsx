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

const WORKSPACE_COPY: Record<string, { focus: string; nextExam: string; weak: string; strong: string }> = {
  maths: {
    focus: "Calculus, algebra, and exam timing",
    nextExam: "Class test on differentiation",
    weak: "Chain rule questions",
    strong: "Algebraic manipulation",
  },
  chemistry: {
    focus: "Moles, acids and bases, and organic chemistry",
    nextExam: "Stoichiometry class test",
    weak: "Mass to mole conversions",
    strong: "Atomic theory",
  },
  english: {
    focus: "Comparative essays and poetry",
    nextExam: "Comparative essay checkpoint",
    weak: "Linking paragraphs under time pressure",
    strong: "Clear thesis statements",
  },
  biology: {
    focus: "Genetics, ecology, and experiment questions",
    nextExam: "Short-question practice",
    weak: "Genetic crosses",
    strong: "Ecology definitions",
  },
};

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
    weak: "Needs more tracker data",
    strong: "Building a baseline",
  };

  return (
    <div className="mx-auto max-w-[1040px] px-5 pb-16 pt-[30px] sm:px-7">
      <div className="mb-6 flex flex-col gap-4 rounded-[18px] border border-gray-200 bg-white px-6 py-6 shadow-[0_1px_2px_rgba(17,24,39,.04),0_18px_40px_-32px_rgba(17,24,39,.45)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 font-heading text-lg font-semibold text-gray-700">
            {subjectInitial(subjectId)}
          </div>
          <div>
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
              {level === "OL" ? "Ordinary Level" : "Higher Level"}
            </div>
            <h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-0.02em] text-gray-900">
              {subject} workspace
            </h1>
            <p className="m-0 mt-1 text-sm text-gray-500">{copy.focus}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenTutor}
          className="rounded-[10px] bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Start with tutor
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <WorkspaceTile
          eyebrow="Socratic help"
          title="Tutor"
          body="Work through questions step by step. The tutor asks, hints, checks your reasoning, and keeps the focus on understanding."
          stat="Guided session"
          icon={<TutorIcon />}
          onClick={onOpenTutor}
        />
        <WorkspaceTile
          eyebrow="Exam practice"
          title="Practice Questions"
          body="Generate Leaving Cert-style questions by topic, level, type, and difficulty. Use hints or worked solutions when needed."
          stat="Generator ready"
          icon={<QuestionIcon />}
          onClick={onOpenGenerator}
        />
        <WorkspaceTile
          eyebrow="Assessment memory"
          title="Exam Tracker"
          body="Record class tests, past-paper attempts, mocks, and scanned corrections so patterns are visible over time."
          stat="Topic + date required"
          icon={<TrackerIcon />}
          onClick={onOpenTracker}
        />
        <WorkspaceTile
          eyebrow="Tutor memory"
          title="My Progress"
          body="See average scores, strengths, recurring mistakes, and recommended next steps for this subject."
          stat="Updates with evidence"
          icon={<ProgressIcon />}
          onClick={onOpenProgress}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading m-0 text-lg font-semibold text-gray-900">Subject roadmap</h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-semibold text-gray-500">
              Chronological
            </span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0">
            <RoadmapDot tone="done" />
            <RoadmapItem title="Last tracked result" meta="Past-paper attempt added" detail="This gives the tutor a first signal for strengths and gaps." />
            <RoadmapLine />
            <div />
            <RoadmapDot tone="current" />
            <RoadmapItem title={copy.nextExam} meta="Upcoming assessment" detail="Use the tracker to add topic and date, then practise related questions." />
            <RoadmapLine />
            <div />
            <RoadmapDot tone="future" />
            <RoadmapItem title="Leaving Cert revision block" meta="Long-term milestone" detail="Progress view should become more accurate as more tests are recorded." />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5">
          <h2 className="font-heading m-0 mb-4 text-lg font-semibold text-gray-900">Current picture</h2>
          <div className="space-y-3">
            <InsightRow label="Doing well in" value={copy.strong} />
            <InsightRow label="Needs work" value={copy.weak} />
            <InsightRow label="Next best action" value="Add the next assessment to the tracker" />
          </div>
        </section>
      </div>
    </div>
  );
}

function WorkspaceTile({
  eyebrow,
  title,
  body,
  stat,
  icon,
  onClick,
}: {
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[0_1px_2px_rgba(17,24,39,.04)] transition-colors hover:border-emerald-500"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>
        <span className="text-[12.5px] font-semibold text-emerald-600 transition-transform group-hover:translate-x-0.5">
          Open
        </span>
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">{eyebrow}</div>
      <h3 className="font-heading m-0 mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="m-0 min-h-[66px] text-[13.5px] leading-relaxed text-gray-500">{body}</p>
      <div className="mt-4 border-t border-gray-100 pt-3 text-[12.5px] font-semibold text-gray-600">{stat}</div>
    </button>
  );
}

function RoadmapDot({ tone }: { tone: "done" | "current" | "future" }) {
  const cls =
    tone === "done"
      ? "bg-emerald-500"
      : tone === "current"
        ? "border-[3px] border-emerald-500 bg-white"
        : "border-2 border-gray-300 bg-white";
  return <span className={`mt-1.5 h-4 w-4 rounded-full ${cls}`} />;
}

function RoadmapLine() {
  return <div className="ml-[7px] h-8 w-px bg-gray-200" />;
}

function RoadmapItem({ title, meta, detail }: { title: string; meta: string; detail: string }) {
  return (
    <div className="pb-4">
      <div className="text-[14px] font-semibold text-gray-900">{title}</div>
      <div className="text-[12.5px] text-gray-400">{meta}</div>
      <p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">{detail}</p>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-3">
      <div className="text-[12px] font-semibold uppercase tracking-[0.07em] text-gray-400">{label}</div>
      <div className="mt-1 text-[14px] font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function TutorIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5a3.5 3.5 0 0 1-3.5 3.5h-3.2L8 19v-4.1A3.5 3.5 0 0 1 5 11.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8h6M9 11h3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrackerIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h10M7 20h10M8.5 4v4.5c0 1.6 1 2.5 2.2 3.5-1.2 1-2.2 1.9-2.2 3.5V20M15.5 4v4.5c0 1.6-1 2.5-2.2 3.5 1.2 1 2.2 1.9 2.2 3.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
