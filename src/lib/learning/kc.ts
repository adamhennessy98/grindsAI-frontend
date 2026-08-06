import { SUBJECT_TOPICS } from "@/lib/constants";
import { MATHS_HL_TOPIC_NAME_TO_STRAND } from "@/lib/learning/maths-hl-kcs";

export type LearningOutcome = "correct" | "incorrect" | "partial";
export type LearningEventSource =
  | "tutor"
  | "exam_gen"
  | "archive"
  | "system"
  | "onboarding_diagnostic";

export type LearningEventInput = {
  kcId: string;
  subjectId: string;
  chunkId?: string | null;
  outcome: LearningOutcome;
  marksEarned?: number | null;
  marksPossible?: number | null;
  hintDepth?: number;
  scaffolded?: boolean;
  transferCheck?: boolean;
  errorType?: string | null;
  latencyMs?: number | null;
  source: LearningEventSource;
  conversationId?: string | null;
  messageId?: string | null;
};

/** Resolve strand topic id → maths HL/OL kc_id (v1 strand seed). */
export function kcIdForStrandTopic(subjectId: string, level: string, topicId: string): string | null {
  if (subjectId !== "maths") return null;
  const topics = SUBJECT_TOPICS.maths ?? [];
  const known = topics.some((t) => t.id === topicId);
  if (!known) return null;
  const lvl = level === "OL" ? "hl" : "hl";
  // v1 DB seed is HL-only; map OL attempts onto HL strand KCs until OL catalog exists
  void lvl;
  return `maths.hl.${topicId}`;
}

export function strandTopicFromChunkTopicName(topicName: string | undefined | null): string {
  if (!topicName?.trim()) return "general";
  const direct = MATHS_HL_TOPIC_NAME_TO_STRAND[topicName.trim()];
  if (direct) return direct;
  const lower = topicName.trim().toLowerCase();
  for (const [name, strand] of Object.entries(MATHS_HL_TOPIC_NAME_TO_STRAND)) {
    if (name.toLowerCase() === lower) return strand;
  }
  return "general";
}

export function kcIdFromChunkTopic(
  subjectId: string,
  level: string,
  topicName: string | undefined | null,
): string | null {
  if (subjectId !== "maths") return null;
  const strand = strandTopicFromChunkTopicName(topicName);
  return kcIdForStrandTopic(subjectId, level, strand);
}

export function resolveKcId(subjectId: string, level: string, topicId: string): string | null {
  return kcIdForStrandTopic(subjectId, level, topicId);
}
