import type { SupabaseClient } from "@supabase/supabase-js";
import { conversationKey } from "@/lib/constants";

export const STUDY_SESSION_TYPES = [
  "explain",
  "topic_check",
  "paste_question",
  "test_me",
  "exam_practice",
] as const;

export type StudySessionType = (typeof STUDY_SESSION_TYPES)[number];

export type StudySession = {
  id: string;
  userId: string;
  sessionType: StudySessionType;
  subjectId: string;
  level: "HL" | "OL";
  topicId: string;
  status: "active" | "ended";
  conversationId: string | null;
};

function isSessionType(value: unknown): value is StudySessionType {
  return typeof value === "string" && (STUDY_SESSION_TYPES as readonly string[]).includes(value);
}

export function parseSessionType(value: unknown, fallback: StudySessionType = "explain"): StudySessionType {
  return isSessionType(value) ? value : fallback;
}

function mapRow(row: {
  id: string;
  user_id: string;
  session_type: string;
  subject_id: string;
  level: string;
  topic_id: string;
  status: string;
  conversation_id: string | null;
}): StudySession {
  return {
    id: row.id,
    userId: row.user_id,
    sessionType: parseSessionType(row.session_type),
    subjectId: row.subject_id,
    level: row.level === "OL" ? "OL" : "HL",
    topicId: row.topic_id,
    status: row.status === "ended" ? "ended" : "active",
    conversationId: row.conversation_id,
  };
}

/** Create a new conversation row — never reuse by topic key. */
export async function createConversationForSession(
  supabase: SupabaseClient,
  input: {
    userId: string;
    subjectId: string;
    level: "HL" | "OL";
    topicId: string;
    sessionId: string;
  },
): Promise<{ ok: true; conversationId: string } | { ok: false; error: string }> {
  const softKey = `${conversationKey(input.subjectId, input.level, input.topicId)}:session:${input.sessionId}`;
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: input.userId,
      subject_id: input.subjectId,
      level: input.level,
      topic_id: input.topicId,
      conversation_key: softKey,
    })
    .select("id")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not start conversation." };
  }
  return { ok: true, conversationId: data.id };
}

export async function createStudySession(
  supabase: SupabaseClient,
  input: {
    userId: string;
    sessionType: StudySessionType;
    subjectId: string;
    level: "HL" | "OL";
    topicId: string;
    conversationId?: string | null;
  },
): Promise<{ ok: true; session: StudySession } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      user_id: input.userId,
      session_type: input.sessionType,
      subject_id: input.subjectId,
      level: input.level,
      topic_id: input.topicId,
      status: "active",
      conversation_id: input.conversationId ?? null,
    })
    .select("id, user_id, session_type, subject_id, level, topic_id, status, conversation_id")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not start session." };
  }
  return { ok: true, session: mapRow(data) };
}

export async function getOwnSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
): Promise<StudySession | null> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("id, user_id, session_type, subject_id, level, topic_id, status, conversation_id")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
}

export async function endStudySession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const session = await getOwnSession(supabase, userId, sessionId);
  if (!session) return { ok: false, error: "Session not found.", status: 404 };
  if (session.status === "ended") return { ok: true };

  const { error } = await supabase
    .from("study_sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message, status: 500 };
  return { ok: true };
}

/**
 * Resolve an active chat-backed session: reuse client sessionId if still active,
 * otherwise create a fresh session + conversation (no topic-key reuse).
 */
export async function ensureChatStudySession(
  supabase: SupabaseClient,
  input: {
    userId: string;
    sessionId?: string | null;
    sessionType: StudySessionType;
    subjectId: string;
    level: "HL" | "OL";
    topicId: string;
  },
): Promise<
  | { ok: true; session: StudySession; conversationId: string; created: boolean }
  | { ok: false; error: string; status: number }
> {
  if (input.sessionId) {
    const existing = await getOwnSession(supabase, input.userId, input.sessionId);
    if (!existing) return { ok: false, error: "Session not found.", status: 404 };
    if (existing.status !== "active") {
      return { ok: false, error: "This session has ended. Start a new one.", status: 409 };
    }
    if (existing.conversationId) {
      return { ok: true, session: existing, conversationId: existing.conversationId, created: false };
    }
    const conv = await createConversationForSession(supabase, {
      userId: input.userId,
      subjectId: input.subjectId,
      level: input.level,
      topicId: input.topicId,
      sessionId: existing.id,
    });
    if (!conv.ok) return { ok: false, error: conv.error, status: 500 };
    const { error: linkErr } = await supabase
      .from("study_sessions")
      .update({ conversation_id: conv.conversationId })
      .eq("id", existing.id)
      .eq("user_id", input.userId);
    if (linkErr) return { ok: false, error: linkErr.message, status: 500 };
    return {
      ok: true,
      session: { ...existing, conversationId: conv.conversationId },
      conversationId: conv.conversationId,
      created: false,
    };
  }

  const createdSession = await createStudySession(supabase, {
    userId: input.userId,
    sessionType: input.sessionType,
    subjectId: input.subjectId,
    level: input.level,
    topicId: input.topicId,
  });
  if (!createdSession.ok) return { ok: false, error: createdSession.error, status: 500 };

  const conv = await createConversationForSession(supabase, {
    userId: input.userId,
    subjectId: input.subjectId,
    level: input.level,
    topicId: input.topicId,
    sessionId: createdSession.session.id,
  });
  if (!conv.ok) return { ok: false, error: conv.error, status: 500 };

  const { error: linkErr } = await supabase
    .from("study_sessions")
    .update({ conversation_id: conv.conversationId })
    .eq("id", createdSession.session.id)
    .eq("user_id", input.userId);
  if (linkErr) return { ok: false, error: linkErr.message, status: 500 };

  return {
    ok: true,
    session: { ...createdSession.session, conversationId: conv.conversationId },
    conversationId: conv.conversationId,
    created: true,
  };
}
