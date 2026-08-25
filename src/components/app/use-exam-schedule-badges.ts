"use client";

import { useEffect, useState } from "react";
import type { ExamScheduleEntry } from "@/lib/learning/exam-schedule";
import { examCountdownShort } from "@/lib/learning/exam-schedule";

/** Map subjectId → compact countdown (e.g. `280d`). */
export function useExamScheduleBadges() {
  const [badges, setBadges] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/learning/exam-schedule");
        if (!res.ok) return;
        const payload = (await res.json()) as { schedule?: ExamScheduleEntry[] };
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const row of payload.schedule ?? []) {
          const label = examCountdownShort(row.daysUntil);
          if (label && row.daysUntil !== null && row.daysUntil >= 0) {
            next[row.subjectId] = label;
          }
        }
        setBadges(next);
      } catch {
        /* ignore */
      }
    };

    void load();
    const onUpdate = () => void load();
    window.addEventListener("grindsai:exam-schedule-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("grindsai:exam-schedule-updated", onUpdate);
    };
  }, []);

  return badges;
}
