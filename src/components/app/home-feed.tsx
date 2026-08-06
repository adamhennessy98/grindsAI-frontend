"use client";

import { getTopic } from "@/lib/constants";
import type { Subject } from "@/lib/types";
import type { SubjectLevel } from "@/lib/onboarding";
import type { StudyStateBySubject } from "./study-state";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";
import { FreeTextNote } from "./free-text-note";

interface HomeFeedProps {
  hasProfile: boolean;
  subjects: Subject[];
  subjectLevels?: Record<string, SubjectLevel>;
  studyState: StudyStateBySubject;
  onSelectSubject: (id: string) => void;
  onContinueSubject: (id: string) => void;
  onOpenSettings: () => void;
}

export function HomeFeed({ hasProfile, subjects, subjectLevels, studyState, onSelectSubject, onContinueSubject, onOpenSettings }: HomeFeedProps) {
  if (!hasProfile) return <ProfileEmptyState onOpenSettings={onOpenSettings} />;
  const continuation = subjects.map((subject) => ({ subject, state: studyState[subject.id] })).find(({ state }) => state?.activities.length || state?.lastTopicId);

  return <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
    <section className="mb-5"><p className="mb-2 text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-600">My Subjects</p><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-.02em] text-gray-900 dark:text-white sm:text-[36px]">What are you studying today?</h1><p className="m-0 mt-2 max-w-[580px] text-[14.5px] leading-relaxed text-gray-500">Choose a subject, then work through the next useful step.</p></div><button type="button" onClick={onOpenSettings} className="rounded-xl border border-cyan-100 bg-white/85 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Edit subjects</button></div></section>
    {continuation ? <ContinuationCard subject={continuation.subject} state={continuation.state!} onContinue={() => onContinueSubject(continuation.subject.id)} /> : <NewContinuationCard subject={subjects[0]} onStart={() => subjects[0] && onContinueSubject(subjects[0].id)} />}
    <div className="mt-4"><FreeTextNote /></div>
    <div className="mb-4 mt-7 flex items-center gap-3"><h2 className="font-heading m-0 text-[18px] font-semibold text-gray-900 dark:text-white">Your subjects</h2><div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" /></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} level={subjectLevels?.[subject.id] ?? "HL"} state={studyState[subject.id]} onView={() => onSelectSubject(subject.id)} />)}</div>
  </div>;
}

function ProfileEmptyState({ onOpenSettings }: { onOpenSettings: () => void }) { return <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[680px] items-center px-4 py-10 sm:px-6"><section className="w-full rounded-3xl border border-white/80 bg-white/88 px-6 py-8 text-center shadow-[0_18px_50px_-34px_rgba(15,23,42,.55)] dark:border-slate-700 dark:bg-slate-900"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dcfce7,#cffafe)] text-xl font-semibold text-emerald-700">G</span><h1 className="font-heading m-0 mt-4 text-[28px] font-semibold text-gray-900 dark:text-white">Set up your subjects first</h1><p className="mx-auto mt-2 max-w-[430px] text-[14.5px] leading-relaxed text-gray-500">Choose your Leaving Cert subjects so your study workspace is ready for you.</p><button type="button" onClick={onOpenSettings} className="mt-6 rounded-xl bg-[linear-gradient(135deg,#10b981,#06b6d4)] px-5 py-3 text-sm font-semibold text-white">Set up study profile</button></section></div>; }

function ContinuationCard({ subject, state, onContinue }: { subject: Subject; state: NonNullable<StudyStateBySubject[string]>; onContinue: () => void }) {
  const topic = state.lastTopicId ? getTopic(subject.id, state.lastTopicId) : null;
  const focus = state.focusAreas.find((area) => area.status === "current");
  const detail = topic ? `Continue: ${topic.name}` : focus ? `Focus area: ${focus.label}` : state.activities[0]?.label ?? "Continue your study session";
  return <section style={subjectThemeStyle(subject.id)} className="rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,.86),rgba(248,250,247,.92))] px-4 py-4 shadow-[0_14px_38px_-34px_rgba(8,145,178,.65)] dark:!border-cyan-900 dark:!bg-none dark:!bg-cyan-400/10 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="subject-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold">{subjectInitial(subject.id)}</span><div className="min-w-0"><div className="subject-context-label text-[12px] font-semibold uppercase tracking-[.08em]">Continue where you left off</div><div className="mt-1 truncate font-heading text-[17px] font-semibold text-gray-900 dark:text-white">{subjectLabel(subject.id)}: {detail}</div><p className="m-0 mt-1 text-[13px] text-gray-500">Pick up your subject-aware Tutor session.</p></div></div><button type="button" onClick={onContinue} className="shrink-0 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600">Continue</button></div></section>;
}

function NewContinuationCard({ subject, onStart }: { subject?: Subject; onStart: () => void }) { return <section className="rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,.86),rgba(248,250,247,.92))] px-4 py-4 shadow-[0_14px_38px_-34px_rgba(8,145,178,.65)] dark:!border-cyan-900 dark:!bg-none dark:!bg-cyan-400/10 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-700 dark:text-cyan-300">Your first useful step</div><div className="mt-1 font-heading text-[17px] font-semibold text-gray-900 dark:text-white">Start with your Tutor</div><p className="m-0 mt-1 text-[13px] text-gray-500">Ask about a topic, paste an exam question, or tell your Tutor where you&apos;re stuck.</p></div><button type="button" disabled={!subject} onClick={onStart} className="shrink-0 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:bg-gray-300">Start</button></div></section>; }

function SubjectCard({ subject, level, state, onView }: { subject: Subject; level: SubjectLevel; state?: StudyStateBySubject[string]; onView: () => void }) {
  const topic = state?.lastTopicId ? getTopic(subject.id, state.lastTopicId) : null;
  const focus = state?.focusAreas.find((area) => area.status === "current");
  const summary = topic ? `Continue: ${topic.name}` : focus ? `Focus area: ${focus.label}` : "No activity yet";
  return <article style={subjectThemeStyle(subject.id)} className="subject-card flex min-h-[172px] flex-col rounded-2xl border border-white/80 bg-white/88 p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,.55)] transition-[background-color,border-color,transform,box-shadow] hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900 sm:p-5"><div className="flex items-start gap-3"><span className="subject-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold">{subjectInitial(subject.id)}</span><span className="min-w-0"><span className="block truncate font-heading text-[19px] font-semibold text-gray-900 dark:text-white">{subject.name}</span><span className="text-[12.5px] text-gray-400">{level === "OL" ? "Ordinary Level" : "Higher Level"}</span></span></div><p className="m-0 mt-5 text-[14px] leading-relaxed text-gray-500">{summary}</p><div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-700"><span className="subject-context-label text-[12.5px] font-medium">View subject</span><button type="button" onClick={onView} className="rounded-xl bg-[linear-gradient(135deg,#10b981,#22d3ee)] px-3 py-1.5 text-[13px] font-semibold text-white">Open</button></div></article>;
}
