"use client";

import { useState } from "react";
import { subjectLabel } from "./subjects";

interface ProgressViewProps {
  subjectId: string;
  level: string;
  onOpenConvo: () => void;
}

type ProgressSeed = {
  average: string;
  trend: string;
  strongest: string;
  weakest: string;
  chartTitle: string;
  skills: { label: string; pct: number }[];
  recurring: { title: string; sub: string }[];
};

const PROGRESS: Record<string, ProgressSeed> = {
  maths: {
    average: "72%",
    trend: "+11 pts this term",
    strongest: "Algebra",
    weakest: "Chain rule",
    chartTitle: "Calculus accuracy",
    skills: [
      { label: "Algebra and functions", pct: 88 },
      { label: "Coordinate geometry", pct: 76 },
      { label: "Calculus", pct: 63 },
    ],
    recurring: [
      { title: "Chain rule in differentiation", sub: "Seen in 4 sessions, improving slowly" },
      { title: "Rates of change", sub: "Correct method, weaker setup" },
      { title: "Showing method marks", sub: "Answers are better than written working" },
    ],
  },
  chemistry: {
    average: "64%",
    trend: "+7 pts this term",
    strongest: "Atomic theory",
    weakest: "Stoichiometry",
    chartTitle: "Stoichiometry accuracy",
    skills: [
      { label: "Atomic theory", pct: 82 },
      { label: "Bonding", pct: 74 },
      { label: "Stoichiometry", pct: 58 },
    ],
    recurring: [
      { title: "Mass to mole conversions", sub: "Units are the main source of lost marks" },
      { title: "Limiting reagent questions", sub: "Needs more structured setup" },
      { title: "Volumetric analysis wording", sub: "Formula choice is sometimes rushed" },
    ],
  },
};

export function ProgressView({ subjectId, level, onOpenConvo }: ProgressViewProps) {
  const subject = subjectLabel(subjectId);
  const seed = PROGRESS[subjectId] ?? {
    average: "New",
    trend: "Add tests to build a trend",
    strongest: "Not enough data yet",
    weakest: "Not enough data yet",
    chartTitle: "Score trend",
    skills: [
      { label: "Exam technique", pct: 58 },
      { label: "Topic recall", pct: 52 },
      { label: "Written working", pct: 49 },
    ],
    recurring: [
      { title: "No repeated mistake identified yet", sub: "Track more tests and sessions to surface patterns" },
      { title: "Add teacher feedback", sub: "Teacher comments will sharpen the progress view" },
    ],
  };

  const [struggles, setStruggles] = useState("");
  const [easyAreas, setEasyAreas] = useState("");
  const [savedNote, setSavedNote] = useState<{ struggles: string; easyAreas: string } | null>(null);

  const saveNote = () => {
    setSavedNote({
      struggles: struggles.trim(),
      easyAreas: easyAreas.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-violet-600">
            {subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"}
          </div>
          <h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-0.02em] text-gray-900">My progress</h1>
          <p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">
            A simple summary of what the tutor knows: scores, strengths, repeated mistakes, and the next area to work on.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenConvo}
          className="rounded-[10px] bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
        >
          Work on weakest area
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile label="Average test score" value={seed.average} valueColor="text-violet-600" caption={seed.trend} />
        <StatTile label="Strongest area" value={seed.strongest} valueColor="text-gray-900" caption="Based on recent results" />
        <StatTile label="Main focus" value={seed.weakest} valueColor="text-gray-900" caption="Recommended next step" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-violet-100 bg-white px-[22px] py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.65)]">
            <h2 className="font-heading mb-3.5 flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Areas going well
            </h2>
            <div className="flex flex-col gap-3.5">
              {seed.skills.map((skill) => (
                <SkillBar key={skill.label} label={skill.label} pct={skill.pct} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-violet-100 bg-white px-[22px] py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.65)]">
            <h2 className="font-heading mb-1.5 flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="h-2 w-2 rounded-full bg-gray-500" />
              Repeated mistakes
            </h2>
            <p className="m-0 mb-3.5 text-[12.5px] text-gray-400">Patterns pulled from tutor sessions and tracked tests.</p>
            <div className="flex flex-col gap-2.5">
              {seed.recurring.map((item) => (
                <RecurringRow key={item.title} title={item.title} sub={item.sub} onClick={onOpenConvo} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-violet-100 bg-white px-[22px] py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.65)]">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-heading m-0 text-base font-semibold text-gray-900">{seed.chartTitle}</h2>
              <span className="text-xs font-semibold text-violet-600">{seed.trend}</span>
            </div>
            <p className="m-0 mb-4 text-[12.5px] text-gray-400">Illustrative trend from recent tracked assessments.</p>
            <ProgressChart />
          </section>

          <section className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-[18px] dark:bg-violet-400/10">
            <h2 className="font-heading m-0 text-base font-semibold text-gray-900">Tell the tutor more</h2>
            <p className="m-0 mb-4 mt-1 text-[13px] leading-relaxed text-gray-500">
              Add your own view of what feels hard or easy. For now this saves visually in the current session only.
            </p>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-medium text-gray-700">I am struggling with</span>
                <textarea
                  value={struggles}
                  onChange={(event) => setStruggles(event.target.value)}
                  placeholder="Example: worded calculus questions, timing, remembering formulae"
                  className={textareaCls}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-medium text-gray-700">I find easy</span>
                <textarea
                  value={easyAreas}
                  onChange={(event) => setEasyAreas(event.target.value)}
                  placeholder="Example: algebra basics, definitions, short questions"
                  className={textareaCls}
                />
              </label>
              <button
                type="button"
                onClick={saveNote}
                className="w-full rounded-[10px] border border-violet-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-violet-500 hover:text-violet-600"
              >
                Save note
              </button>
            </div>
            {savedNote && (savedNote.struggles || savedNote.easyAreas) && (
              <div className="mt-4 rounded-[12px] border border-violet-100 bg-violet-50 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.07em] text-violet-600">Saved this session</div>
                {savedNote.struggles && <p className="m-0 mt-2 text-[13px] text-gray-700">Struggling with: {savedNote.struggles}</p>}
                {savedNote.easyAreas && <p className="m-0 mt-1 text-[13px] text-gray-700">Finds easy: {savedNote.easyAreas}</p>}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const textareaCls =
  "min-h-[86px] w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition-[border-color,box-shadow] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/[0.1]";

function StatTile({
  label,
  value,
  valueColor,
  caption,
}: {
  label: string;
  value: string;
  valueColor: string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white px-5 py-[18px] shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)]">
      <div className="mb-2 text-[12.5px] text-gray-400">{label}</div>
      <div className={`font-heading text-[27px] font-semibold ${valueColor}`}>{value}</div>
      <div className="mt-1 text-xs text-gray-400">{caption}</div>
    </div>
  );
}

function SkillBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[13px]">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-violet-600">{pct}%</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-md bg-gray-200">
        <div className="h-full rounded-md bg-violet-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RecurringRow({ title, sub, onClick }: { title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[10px] border border-violet-100 bg-violet-50/50 px-3.5 py-[11px] text-left transition-colors hover:border-violet-500 dark:bg-violet-400/10"
    >
      <span className="flex-1">
        <span className="block text-[13.5px] font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-400">{sub}</span>
      </span>
      <span className="shrink-0 rounded-xl bg-white px-2 py-0.5 text-[11px] font-semibold text-violet-600">Practise</span>
    </button>
  );
}

function ProgressChart() {
  return (
    <svg viewBox="0 0 320 150" className="block h-auto w-full" aria-hidden="true">
      <line x1="34" y1="14" x2="34" y2="118" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="34" y1="118" x2="312" y2="118" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="34" y1="40" x2="312" y2="40" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="34" y1="79" x2="312" y2="79" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 4" />
      <text x="26" y="44" textAnchor="end" fontSize="9" fill="#9CA3AF">80</text>
      <text x="26" y="83" textAnchor="end" fontSize="9" fill="#9CA3AF">50</text>
      <text x="26" y="121" textAnchor="end" fontSize="9" fill="#9CA3AF">20</text>
      <path d="M48,96 L114,90 L180,70 L246,58 L300,49 L300,118 L48,118 Z" fill="#8B5CF6" opacity="0.1" />
      <path d="M48,96 L114,90 L180,70 L246,58 L300,49" fill="none" stroke="#8B5CF6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="96" r="3.4" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="114" cy="90" r="3.4" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="180" cy="70" r="3.4" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="246" cy="58" r="3.4" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="300" cy="49" r="4.2" fill="#8B5CF6" />
      <text x="48" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Sep</text>
      <text x="114" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Oct</text>
      <text x="180" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Nov</text>
      <text x="246" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Dec</text>
      <text x="300" y="134" textAnchor="middle" fontSize="9" fill="#8B5CF6" fontWeight="600">Now</text>
    </svg>
  );
}
