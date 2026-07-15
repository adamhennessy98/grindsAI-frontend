import type { SupabaseClient } from "@supabase/supabase-js";

export type MemorySource = "chat" | "onboarding" | "exam_tracker" | "progress" | "manual";

export type StudentMemory = {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId: string | null;
  level: string | null;
  source: MemorySource;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type NewStudentMemory = {
  subjectId?: string | null;
  topicId?: string | null;
  level?: string | null;
  source?: MemorySource;
  summary: string;
  metadata?: Record<string, unknown>;
};

type MemoryRow = {
  id: string;
  user_id: string;
  subject_id: string | null;
  topic_id: string | null;
  level: string | null;
  source: string;
  summary: string;
  metadata: unknown;
  created_at: string;
};

const MEMORY_SELECT = "id, user_id, subject_id, topic_id, level, source, summary, metadata, created_at";

const MEMORY_SOURCES = new Set<MemorySource>([
  "chat",
  "onboarding",
  "exam_tracker",
  "progress",
  "manual",
]);

function isMemorySource(value: unknown): value is MemorySource {
  return typeof value === "string" && MEMORY_SOURCES.has(value as MemorySource);
}

function parseMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function rowToMemory(row: MemoryRow): StudentMemory {
  return {
    id: row.id,
    userId: row.user_id,
    subjectId: row.subject_id,
    topicId: row.topic_id,
    level: row.level,
    source: isMemorySource(row.source) ? row.source : "chat",
    summary: row.summary,
    metadata: parseMetadata(row.metadata),
    createdAt: row.created_at,
  };
}

export async function saveMemory(
  supabase: SupabaseClient,
  userId: string,
  input: NewStudentMemory,
): Promise<{ ok: true; memory: StudentMemory } | { ok: false; message: string }> {
  const summary = input.summary.trim();
  if (!summary) {
    return { ok: false, message: "Memory summary is required." };
  }

  const payload = {
    user_id: userId,
    subject_id: input.subjectId?.trim() || null,
    topic_id: input.topicId?.trim() || null,
    level: input.level === "OL" || input.level === "HL" ? input.level : null,
    source: input.source && isMemorySource(input.source) ? input.source : "chat",
    summary: summary.slice(0, 1000),
    metadata: input.metadata ?? {},
  };

  const { data, error } = await supabase.from("student_memories").insert(payload).select(MEMORY_SELECT).single();

  if (error || !data) {
    return { ok: false, message: error?.message || "Could not save memory." };
  }

  return { ok: true, memory: rowToMemory(data as MemoryRow) };
}

export async function loadRecentMemories(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    subjectId?: string | null;
    topicId?: string | null;
    limit?: number;
  },
): Promise<StudentMemory[]> {
  const limit = Math.min(20, Math.max(1, options?.limit ?? 8));

  let query = supabase
    .from("student_memories")
    .select(MEMORY_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.subjectId) {
    query = query.eq("subject_id", options.subjectId);
  }
  if (options?.topicId) {
    query = query.eq("topic_id", options.topicId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as MemoryRow[]).map(rowToMemory);
}

/** Turn recent memories into a short prompt block for agents. */
export function formatMemoriesForPrompt(memories: StudentMemory[]): string {
  if (!memories.length) return "";

  const lines = memories.map((memory) => {
    const scope = [memory.subjectId, memory.topicId].filter(Boolean).join("/");
    const prefix = scope ? `${scope}: ` : "";
    return `- ${prefix}${memory.summary}`;
  });

  return ["What we already know about this student from recent activity:", ...lines].join("\n");
}

/** Lightweight chat-turn note — no extra LLM call. Good enough to accumulate usage memory. */
export function buildChatMemorySummary(input: {
  subjectId: string;
  topicId?: string | null;
  mode?: string | null;
  userMessage: string;
  subjectName?: string;
  topicName?: string;
}): string {
  const focus = [input.subjectName ?? input.subjectId, input.topicName || input.topicId]
    .filter((part): part is string => Boolean(part && part !== "general"))
    .join(" / ");

  const clipped = input.userMessage.trim().replace(/\s+/g, " ").slice(0, 160);
  const stuck = input.mode === "stuck" ? " while stuck" : "";

  return `Worked on ${focus || input.subjectId}${stuck}. Asked: "${clipped}${input.userMessage.trim().length > 160 ? "…" : ""}"`;
}
