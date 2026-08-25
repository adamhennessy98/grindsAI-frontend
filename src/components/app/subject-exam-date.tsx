"use client";

import { useEffect, useState } from "react";
import type { ExamScheduleEntry } from "@/lib/learning/exam-schedule";
import { examCountdownShort } from "@/lib/learning/exam-schedule";
import type { SubjectLevel } from "@/lib/onboarding";

const PAPER_OPTIONS = ["", "Paper 1", "Paper 2", "Oral", "Practical"] as const;

/** Exam date entry for Progress & Results. */
export function SubjectExamDate({
  subjectId,
  level,
}: {
  subjectId: string;
  level?: SubjectLevel | string | null;
}) {
  const [examDate, setExamDate] = useState("");
  const [paperLabel, setPaperLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessage("");
    setError("");
    void (async () => {
      try {
        const res = await fetch(`/api/learning/exam-schedule?subjectId=${encodeURIComponent(subjectId)}`);
        if (!res.ok) throw new Error("Could not load exam date.");
        const payload = (await res.json()) as { entry?: ExamScheduleEntry | null };
        if (cancelled) return;
        setExamDate(payload.entry?.examDate ?? "");
        setPaperLabel(payload.entry?.paperLabel ?? "");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load exam date.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  const short = examCountdownShort(daysUntilLocal(examDate));

  const save = async (nextDate: string, nextPaper: string) => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/learning/exam-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: {
            subjectId,
            examDate: nextDate.trim() || null,
            paperLabel: nextPaper.trim() || null,
            level: level === "OL" || level === "HL" ? level : null,
          },
        }),
      });
      if (!res.ok) throw new Error("Could not save exam date.");
      setExamDate(nextDate.trim());
      setPaperLabel(nextPaper.trim());
      setMessage(nextDate.trim() ? "Exam date saved." : "Exam date cleared.");
      window.dispatchEvent(new Event("grindsai:exam-schedule-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save exam date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-4 rounded-2xl border border-violet-100 bg-white px-5 py-5 shadow-[0_14px_38px_-34px_rgba(139,92,246,.55)] dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-heading m-0 text-lg font-semibold text-gray-900 dark:text-white">Exam date</h2>
          <p className="m-0 mt-1 text-[13px] text-gray-500">Used to time your revision suggestions for this subject.</p>
        </div>
        {short && short !== "passed" && (
          <span className="rounded-md bg-violet-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-violet-800 dark:bg-violet-400/10 dark:text-violet-200">
            {short}
          </span>
        )}
      </div>

      {loading ? (
        <p className="m-0 mt-4 text-[13px] text-gray-500">Loading…</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <label className="block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">
            Date
            <input
              type="date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              className="mt-1.5 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="block text-[12.5px] font-medium text-gray-700 dark:text-slate-200">
            Paper
            <select
              value={paperLabel}
              onChange={(event) => setPaperLabel(event.target.value)}
              className="mt-1.5 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">None</option>
              {PAPER_OPTIONS.filter(Boolean).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              {paperLabel && !PAPER_OPTIONS.includes(paperLabel as (typeof PAPER_OPTIONS)[number]) ? (
                <option value={paperLabel}>{paperLabel}</option>
              ) : null}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void save(examDate, paperLabel)}
              disabled={saving || !examDate}
              className="rounded-xl bg-violet-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {examDate ? (
              <button
                type="button"
                onClick={() => {
                  setExamDate("");
                  setPaperLabel("");
                  void save("", "");
                }}
                disabled={saving}
                className="rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-[13px] font-semibold text-violet-700 hover:border-violet-500 disabled:opacity-50 dark:border-violet-900 dark:bg-violet-400/10 dark:text-violet-200"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      )}

      {(message || error) && (
        <p className={`m-0 mt-3 text-[13px] ${error ? "text-red-600" : "text-violet-700 dark:text-violet-200"}`}>
          {error || message}
        </p>
      )}
    </section>
  );
}

function daysUntilLocal(isoDate: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  const exam = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  return Math.round((exam.getTime() - today.getTime()) / 86_400_000);
}
