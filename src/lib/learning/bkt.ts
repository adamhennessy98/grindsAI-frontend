import type { LearningOutcome } from "@/lib/learning/kc";

export type BktParams = {
  pL: number;
  pT: number;
  pG: number;
  pS: number;
};

export type BktState = BktParams & {
  masteryP: number;
  evidenceN: number;
};

export const DEFAULT_BKT: BktParams = {
  pL: 0.0,
  pT: 0.1,
  pG: 0.2,
  pS: 0.1,
};

/** How much a single update should move mastery (0–1). */
export function evidenceWeight(opts: {
  evidenceN: number;
  source: string;
}): number {
  // Fewer observations → larger swing; grows toward full weight.
  const byCount = Math.min(1, (opts.evidenceN + 1) / 8);
  // Early diagnostics are weaker evidence than a real tutor/archive attempt.
  const bySource =
    opts.source === "onboarding_diagnostic" || opts.source === "subject_diagnostic" ? 0.35 : 1;
  return Math.max(0.15, byCount * bySource);
}

/**
 * Classic BKT update after one observed outcome.
 * partial → treated as incorrect for binary BKT (conservative).
 * Early / diagnostic evidence is blended toward prior (low confidence).
 */
export function updateBkt(
  prev: BktState,
  outcome: LearningOutcome,
  opts?: { source?: string },
): BktState {
  const { pT, pG, pS } = prev;
  let pL = prev.pL;

  const observedCorrect = outcome === "correct";

  if (observedCorrect) {
    const pCorrect = pL * (1 - pS) + (1 - pL) * pG;
    pL = pCorrect > 0 ? (pL * (1 - pS)) / pCorrect : pL;
  } else {
    const pIncorrect = pL * pS + (1 - pL) * (1 - pG);
    pL = pIncorrect > 0 ? (pL * pS) / pIncorrect : pL;
  }

  // Learn transition
  pL = pL + (1 - pL) * pT;

  const weight = evidenceWeight({
    evidenceN: prev.evidenceN,
    source: opts?.source ?? "tutor",
  });
  // Blend toward prior so early answers don't lock the score.
  pL = prev.pL + (pL - prev.pL) * weight;
  pL = Math.min(0.999, Math.max(0.001, pL));

  return {
    pL,
    pT,
    pG,
    pS,
    masteryP: pL,
    evidenceN: prev.evidenceN + 1,
  };
}

/** Soft decay toward prior when unused for many days (read-time modifier). */
export function decayMastery(masteryP: number, lastEventAt: Date | null, now = new Date()): number {
  if (!lastEventAt) return masteryP;
  const days = (now.getTime() - lastEventAt.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 14) return masteryP;
  const halfLifeDays = 60;
  const factor = Math.pow(0.5, (days - 14) / halfLifeDays);
  return masteryP * factor;
}
