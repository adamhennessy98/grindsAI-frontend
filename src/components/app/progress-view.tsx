"use client";

import { useCallback, useMemo, useState } from "react";
import { useSessionDraft, useUnfinishedWork } from "./use-session-draft";
import { getSubjectTopics } from "@/lib/constants";
import { RecommendationCard } from "./recommendation-card";
import { SubjectExamDate } from "./subject-exam-date";
import type { FocusArea, ResultEntry, StudyActivity } from "./study-state";
import { subjectLabel, subjectThemeStyle } from "./subjects";
import { useRecommendedNextStep } from "./use-recommended-next-step";

interface ProgressResultsViewProps {
  draftScope: string;
  onRetrySave: () => void;
  subjectId: string;
  level: string;
  focusAreas: FocusArea[];
  results: ResultEntry[];
  activities: StudyActivity[];
  storageStatus: "loading" | "saving" | "saved" | "device-only";
  onAddFocusArea: (label: string) => void;
  onUpdateFocusArea: (area: FocusArea, status: FocusArea["status"]) => void;
  onAddResult: (result: ResultEntry) => Promise<boolean>;
  onOpenConvo: (focus?: string) => void;
  onOpenGenerator: (focus?: string) => void;
  onOpenTopicCheck?: () => void;
}

export function ProgressResultsView({
  draftScope,
  onRetrySave,
  subjectId,
  level,
  focusAreas,
  results,
  activities,
  storageStatus,
  onAddFocusArea,
  onUpdateFocusArea,
  onAddResult,
  onOpenConvo,
  onOpenGenerator,
  onOpenTopicCheck,
}: ProgressResultsViewProps) {
  const subject = subjectLabel(subjectId);
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId]);
  const currentFocus = focusAreas.filter((area) => area.status === "current");
  const improved = focusAreas.filter((area) => area.status === "improved");
  const { nextStep } = useRecommendedNextStep(subjectId);
  const [focusDraft, setFocusDraft] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [resultTopic, setResultTopic] = useState(topics[0]?.name ?? "General");
  const [resultType, setResultType] = useState("Class test");
  const [score, setScore] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [difficult, setDifficult] = useState("");
  const [teacherNote, setTeacherNote] = useState("");
  const [savingResult, setSavingResult] = useState(false);
  const [resultError, setResultError] = useState("");
  const [resultId, setResultId] = useState(() => `result-${Date.now()}`);
  const hasDraft = Boolean(score.trim() || wentWell.trim() || difficult.trim() || teacherNote.trim());
  const resultDraft = useMemo(() => hasDraft ? { resultId, resultTopic, resultType, score, wentWell, difficult, teacherNote } : null, [hasDraft, resultId, resultTopic, resultType, score, wentWell, difficult, teacherNote]);
  const restoreDraft = useCallback((value: unknown) => {
    if (!value || typeof value !== "object") return;
    const draft = value as Record<string, unknown>;
    if (!["resultTopic", "resultType", "score", "wentWell", "difficult", "teacherNote"].every((key) => typeof draft[key] === "string")) return;
    if (typeof draft.resultId === "string") setResultId(draft.resultId);
    setResultTopic(draft.resultTopic as string); setResultType(draft.resultType as string); setScore(draft.score as string);
    setWentWell(draft.wentWell as string); setDifficult(draft.difficult as string); setTeacherNote(draft.teacherNote as string); setResultOpen(true);
  }, []);
  useSessionDraft(draftScope ? `grindsai-draft:${draftScope}:${subjectId}:${level}:result` : null, resultDraft, restoreDraft);
  useUnfinishedWork(hasDraft && !savingResult);
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  };
  const addFocus = () => {
    const value = focusDraft.trim();
    if (!value) return;
    onAddFocusArea(value);
    setFocusDraft("");
    showFeedback("Focus area added");
  };
  const addResult = async (event: React.FormEvent) => {
    event.preventDefault();
    if (savingResult) return;
    if (!hasDraft) { setResultError("Add a score or a short reflection before saving."); return; }
    setSavingResult(true); setResultError("");
    let saved = false;
    try { saved = await onAddResult({
      id: resultId,
      topic: resultTopic,
      type: resultType,
      score: score.trim(),
      wentWell: wentWell.trim(),
      difficult: difficult.trim(),
      teacherNote: teacherNote.trim(),
      createdAt: new Date().toISOString(),
    }); } catch { /* Keep the draft available for retry. */ }
    setSavingResult(false);
    if (!saved) { setResultError("Your result could not sync to your account. Your entries are kept; please retry."); return; }
    setResultId(`result-${Date.now()}`);
    setScore("");
    setWentWell("");
    setDifficult("");
    setTeacherNote("");
    setResultOpen(false);
    showFeedback("Result saved");
  };

  const recommendation = nextStep
    ? {
        title: nextStep.title,
        reason: nextStep.reason,
        cta: nextStep.cta,
        feature: nextStep.feature,
        onClick: () => {
          if (nextStep.action === "topic-check") onOpenTopicCheck?.();
          else if (nextStep.action === "questions") onOpenGenerator(nextStep.topicId);
          else if (nextStep.action === "progress") document.getElementById("focus-input")?.focus();
          else onOpenConvo(getSubjectTopics(subjectId).find((t) => t.id === nextStep.topicId)?.name);
        },
      }
    : currentFocus[0]
      ? {
          title: `Practise ${currentFocus[0].label}`,
          reason: "Based on your current focus area.",
          cta: "Start question",
          onClick: () => onOpenGenerator(currentFocus[0].label),
          feature: "questions" as const,
        }
      : {
          title: "Add something you are finding difficult",
          reason: "Focus areas help shape your next useful step.",
          cta: "Add focus area",
          onClick: () => document.getElementById("focus-input")?.focus(),
          feature: "progress" as const,
        };

  const recentItems = [
    ...results.map((result) => ({ id: result.id, at: result.createdAt, node: <ResultRow key={result.id} result={result} /> })),
    ...activities.filter((activity) => activity.type !== "result").map((activity) => ({ id: activity.id, at: activity.createdAt, node: <ActivityRow key={activity.id} activity={activity} /> })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 8);

  return (
    <div style={subjectThemeStyle(subjectId)} className="animate-fade-up mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
      <header className="mb-5">
        <div className="subject-context-label text-[12px] font-semibold uppercase tracking-[.08em]">{subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"}</div>
        <h1 className="font-heading m-0 mt-1 text-[30px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white">Progress & Results</h1>
        <p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500 dark:text-slate-300">See what to work on next, keep track of difficult areas, and make improvement visible.</p>
      </header>

      <RecommendationCard {...recommendation} />
      {feedback && <p role="status" className="animate-fade-up m-0 mt-3 text-[13px] font-semibold text-violet-700 dark:text-violet-200">{feedback}</p>}

      <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:border-violet-950 dark:bg-slate-900">
        <div>
          <h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Things I&apos;m finding hard</h2>
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500 dark:text-slate-300">Your focus areas help GrindsAI recommend what to work on next.</p>
        </div>
        <div className="mt-4 flex gap-2">
          <input id="focus-input" value={focusDraft} onChange={(event) => setFocusDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFocus(); } }} placeholder="e.g. starting long questions" className={inputClass} />
          <button type="button" onClick={addFocus} className="rounded-xl bg-violet-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-600">Add</button>
        </div>
        {currentFocus.length ? <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{currentFocus.map((area) => <FocusAreaCard key={area.id} area={area} onTutor={() => onOpenConvo(area.label)} onQuestion={() => onOpenGenerator(area.label)} onComfortable={() => { onUpdateFocusArea(area, "improved"); showFeedback(`${area.label} moved to Improved areas`); }} />)}</div> : <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-4 text-[13px] leading-relaxed text-gray-500 dark:border-violet-900 dark:bg-violet-400/10 dark:text-slate-300">Nothing added yet. Start with one topic or exam skill you want to feel more confident with.</div>}
      </section>

      <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.45)] dark:border-violet-950 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Log a result</h2>
            <p className="m-0 mt-1 text-[13px] text-gray-500 dark:text-slate-300">Add a score, reflection, or teacher feedback when you have it.</p>
          </div>
          <button type="button" onClick={() => setResultOpen((open) => !open)} className="rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-[13px] font-semibold text-violet-700 hover:border-violet-500 dark:border-violet-900 dark:bg-violet-400/10 dark:text-violet-200">{resultOpen ? "Close" : "Log a result"}</button>
        </div>
        {resultError && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{resultError}</p>}{resultOpen && <ResultForm topics={topics} topic={resultTopic} type={resultType} score={score} wentWell={wentWell} difficult={difficult} teacherNote={teacherNote} onTopic={setResultTopic} onType={setResultType} onScore={setScore} onWentWell={setWentWell} onDifficult={setDifficult} onTeacherNote={setTeacherNote} onSubmit={(event) => void addResult(event)} saving={savingResult} />}
      </section>

      <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:border-violet-950 dark:bg-slate-900">
        <div>
          <h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Recent activity and results</h2>
          <p className="m-0 mt-1 text-[13px] text-gray-500 dark:text-slate-300">Tutor sessions, Exam Questions, Topic Checks, and logged results appear here.</p>
        </div>
        {recentItems.length ? <div className="mt-4 divide-y divide-violet-100 overflow-hidden rounded-xl border border-violet-100 dark:divide-violet-950 dark:border-violet-950">{recentItems.map((item) => item.node)}</div> : <div className="mt-4 rounded-xl border border-dashed border-violet-200 px-4 py-5 text-[13px] leading-relaxed text-gray-500 dark:border-violet-900 dark:text-slate-300">Nothing recorded yet. Your study history will build here as you use each tool.</div>}
      </section>

      <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:border-violet-950 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Improved areas</h2><p className="m-0 mt-1 text-[13px] text-gray-500 dark:text-slate-300">Areas you have marked as comfortable.</p></div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">{improved.length}</span>
        </div>
        {improved.length ? <div className="mt-4 flex flex-wrap gap-2">{improved.map((area) => <span key={area.id} className="animate-fade-up inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-[13px] font-medium text-violet-800 dark:border-violet-900 dark:bg-violet-400/10 dark:text-violet-200">{area.label}<button type="button" onClick={() => onUpdateFocusArea(area, "current")} className="min-h-11 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-violet-700 hover:bg-violet-100 dark:bg-slate-900 dark:text-violet-200">Restore</button></span>)}</div> : <p className="mb-0 mt-4 text-[13px] text-gray-500 dark:text-slate-300">Mark a current focus area as comfortable to make progress visible here.</p>}
      </section>

      <details className="mt-4 rounded-xl border border-violet-100 bg-white px-4 py-3 dark:border-violet-950 dark:bg-slate-900">
        <summary className="cursor-pointer list-none text-[13px] font-semibold text-violet-700 marker:content-none dark:text-violet-200">Set an exam date</summary>
        <p className="m-0 mt-1 text-[12.5px] text-gray-500 dark:text-slate-300">Use it to time revision suggestions for this subject.</p>
        <SubjectExamDate subjectId={subjectId} level={level} />
      </details>
      <p role="status" className="m-0 mt-4 text-center text-[11.5px] text-gray-400 dark:text-slate-500">
        {storageStatus === "saved" ? "Progress is saved to your account." : storageStatus === "loading" ? "Loading your progress…" : storageStatus === "saving" ? "Saving your progress…" : "Progress is saved on this device until it can sync to your account."}
      </p>
      {storageStatus === "device-only" && <div className="mt-2 text-center"><button type="button" onClick={onRetrySave} className="min-h-11 rounded-lg border border-violet-300 px-4 text-sm font-semibold text-violet-700 dark:border-violet-800 dark:text-violet-200">Retry sync</button></div>}
    </div>
  );
}

function FocusAreaCard({ area, onTutor, onQuestion, onComfortable }: { area: FocusArea; onTutor: () => void; onQuestion: () => void; onComfortable: () => void }) { return <article className="rounded-xl border border-violet-100 bg-violet-50/60 px-3.5 py-3 dark:bg-violet-400/10"><div className="text-[14px] font-semibold text-gray-900 dark:text-white">{area.label}</div><div className="mt-3 flex flex-wrap gap-2"><SmallAction onClick={onTutor}>Ask Tutor</SmallAction><SmallAction onClick={onQuestion}>Exam Question</SmallAction><SmallAction onClick={onComfortable}>Mark comfortable</SmallAction></div></article>; }
function ResultForm({ topics, topic, type, score, wentWell, difficult, teacherNote, onTopic, onType, onScore, onWentWell, onDifficult, onTeacherNote, onSubmit, saving }: { topics: ReturnType<typeof getSubjectTopics>; topic: string; type: string; score: string; wentWell: string; difficult: string; teacherNote: string; onTopic: (value: string) => void; onType: (value: string) => void; onScore: (value: string) => void; onWentWell: (value: string) => void; onDifficult: (value: string) => void; onTeacherNote: (value: string) => void; onSubmit: (event: React.FormEvent) => void; saving: boolean }) { return <form onSubmit={onSubmit} aria-busy={saving} className="animate-fade-up mt-4 rounded-xl border border-violet-100 bg-violet-50/55 p-4 dark:bg-violet-400/10"><fieldset disabled={saving} className="m-0 min-w-0 border-0 p-0"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Topic"><select value={topic} onChange={(event) => onTopic(event.target.value)} className={inputClass}>{topics.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field><Field label="What was this?"><select value={type} onChange={(event) => onType(event.target.value)} className={inputClass}>{["Class test", "Mock", "Homework", "Past paper", "Other"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Result or score"><input value={score} onChange={(event) => onScore(event.target.value)} placeholder="Optional: 72%, H3, 42/60" className={inputClass} /></Field></div><div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="What went well"><textarea value={wentWell} onChange={(event) => onWentWell(event.target.value)} className={textareaClass} /></Field><Field label="What was difficult"><textarea value={difficult} onChange={(event) => onDifficult(event.target.value)} className={textareaClass} /></Field></div><div className="mt-3"><Field label="Teacher feedback, optional"><textarea value={teacherNote} onChange={(event) => onTeacherNote(event.target.value)} className={textareaClass} /></Field></div><div className="mt-4 flex gap-2"><button type="submit" className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600">{saving ? "Saving..." : "Save result"}</button></div></fieldset></form>; }
function ResultRow({ result }: { result: ResultEntry }) { return <article className="bg-violet-50/50 px-4 py-3.5 dark:bg-violet-400/[.07]"><div className="flex flex-wrap items-center justify-between gap-2"><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-gray-900 dark:text-white">{result.type}</span><span className="text-[12.5px] text-gray-500">{result.topic}</span>{result.score && <span className="font-semibold text-emerald-700 dark:text-emerald-300">{result.score}</span>}</div>{(result.wentWell || result.difficult || result.teacherNote) && <div className="mt-1 text-[12.5px] leading-relaxed text-gray-500">{result.difficult ? `Difficult: ${result.difficult}` : result.wentWell ? `Went well: ${result.wentWell}` : `Teacher: ${result.teacherNote}`}</div>}</div><TimeLabel value={result.createdAt} /></div></article>; }
function ActivityRow({ activity }: { activity: StudyActivity }) { return <div className="flex items-center justify-between gap-3 bg-white px-4 py-3.5 dark:bg-slate-900"><div className="flex min-w-0 items-center gap-3"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${activity.type === "tutor" ? "bg-cyan-500" : activity.type === "question" ? "bg-lime-500" : activity.type === "topic-check" ? "bg-amber-500" : "bg-violet-500"}`} /><span className="text-[13px] text-gray-700 dark:text-slate-200">{activity.label}</span></div><TimeLabel value={activity.createdAt} /></div>; }
function TimeLabel({ value }: { value: string }) { const date = new Date(value); const today = new Date(); const dayDifference = Math.floor((new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) / 86_400_000); const label = dayDifference === 0 ? "Today" : dayDifference === 1 ? "Yesterday" : dayDifference > 1 && dayDifference < 7 ? `${dayDifference} days ago` : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date); return <span className="shrink-0 text-[11.5px] text-gray-400 dark:text-slate-500">{label}</span>; }
function SmallAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="min-h-11 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-violet-700 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-slate-900 dark:text-violet-200">{children}</button>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">{label}</span>{children}</label>; }
const inputClass = "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
const textareaClass = `${inputClass} min-h-[70px] resize-none py-3`;
