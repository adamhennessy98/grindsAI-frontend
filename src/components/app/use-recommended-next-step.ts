"use client";

import { useEffect, useState } from "react";
import type { NextStep } from "@/lib/learning/next-step";

export function useRecommendedNextStep(subjectId?: string | null) {
  const [nextStep, setNextStep] = useState<NextStep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const qs = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : "";
    void (async () => {
      try {
        const res = await fetch(`/api/learning/next-step${qs}`);
        if (!res.ok) throw new Error("failed");
        const payload = (await res.json()) as { nextStep?: NextStep };
        if (!cancelled) setNextStep(payload.nextStep ?? null);
      } catch {
        if (!cancelled) setNextStep(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  return { nextStep, loading };
}
