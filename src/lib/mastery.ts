import type { SupabaseClient } from "@supabase/supabase-js";

export type Correctness = "correct" | "partial" | "incorrect";
export type MasteryTrend = "improving" | "declining" | "stable";

export type RecordInteractionInput = {
  studentId: string;
  topicId: string;
  correctness: Correctness;
  misconceptionTag?: string | null;
  rawExcerpt?: string | null;
  sessionId?: string | null;
};

/** PRIVACY: never store full free-text answers here — truncate aggressively. Retention TBD. */
export const RAW_EXCERPT_MAX_CHARS = 200;

const NEUTRAL_SCORE = 0.5;
const DECAY_HALF_LIFE_DAYS = 30;
const ALPHA_CORRECT = 0.28;
const ALPHA_PARTIAL = 0.12;
const ALPHA_INCORRECT = 0.32;
const TREND_EPSILON = 0.02;

export type MasteryEmaState = {
  proficiencyScore: number;
  lastUpdated: Date;
};

export type MasteryEmaResult = {
  proficiencyScore: number;
  trend: MasteryTrend;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function daysBetween(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, ms / (1000 * 60 * 60 * 24));
}

/** Exponential decay of score toward the neutral midpoint over time. */
export function decayMasteryScore(score: number, daysSinceUpdate: number, nowNeutral = NEUTRAL_SCORE): number {
  if (daysSinceUpdate <= 0) return clamp01(score);
  const lambda = Math.LN2 / DECAY_HALF_LIFE_DAYS;
  const weight = Math.exp(-lambda * daysSinceUpdate);
  return clamp01(nowNeutral + (score - nowNeutral) * weight);
}

/**
 * Pure EMA + time-decay update for one graded interaction.
 * Easy to unit-test and swap for BKT/IRT later without schema changes.
 */
export function applyMasteryEmaUpdate(
  previous: MasteryEmaState | null,
  correctness: Correctness,
  now: Date = new Date(),
): MasteryEmaResult {
  const priorScore = previous?.proficiencyScore ?? NEUTRAL_SCORE;
  const priorUpdated = previous?.lastUpdated ?? now;
  const decayed = decayMasteryScore(priorScore, daysBetween(priorUpdated, now));

  let alpha: number;
  let target: number;
  if (correctness === "correct") {
    alpha = ALPHA_CORRECT;
    target = 1;
  } else if (correctness === "partial") {
    alpha = ALPHA_PARTIAL;
    target = 0.65;
  } else {
    alpha = ALPHA_INCORRECT;
    target = 0;
  }

  const next = clamp01(decayed + alpha * (target - decayed));

  let trend: MasteryTrend = "stable";
  if (next > decayed + TREND_EPSILON) trend = "improving";
  else if (next < decayed - TREND_EPSILON) trend = "declining";

  return { proficiencyScore: next, trend };
}

function truncateExcerpt(rawExcerpt?: string | null): string | null {
  if (!rawExcerpt) return null;
  const trimmed = rawExcerpt.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed.slice(0, RAW_EXCERPT_MAX_CHARS);
}

function isCorrectness(value: unknown): value is Correctness {
  return value === "correct" || value === "partial" || value === "incorrect";
}

/**
 * Append-only write to interaction_events, then recompute mastery_state for that pair.
 * Must use a service-role client — RLS blocks client/anon access to interaction_events.
 */
export async function recordInteractionEvent(
  admin: SupabaseClient,
  input: RecordInteractionInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isCorrectness(input.correctness)) {
    return { ok: false, message: "Invalid correctness value." };
  }

  const { error } = await admin.from("interaction_events").insert({
    student_id: input.studentId,
    topic_id: input.topicId,
    session_id: input.sessionId ?? null,
    raw_excerpt: truncateExcerpt(input.rawExcerpt),
    correctness: input.correctness,
    misconception_tag: input.misconceptionTag?.trim().slice(0, 120) || null,
  });

  if (error) {
    return { ok: false, message: error.message || "Could not record interaction event." };
  }

  return updateMasteryState(admin, input.studentId, input.topicId);
}

/**
 * Recomputes mastery_state for one (student, topic) from the latest prior state + newest event,
 * using EMA + decay. Fully derived — never write here except via this function.
 */
export async function updateMasteryState(
  admin: SupabaseClient,
  studentId: string,
  topicId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const [{ data: existing }, { data: latestEvent, error: eventError }] = await Promise.all([
    admin
      .from("mastery_state")
      .select("proficiency_score, last_updated")
      .eq("student_id", studentId)
      .eq("topic_id", topicId)
      .maybeSingle(),
    admin
      .from("interaction_events")
      .select("correctness, created_at")
      .eq("student_id", studentId)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (eventError) {
    return { ok: false, message: eventError.message || "Could not load interaction events." };
  }
  if (!latestEvent || !isCorrectness(latestEvent.correctness)) {
    return { ok: false, message: "No interaction event found for mastery update." };
  }

  const previous: MasteryEmaState | null = existing
    ? {
        proficiencyScore: Number(existing.proficiency_score),
        lastUpdated: new Date(existing.last_updated),
      }
    : null;

  const now = new Date(latestEvent.created_at);
  const next = applyMasteryEmaUpdate(previous, latestEvent.correctness, now);

  const { error } = await admin.from("mastery_state").upsert(
    {
      student_id: studentId,
      topic_id: topicId,
      proficiency_score: Number(next.proficiencyScore.toFixed(4)),
      last_updated: now.toISOString(),
      trend: next.trend,
    },
    { onConflict: "student_id,topic_id" },
  );

  if (error) {
    return { ok: false, message: error.message || "Could not update mastery state." };
  }

  return { ok: true };
}

type MasteryRow = {
  proficiency_score: number | string;
  topics: { subject: string; topic: string; subtopic: string | null } | null;
};

function topicLabel(row: MasteryRow): string {
  const t = row.topics;
  if (!t) return "Unknown topic";
  return t.subtopic ? `${t.topic} / ${t.subtopic}` : t.topic;
}

/**
 * Compact weakest/strongest summary for prompt injection.
 * Works with the user's own session client (RLS read-own on mastery_state).
 */
export async function getMasterySummary(
  supabase: SupabaseClient,
  studentId: string,
  limit = 3,
): Promise<string> {
  const n = Math.min(8, Math.max(1, Math.round(limit)));

  const { data, error } = await supabase
    .from("mastery_state")
    .select("proficiency_score, topics ( subject, topic, subtopic )")
    .eq("student_id", studentId)
    .order("proficiency_score", { ascending: true });

  if (error || !data?.length) return "";

  const rows = data as unknown as MasteryRow[];
  const weak = rows.slice(0, n);
  const strong = [...rows].reverse().slice(0, n);

  const fmt = (items: MasteryRow[]) =>
    items.map((row) => `${topicLabel(row)} (${Number(row.proficiency_score).toFixed(2)})`).join(", ");

  const lines = [
    "Student mastery:",
    `Weak: ${fmt(weak)}.`,
    strong.length ? `Strong: ${fmt(strong)}.` : "",
  ];

  return lines.filter(Boolean).join(" ");
}

/** Resolve a topics.id from app subjectId + topic display name (or null if missing). */
export async function findTopicId(
  supabase: SupabaseClient,
  subjectId: string,
  topicName: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("topics")
    .select("id")
    .eq("subject", subjectId)
    .eq("topic", topicName)
    .is("subtopic", null)
    .maybeSingle();

  return data?.id ?? null;
}
