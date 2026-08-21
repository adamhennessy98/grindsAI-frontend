"use client";

import { ArrowRightIcon } from "@/components/icons";
import { getTopic } from "@/lib/constants";
import { RecommendationCard } from "./recommendation-card";
import type { SubjectStudyState } from "./study-state";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";

interface SubjectWorkspaceProps { subjectId: string; level: string; studyState: SubjectStudyState; onOpenTutor: () => void; onOpenGenerator: () => void; onOpenProgress: () => void; onOpenTopicCheck: () => void; }

const actions = [
  { title: "Tutor", description: "Get guided help with the topic or question in front of you.", cta: "Ask your Tutor", accent: "cyan" },
  { title: "Topic Check", description: "Check the foundations of a topic.", cta: "Start a check", accent: "amber" },
  { title: "Exam Questions", description: "Generate unlimited exam-style questions or explore past-paper questions by topic.", cta: "Generate a question", accent: "lime" },
  { title: "Progress & Results", description: "Track what feels difficult, what improved, and your next step.", cta: "Review progress", accent: "violet" },
] as const;

export function SubjectWorkspace({ subjectId, level, studyState, onOpenTutor, onOpenGenerator, onOpenProgress, onOpenTopicCheck }: SubjectWorkspaceProps) {
  const subject = subjectLabel(subjectId);
  const focus = studyState.focusAreas.find((area) => area.status === "current");
  const recentTopic = studyState.lastTopicId ? getTopic(subjectId, studyState.lastTopicId) : null;
  const recommendation = focus
    ? { title: `Practise ${focus.label}`, reason: "Based on your current focus area.", cta: "Start question", onClick: onOpenGenerator, feature: "questions" as const }
    : recentTopic
      ? { title: `Continue ${recentTopic.name} with your Tutor`, reason: "Based on your recent Tutor session.", cta: "Continue", onClick: onOpenTutor, feature: "tutor" as const }
      : { title: "Add your first focus area", reason: "It helps GrindsAI recommend what to do next.", cta: "Review progress", onClick: onOpenProgress, feature: "progress" as const };
  const handlers = [onOpenTutor, onOpenTopicCheck, onOpenGenerator, onOpenProgress];

  return <div style={subjectThemeStyle(subjectId)} className="animate-fade-up mx-auto max-w-[1120px] px-4 pb-12 pt-7 sm:px-6 lg:pt-10"><header className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-5 dark:border-slate-800"><span className="subject-accent-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-heading text-[15px] font-semibold">{subjectInitial(subjectId)}</span><div className="min-w-0"><h1 className="font-heading m-0 truncate text-[25px] font-semibold tracking-[-.025em] text-gray-900 dark:text-white sm:text-[29px]">{subject}</h1><div className="subject-context-label text-[12px] font-semibold">{level === "OL" ? "Ordinary Level" : "Higher Level"}</div></div></header><RecommendationCard {...recommendation} /><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{actions.map((action, index) => <ActionCard key={action.title} {...action} onClick={handlers[index]} />)}</div></div>;
}

function ActionCard({ title, description, cta, accent, onClick }: (typeof actions)[number] & { onClick: () => void }) {
  const tones = { cyan: "border-gray-200 border-t-cyan-500 hover:border-cyan-300 focus-visible:ring-cyan-300 dark:border-slate-700 dark:hover:border-cyan-700", lime: "border-gray-200 border-t-lime-500 hover:border-lime-300 focus-visible:ring-lime-300 dark:border-slate-700 dark:hover:border-lime-700", violet: "border-gray-200 border-t-violet-500 hover:border-violet-300 focus-visible:ring-violet-300 dark:border-slate-700 dark:hover:border-violet-700", amber: "border-gray-200 border-t-amber-500 hover:border-amber-300 focus-visible:ring-amber-300 dark:border-slate-700 dark:hover:border-amber-700" }[accent];
  const actionText = { cyan: "text-cyan-700 dark:text-cyan-300", lime: "text-lime-700 dark:text-lime-300", violet: "text-violet-700 dark:text-violet-300", amber: "text-amber-700 dark:text-amber-300" }[accent];
  return <button type="button" onClick={onClick} className={`group flex min-h-[164px] flex-col rounded-xl border-t-[3px] bg-white/88 p-5 text-left shadow-[0_12px_25px_-26px_rgba(15,23,42,.55)] transition-[border-color,box-shadow] hover:shadow-[0_18px_28px_-26px_rgba(15,23,42,.5)] focus-visible:outline-none focus-visible:ring-4 dark:bg-slate-900 ${tones}`}><h2 className="font-heading m-0 text-[20px] font-semibold text-gray-900 dark:text-white">{title}</h2><p className="m-0 mt-2 text-[14px] leading-relaxed text-gray-500">{description}</p><div className={`mt-auto flex items-center justify-between pt-5 text-[13px] font-semibold ${actionText}`}><span>{cta}</span><ArrowRightIcon size={17} className="transition-transform group-hover:translate-x-0.5" /></div></button>;
}
