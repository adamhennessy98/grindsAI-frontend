"use client";

import { useMemo, useState } from "react";
import { getSubjectTopics } from "@/lib/constants";
import { subjectLabel } from "./subjects";

interface ProgressResultsViewProps {
  subjectId: string;
  level: string;
  onOpenConvo: () => void;
  onOpenGenerator: () => void;
}

type ResultEntry = {
  id: string;
  topic: string;
  score: string;
  wentWell: string;
  difficult: string;
  teacherNote: string;
};

export function ProgressResultsView({ subjectId, level, onOpenConvo, onOpenGenerator }: ProgressResultsViewProps) {
  const subject = subjectLabel(subjectId);
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId]);
  const [focusDraft, setFocusDraft] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [resultTopic, setResultTopic] = useState(topics[0]?.name ?? "General");
  const [score, setScore] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [difficult, setDifficult] = useState("");
  const [teacherNote, setTeacherNote] = useState("");
  const [results, setResults] = useState<ResultEntry[]>([]);

  const addFocusArea = () => {
    const value = focusDraft.trim();
    if (!value || focusAreas.includes(value)) return;
    setFocusAreas((current) => [...current, value]);
    setFocusDraft("");
  };

  const addResult = (event: React.FormEvent) => {
    event.preventDefault();
    if (!score.trim() && !wentWell.trim() && !difficult.trim() && !teacherNote.trim()) return;
    setResults((current) => [{ id: `result-${Date.now()}`, topic: resultTopic, score: score.trim(), wentWell: wentWell.trim(), difficult: difficult.trim(), teacherNote: teacherNote.trim() }, ...current]);
    setScore("");
    setWentWell("");
    setDifficult("");
    setTeacherNote("");
  };

  return <div className="mx-auto max-w-[1060px] px-4 pb-12 pt-6 sm:px-6 lg:pt-9">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-violet-600">{subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"}</div><h1 className="font-heading m-0 text-[30px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">Progress & Results</h1><p className="m-0 mt-1 max-w-[680px] text-sm leading-relaxed text-gray-500">Keep a simple record of what is difficult, what went well, and what to do next.</p></div></div>

    <section className="mb-4 rounded-2xl border border-violet-100 bg-[linear-gradient(135deg,rgba(245,243,255,.95),rgba(255,255,255,.9))] px-4 py-4 shadow-[0_14px_38px_-34px_rgba(139,92,246,.7)] dark:!border-violet-900 dark:!bg-none dark:!bg-violet-400/10 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-violet-600">Next recommended action</div><h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">{focusAreas.length ? `Work through ${focusAreas[0]} with your Tutor` : "Tell us what feels difficult"}</h2><p className="m-0 mt-1 text-[13px] text-gray-500">{focusAreas.length ? "Use the Tutor for a hint, then try one Exam Question." : "Adding a focus area will help shape future personalised support."}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={onOpenConvo} className="rounded-xl bg-violet-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-600">Ask your Tutor</button><button type="button" onClick={onOpenGenerator} className="rounded-xl border border-violet-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-violet-700 hover:border-violet-500 dark:!border-violet-800 dark:!bg-slate-900 dark:text-violet-200">Exam Question</button></div></div></section>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <section className="rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Things I&apos;m finding hard</h2><p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">Add the exact areas you want your future study support to remember.</p><div className="mt-4 flex gap-2"><input value={focusDraft} onChange={(event) => setFocusDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFocusArea(); } }} placeholder="e.g. timing on long questions" className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /><button type="button" onClick={addFocusArea} className="rounded-xl bg-violet-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-600">Add</button></div>{focusAreas.length ? <div className="mt-4 flex flex-wrap gap-2">{focusAreas.map((area) => <span key={area} className="inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-[13px] font-medium text-violet-800 dark:bg-violet-400/10 dark:text-violet-200"><span className="truncate">{area}</span><button type="button" onClick={() => setFocusAreas((current) => current.filter((item) => item !== area))} className="shrink-0 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-100 dark:bg-slate-900 dark:text-violet-200">Mark comfortable</button></span>)}</div> : <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-4 text-[13px] leading-relaxed text-gray-500 dark:bg-violet-400/10">Nothing added yet. Start with one topic or exam skill you want to feel more confident with.</div>}</section>

      <form onSubmit={addResult} className="rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Add a result or reflection</h2><p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-500">Log only what you have. A score is optional.</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Topic"><select value={resultTopic} onChange={(event) => setResultTopic(event.target.value)} className={inputClass}>{topics.map((topic) => <option key={topic.id}>{topic.name}</option>)}</select></Field><Field label="Score or result"><input value={score} onChange={(event) => setScore(event.target.value)} placeholder="72%, H3, 42/60" className={inputClass} /></Field></div><div className="mt-3 space-y-3"><Field label="What went well"><textarea value={wentWell} onChange={(event) => setWentWell(event.target.value)} placeholder="Optional" className={textareaClass} /></Field><Field label="What was difficult"><textarea value={difficult} onChange={(event) => setDifficult(event.target.value)} placeholder="Optional" className={textareaClass} /></Field><Field label="Teacher comment"><textarea value={teacherNote} onChange={(event) => setTeacherNote(event.target.value)} placeholder="Optional" className={textareaClass} /></Field></div><button type="submit" className="mt-4 w-full rounded-xl border border-violet-100 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:border-violet-500 hover:bg-violet-500 hover:text-white">Add to results</button></form>
    </div>

    <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><div><h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Previous results & notes</h2><p className="m-0 mt-1 text-[13px] text-gray-500">A simple history for this subject.</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">{results.length} logged</span></div>{results.length ? <div className="mt-4 space-y-3">{results.map((result) => <article key={result.id} className="rounded-xl border border-violet-100 bg-violet-50/55 px-4 py-3 dark:bg-violet-400/10"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold text-gray-900 dark:text-white">{result.topic}</span><span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-violet-700 dark:bg-slate-900 dark:text-violet-200">{result.score || "Reflection"}</span></div>{result.wentWell && <ResultLine label="Went well" value={result.wentWell} />}{result.difficult && <ResultLine label="Difficult" value={result.difficult} />}{result.teacherNote && <ResultLine label="Teacher" value={result.teacherNote} />}</article>)}</div> : <div className="mt-4 rounded-xl border border-dashed border-violet-200 px-4 py-5 text-[13px] leading-relaxed text-gray-500">No results logged yet. Add a test, mock, or a quick reflection after practice to build your history.</div>}</section>
    <p className="m-0 mt-4 text-center text-[11.5px] text-gray-400">Progress & Results is currently saved only in this browser session. Persistent student context will be connected when backend storage is ready.</p>
  </div>;
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
const textareaClass = `${inputClass} min-h-[70px] resize-none py-3`;

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">{label}</span>{children}</label>; }
function ResultLine({ label, value }: { label: string; value: string }) { return <p className="m-0 mt-2 text-[13px] leading-relaxed text-gray-600 dark:text-slate-300"><span className="font-semibold text-violet-700 dark:text-violet-200">{label}:</span> {value}</p>; }
