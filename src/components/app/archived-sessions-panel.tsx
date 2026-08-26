"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArchivedSession } from "@/lib/learning/session-archive";

export function ArchivedSessionsPanel({
  subjectId,
  topicId,
  open,
  onClose,
  refreshKey = 0,
}: {
  subjectId: string;
  topicId: string;
  open: boolean;
  onClose: () => void;
  refreshKey?: number;
}) {
  const [sessions, setSessions] = useState<ArchivedSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kcFilter, setKcFilter] = useState<string>("all");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams({ subjectId, topicId });
        const res = await fetch(`/api/learning/sessions?${qs.toString()}`);
        if (!res.ok) throw new Error("Could not load archives.");
        const payload = (await res.json()) as { sessions?: ArchivedSession[] };
        if (!cancelled) setSessions(payload.sessions ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load archives.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, subjectId, topicId, refreshKey]);

  const kcOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const session of sessions) {
      session.kcIds.forEach((id, index) => {
        map.set(id, session.kcLabels[index] ?? id);
      });
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [sessions]);

  const filtered = sessions.filter((session) =>
    kcFilter === "all" ? true : session.kcIds.includes(kcFilter),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 p-3 sm:items-center sm:p-6" onMouseDown={onClose}>
      <section
        className="max-h-[84vh] w-full max-w-[560px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[.08em] text-cyan-700 dark:text-cyan-300">Archived chats</div>
            <h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">Session summaries</h2>
            <p className="m-0 mt-1 text-[12.5px] text-gray-500">Scan wrap-ups — not full transcripts.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 dark:border-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </header>

        <div className="border-b border-gray-100 px-4 py-3 dark:border-slate-800">
          <label className="block text-[12px] font-medium text-gray-600 dark:text-slate-300">
            Filter by topic tag
            <select
              value={kcFilter}
              onChange={(event) => setKcFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="all">All</option>
              {kcOptions.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-4 py-3">
          {loading && <p className="m-0 text-[13px] text-gray-500">Loading…</p>}
          {error && <p className="m-0 text-[13px] text-red-600">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="m-0 text-[13px] text-gray-500">No ended sessions here yet. Finish a Tutor sitting and it’ll show up.</p>
          )}
          <ul className="m-0 list-none space-y-2 p-0">
            {filtered.map((session) => (
              <li key={session.id} className="rounded-xl border border-gray-100 bg-gray-50/80 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-500">
                    {session.sessionType.replace("_", " ")} · {session.topicName}
                  </span>
                  <span className="text-[11px] text-gray-400">{formatWhen(session.endedAt ?? session.startedAt)}</span>
                </div>
                <p className="m-0 mt-1.5 text-[13.5px] leading-relaxed text-gray-800 dark:text-slate-100">
                  {session.summaryLine?.trim() || "Session ended (no summary)."}
                </p>
                {session.kcLabels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {session.kcLabels.map((label) => (
                      <span
                        key={`${session.id}-${label}`}
                        className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                {session.gradedOutcome && (
                  <div className="mt-1.5 text-[11.5px] text-gray-500">Graded: {session.gradedOutcome}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}
