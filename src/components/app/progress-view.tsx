"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import type { FocusArea, ResultEntry } from "./study-state";
import { subjectLabel, subjectThemeStyle } from "./subjects";

interface ProgressResultsViewProps {
  subjectId: string;
  level: string;
  focusAreas: FocusArea[];
  results: ResultEntry[];
  onAddFocusArea: (label: string) => void;
  onUpdateFocusArea: (area: FocusArea, status: FocusArea["status"]) => void;
  onAddResult: (result: ResultEntry) => void;
  onOpenConvo: () => void;
  onOpenGenerator: () => void;
}

export function ProgressResultsView({ subjectId, level, focusAreas, results, onAddFocusArea, onUpdateFocusArea, onAddResult, onOpenConvo, onOpenGenerator }: ProgressResultsViewProps) {
  const subject = subjectLabel(subjectId);
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId]);
  const currentFocus = focusAreas.filter((area) => area.status === "current");
  const improved = focusAreas.filter((area) => area.status === "improved");
  const [focusDraft, setFocusDraft] = useState("");
  const [resultTopic, setResultTopic] = useState(topics[0]?.name ?? "General");
  const [resultType, setResultType] = useState("Class test");
  const [score, setScore] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [difficult, setDifficult] = useState("");
  const [teacherNote, setTeacherNote] = useState("");

  const addFocus = () => {
    const value = focusDraft.trim();
    if (!value) return;
    onAddFocusArea(value);
    setFocusDraft("");
  };
  const addResult = (event: React.FormEvent) => {
    event.preventDefault();
    if (!score.trim() && !wentWell.trim() && !difficult.trim() && !teacherNote.trim()) return;
    onAddResult({ id: `result-${Date.now()}`, topic: resultTopic, type: resultType, score: score.trim(), wentWell: wentWell.trim(), difficult: difficult.trim(), teacherNote: teacherNote.trim() });
    setScore("");
    setWentWell("");
    setDifficult("");
    setTeacherNote("");
  };
  const recommendation = currentFocus[0]
    ? { title: `Practise ${currentFocus[0].label}`, reason: "It is one of your current focus areas.", cta: "Start question", action: onOpenGenerator }
    : { title: "Add something you are finding difficult", reason: "Your focus areas help GrindsAI recommend what to work on next.", cta: "Add focus area", action: () => document.getElementById("focus-input")?.focus() };

  return <div style={subjectThemeStyle(subjectId)} className="mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
    <div className="mb-6"><div className="subject-context-label mb-1 text-[12px] font-semibold uppercase tracking-[.08em]">{subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"}</div><h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white">Progress & Results</h1><p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">See what to work on next, keep track of difficult areas, and make improvement visible.</p></div>
    <Recommendation title={recommendation.title} reason={recommendation.reason} cta={recommendation.cta} onClick={recommendation.action} />
    <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Things I&apos;m finding hard</h2><p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">Your focus areas help GrindsAI recommend what to work on next.</p></div><button type="button" onClick={onOpenConvo} className="shrink-0 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[12.5px] font-semibold text-violet-700 hover:border-violet-500 dark:border-violet-900 dark:bg-violet-400/10 dark:text-violet-200">Ask your Tutor</button></div><div className="mt-4 flex gap-2"><input id="focus-input" value={focusDraft} onChange={(event) => setFocusDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFocus(); } }} placeholder="e.g. starting long questions" className={inputClass} /><button type="button" onClick={addFocus} className="rounded-xl bg-violet-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-600">Add</button></div>{currentFocus.length ? <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{currentFocus.map((area) => <FocusAreaCard key={area.id} area={area} onPractise={onOpenGenerator} onTutor={onOpenConvo} onComfortable={() => onUpdateFocusArea(area, "improved")} />)}</div> : <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-4 text-[13px] leading-relaxed text-gray-500 dark:bg-violet-400/10">Nothing added yet. Start with one topic or exam skill you want to feel more confident with.</div>}</section>
    <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-violet-600">Keep a simple record</div><h2 className="font-heading m-0 mt-1 text-lg font-semibold text-gray-900 dark:text-white">Log a result</h2><p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">Add only what you have. A score is optional.</p></div><ResultForm topics={topics} topic={resultTopic} type={resultType} score={score} wentWell={wentWell} difficult={difficult} teacherNote={teacherNote} onTopic={setResultTopic} onType={setResultType} onScore={setScore} onWentWell={setWentWell} onDifficult={setDifficult} onTeacherNote={setTeacherNote} onSubmit={addResult} />{results.length > 0 && <div className="mt-5 border-t border-violet-100 pt-4 dark:border-violet-900"><h3 className="font-heading m-0 text-[15px] font-semibold text-gray-900 dark:text-white">Saved results</h3><div className="mt-3 space-y-2">{results.map((result) => <ResultCard key={result.id} result={result} />)}</div></div>}</section>
    <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><div><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Improved areas</h2><p className="m-0 mt-1 text-[13px] text-gray-500">Areas you have marked as comfortable.</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">{improved.length}</span></div>{improved.length ? <div className="mt-4 flex flex-wrap gap-2">{improved.map((area) => <span key={area.id} className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-[13px] font-medium text-violet-800 dark:bg-violet-400/10 dark:text-violet-200">{area.label}<button type="button" onClick={() => onUpdateFocusArea(area, "current")} className="rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-100 dark:bg-slate-900 dark:text-violet-200">Restore</button></span>)}</div> : <p className="mb-0 mt-4 text-[13px] text-gray-500">Mark a current focus area as comfortable to make your progress visible here.</p>}</section>
    <p className="m-0 mt-4 text-center text-[11.5px] text-gray-400">This release stores progress for the current browser session only.</p>
  </div>;
}

function Recommendation({ title, reason, cta, onClick }: { title: string; reason: string; cta: string; onClick: () => void }) { return <section className="rounded-2xl border border-violet-100 bg-[linear-gradient(135deg,rgba(245,243,255,.95),rgba(248,250,247,.9))] px-4 py-4 shadow-[0_14px_38px_-34px_rgba(139,92,246,.7)] dark:!border-violet-900 dark:!bg-none dark:!bg-violet-400/10 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-violet-600">Next recommended action</div><h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">{title}</h2><p className="m-0 mt-1 text-[13px] text-gray-500">{reason}</p></div><button type="button" onClick={onClick} className="shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600">{cta}</button></div></section>; }
function FocusAreaCard({ area, onPractise, onTutor, onComfortable }: { area: FocusArea; onPractise: () => void; onTutor: () => void; onComfortable: () => void }) { return <article className="rounded-xl border border-violet-100 bg-violet-50/60 px-3.5 py-3 dark:bg-violet-400/10"><div className="text-[14px] font-semibold text-gray-900 dark:text-white">{area.label}</div><div className="mt-3 flex flex-wrap gap-2"><SmallAction onClick={onPractise}>Practise</SmallAction><SmallAction onClick={onTutor}>Ask Tutor</SmallAction><SmallAction onClick={onComfortable}>Mark comfortable</SmallAction></div></article>; }
function ResultForm({ topics, topic, type, score, wentWell, difficult, teacherNote, onTopic, onType, onScore, onWentWell, onDifficult, onTeacherNote, onSubmit }: { topics: ReturnType<typeof getSubjectTopics>; topic: string; type: string; score: string; wentWell: string; difficult: string; teacherNote: string; onTopic: (value: string) => void; onType: (value: string) => void; onScore: (value: string) => void; onWentWell: (value: string) => void; onDifficult: (value: string) => void; onTeacherNote: (value: string) => void; onSubmit: (event: React.FormEvent) => void }) { return <form onSubmit={onSubmit} className="mt-4 rounded-xl border border-violet-100 bg-violet-50/55 p-4 dark:bg-violet-400/10"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Topic"><select value={topic} onChange={(event) => onTopic(event.target.value)} className={inputClass}>{topics.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field><Field label="What was this?"><select value={type} onChange={(event) => onType(event.target.value)} className={inputClass}>{["Class test", "Mock", "Homework", "Past paper", "Other"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Result or score"><input value={score} onChange={(event) => onScore(event.target.value)} placeholder="Optional: 72%, H3, 42/60" className={inputClass} /></Field></div><div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="What went well"><textarea value={wentWell} onChange={(event) => onWentWell(event.target.value)} className={textareaClass} /></Field><Field label="What was difficult"><textarea value={difficult} onChange={(event) => onDifficult(event.target.value)} className={textareaClass} /></Field></div><div className="mt-3"><Field label="Teacher feedback, optional"><textarea value={teacherNote} onChange={(event) => onTeacherNote(event.target.value)} className={textareaClass} /></Field></div><button type="submit" className="mt-4 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600">Save result</button></form>; }
function ResultCard({ result }: { result: ResultEntry }) { return <article className="rounded-xl border border-violet-100 bg-violet-50/55 px-4 py-3 dark:bg-violet-400/10"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="font-semibold text-gray-900 dark:text-white">{result.topic}</span><span className="ml-2 text-[12px] text-gray-400">{result.type}</span></div><span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-violet-700 dark:bg-slate-900 dark:text-violet-200">{result.score || "Reflection"}</span></div>{result.wentWell && <Detail label="Went well" value={result.wentWell} />}{result.difficult && <Detail label="Difficult" value={result.difficult} />}{result.teacherNote && <Detail label="Teacher" value={result.teacherNote} />}</article>; }
function SmallAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-violet-700 hover:bg-violet-100 dark:bg-slate-900 dark:text-violet-200">{children}</button>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">{label}</span>{children}</label>; }
function Detail({ label, value }: { label: string; value: string }) { return <p className="m-0 mt-2 text-[13px] leading-relaxed text-gray-600 dark:text-slate-300"><span className="font-semibold text-violet-700 dark:text-violet-200">{label}:</span> {value}</p>; }
const inputClass = "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
const textareaClass = `${inputClass} min-h-[70px] resize-none py-3`;
