"use client";

import { getTopic } from "@/lib/constants";
import type { SubjectStudyState } from "./study-state";
import { subjectInitial, subjectLabel } from "./subjects";

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
  const recommendation = focus ? { title: `Practise ${focus.label}`, reason: "It is in your current focus areas.", cta: "Start question", onClick: onOpenGenerator } : recentTopic ? { title: `Continue ${recentTopic.name} with your Tutor`, reason: "You were last working in this topic.", cta: "Continue", onClick: onOpenTutor } : { title: "Add your first focus area", reason: "It helps GrindsAI recommend what to do next.", cta: "Add focus area", onClick: onOpenProgress };
  const handlers = [onOpenTutor, onOpenGenerator, onOpenProgress];

  return <div className="mx-auto max-w-[1040px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9"><section className="rounded-3xl border border-white/80 bg-white/88 px-5 py-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,.55)] backdrop-blur-sm dark:!border-slate-700 dark:!bg-slate-900 sm:px-6"><div className="flex items-start gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff,#fef3c7)] font-heading text-lg font-semibold text-cyan-900">{subjectInitial(subjectId)}</span><div className="min-w-0 flex-1"><div className="mb-1 text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-600">{level === "OL" ? "Ordinary Level" : "Higher Level"}</div><h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-.02em] text-gray-900 dark:text-white sm:text-[34px]">{subject}</h1><p className="m-0 mt-1 text-[14px] leading-relaxed text-gray-500">Tutor, exam practice, and a clear view of what to improve.</p></div></div></section>
    <section className="mt-5 rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,.86),rgba(248,250,247,.92))] px-4 py-4 shadow-[0_14px_38px_-34px_rgba(8,145,178,.65)] dark:!border-cyan-900 dark:!bg-none dark:!bg-cyan-400/10 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-700 dark:text-cyan-300">Next recommended action</div><h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">{recommendation.title}</h2><p className="m-0 mt-1 text-[13px] text-gray-500">{recommendation.reason}</p></div><button type="button" onClick={recommendation.onClick} className="shrink-0 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600">{recommendation.cta}</button></div></section>
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">{actions.map((action, index) => <ActionCard key={action.title} {...action} onClick={handlers[index]} />)}</div>
  </div>;
}

function ActionCard({ title, description, cta, accent, onClick }: (typeof actions)[number] & { onClick: () => void }) {
  const tones = { cyan: "border-cyan-100 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-400/12", lime: "border-lime-100 hover:border-lime-400 hover:bg-lime-50 dark:hover:bg-lime-400/12", violet: "border-violet-100 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-400/12" }[accent];
  const pill = { cyan: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-500", lime: "bg-lime-50 text-lime-700 group-hover:bg-lime-500", violet: "bg-violet-50 text-violet-700 group-hover:bg-violet-500" }[accent];
  return <button type="button" onClick={onClick} className={`group flex min-h-[188px] flex-col rounded-2xl border bg-white/88 p-5 text-left shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] transition-[border-color,transform,box-shadow,background-color] hover:-translate-y-1 hover:shadow-[0_24px_54px_-30px_rgba(15,23,42,.55)] dark:!bg-slate-900 ${tones}`}><h2 className="font-heading m-0 text-[21px] font-semibold text-gray-900 dark:text-white">{title}</h2><p className="m-0 mt-2 text-[14px] leading-relaxed text-gray-500">{description}</p><div className="mt-auto flex items-center justify-between pt-5"><span className={`rounded-xl px-3 py-1.5 text-[12.5px] font-semibold transition-colors group-hover:text-white ${pill}`}>{cta}</span><span aria-hidden="true" className="text-[18px] text-gray-400 transition-transform group-hover:translate-x-0.5">→</span></div></button>;
}
