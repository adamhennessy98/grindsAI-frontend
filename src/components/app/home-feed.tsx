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

export function HomeFeed({ hasProfile, subjects, subjectLevels, onSelectSubject, onOpenSettings }: HomeFeedProps) {
  if (!hasProfile) return <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[680px] items-center px-4 py-10 sm:px-6"><section className="w-full rounded-3xl border border-white/80 bg-white/88 px-6 py-8 text-center shadow-[0_18px_50px_-34px_rgba(15,23,42,.55)]"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dcfce7,#cffafe)] text-xl font-semibold text-emerald-700">G</span><h1 className="font-heading m-0 mt-4 text-[28px] font-semibold text-gray-900 dark:text-white">Set up your subjects first</h1><p className="mx-auto mt-2 max-w-[430px] text-[14.5px] leading-relaxed text-gray-500">Choose your Leaving Cert subjects so your study workspace is ready for you.</p><button type="button" onClick={onOpenSettings} className="mt-6 rounded-xl bg-[linear-gradient(135deg,#10b981,#06b6d4)] px-5 py-3 text-sm font-semibold text-white">Set up study profile</button></section></div>;

  return <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
    <section className="mb-6"><p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-cyan-600">My Subjects</p><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 dark:text-white sm:text-[36px]">What are you studying today?</h1><p className="m-0 mt-2 max-w-[580px] text-[14.5px] leading-relaxed text-gray-500">Choose a subject, then ask your Tutor, generate an exam question, or track what to improve.</p></div><button type="button" onClick={onOpenSettings} className="rounded-xl border border-cyan-100 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-slate-900 dark:text-slate-100">Edit subjects</button></div></section>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} level={subjectLevels?.[subject.id] ?? "HL"} onOpen={() => onSelectSubject(subject.id)} />)}</div>
    <section className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-amber-100 bg-[linear-gradient(135deg,rgba(255,251,235,.92),rgba(240,253,244,.86))] px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div><h2 className="font-heading m-0 text-[17px] font-semibold text-gray-900">Make GrindsAI better</h2><p className="m-0 mt-1 text-[13px] text-gray-500">Share feedback about your study experience or something that needs improving.</p></div><a href="mailto:hello@grindsai.ie?subject=GrindsAI%20feedback" className="shrink-0 text-[13px] font-semibold text-amber-700 hover:text-amber-800">Give feedback</a></section>
  </div>;
}

function SubjectCard({ subject, level, onOpen }: { subject: Subject; level: SubjectLevel; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} className="group min-h-[174px] rounded-2xl border border-white/80 bg-white/88 p-4 text-left shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] transition-[background-color,border-color,transform,box-shadow] hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-[0_24px_54px_-30px_rgba(8,145,178,.95)] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-cyan-400/12 sm:p-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff,#dcfce7)] text-[13px] font-semibold text-cyan-800">{subjectInitial(subject.id)}</span><span className="min-w-0"><span className="block truncate font-heading text-[19px] font-semibold text-gray-900 dark:text-white">{subject.name}</span><span className="text-[12.5px] text-gray-400">{level === "OL" ? "Ordinary Level" : "Higher Level"}</span></span></div><p className="m-0 mt-5 text-[14px] leading-relaxed text-gray-500">Start with a Tutor question, then use exam practice and results to focus your revision.</p><div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-700"><span className="text-[12.5px] text-gray-400">No results logged yet</span><span className="rounded-xl bg-[linear-gradient(135deg,#10b981,#22d3ee)] px-3 py-1.5 text-[13px] font-semibold text-white transition-transform group-hover:scale-[1.04]">Open</span></div></button>;
}
