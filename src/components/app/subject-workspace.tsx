"use client";

import { getTopic } from "@/lib/constants";
import { RecommendationCard } from "./recommendation-card";
import type { SubjectStudyState } from "./study-state";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";

interface SubjectWorkspaceProps { subjectId: string; level: string; studyState: SubjectStudyState; onOpenTutor: () => void; onOpenGenerator: () => void; onOpenProgress: () => void; }

const actions = [
  { title: "Tutor", description: "Get guided help with the topic or question in front of you.", cta: "Ask your Tutor", accent: "cyan" },
  { title: "Exam Questions", description: "Attempt one focused exam-style question at a time.", cta: "Generate a question", accent: "lime" },
  { title: "Progress & Results", description: "Track what feels difficult, what improved, and your next step.", cta: "Review progress", accent: "violet" },
] as const;

export function SubjectWorkspace({ subjectId, level, studyState, onOpenTutor, onOpenGenerator, onOpenProgress }: SubjectWorkspaceProps) {
  const subject = subjectLabel(subjectId);
  const focus = studyState.focusAreas.find((area) => area.status === "current");
  const recentTopic = studyState.lastTopicId ? getTopic(subjectId, studyState.lastTopicId) : null;
  const recommendation = focus
    ? { title: `Practise ${focus.label}`, reason: "Based on your current focus area.", cta: "Start question", onClick: onOpenGenerator, feature: "questions" as const }
    : recentTopic
      ? { title: `Continue ${recentTopic.name} with your Tutor`, reason: "Based on your recent Tutor session.", cta: "Continue", onClick: onOpenTutor, feature: "tutor" as const }
      : { title: "Add your first focus area", reason: "It helps GrindsAI recommend what to do next.", cta: "Review progress", onClick: onOpenProgress, feature: "progress" as const };
  const handlers = [onOpenTutor, onOpenGenerator, onOpenProgress];

  return <div style={subjectThemeStyle(subjectId)} className="animate-fade-up mx-auto max-w-[1040px] px-4 pb-12 pt-5 sm:px-6 lg:pt-7"><header className="mb-4 flex items-center gap-3"><span className="subject-accent-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-heading text-[15px] font-semibold">{subjectInitial(subjectId)}</span><div className="min-w-0"><h1 className="font-heading m-0 truncate text-[25px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white sm:text-[29px]">{subject}</h1><div className="subject-context-label text-[12px] font-semibold uppercase tracking-[.08em]">{level === "OL" ? "Ordinary Level" : "Higher Level"}</div></div></header><RecommendationCard {...recommendation} /><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{actions.map((action, index) => <ActionCard key={action.title} {...action} onClick={handlers[index]} />)}</div></div>;
}

function ActionCard({ title, description, cta, accent, onClick }: (typeof actions)[number] & { onClick: () => void }) {
  const tones = { cyan: "border-cyan-100 hover:border-cyan-400 hover:bg-cyan-50 focus-visible:ring-cyan-300 dark:hover:bg-cyan-400/12", lime: "border-lime-100 hover:border-lime-400 hover:bg-lime-50 focus-visible:ring-lime-300 dark:hover:bg-lime-400/12", violet: "border-violet-100 hover:border-violet-400 hover:bg-violet-50 focus-visible:ring-violet-300 dark:hover:bg-violet-400/12" }[accent];
  const pill = { cyan: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-500", lime: "bg-lime-50 text-lime-700 group-hover:bg-lime-500", violet: "bg-violet-50 text-violet-700 group-hover:bg-violet-500" }[accent];
  return <button type="button" onClick={onClick} className={`group flex min-h-[174px] flex-col rounded-2xl border bg-white/88 p-5 text-left shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] transition-[border-color,transform,box-shadow,background-color] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-30px_rgba(15,23,42,.55)] focus-visible:outline-none focus-visible:ring-4 dark:!bg-slate-900 ${tones}`}><h2 className="font-heading m-0 text-[20px] font-semibold text-gray-900 dark:text-white">{title}</h2><p className="m-0 mt-2 text-[14px] leading-relaxed text-gray-500">{description}</p><div className="mt-auto flex items-center justify-between pt-5"><span className={`rounded-xl px-3 py-1.5 text-[12.5px] font-semibold transition-colors group-hover:text-white ${pill}`}>{cta}</span><span aria-hidden="true" className="text-[18px] text-gray-400 transition-transform group-hover:translate-x-0.5">-&gt;</span></div></button>;
}
