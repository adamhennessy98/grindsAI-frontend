import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { enqueueKcCheck } from "@/lib/learning/check-queue";
import { recordLearningEvent } from "@/lib/learning/events";
import { resolveKcId, type LearningOutcome } from "@/lib/learning/kc";
import { MATHS_HL_KC_IDS } from "@/lib/learning/maths-hl-kcs";
import {
  endStudySession,
  getOwnSession,
  type StudySession,
  type StudySessionType,
} from "@/lib/learning/sessions";

export type SessionWrapUpResult = {
  summaryLine: string | null;
  kcIds: string[];
  gradedOutcome: LearningOutcome | null;
  queuePushed: number;
  masteryWritten: boolean;
  usedFallback: boolean;
};

type ExtractedWrapUp = {
  summaryLine: string;
  kcIds: string[];
  gradedAttempt: null | { kcId: string; outcome: LearningOutcome };
  queuePushes: { kcId: string; reason: string }[];
};

const OUTCOMES = new Set<LearningOutcome>(["correct", "incorrect", "partial"]);

function allowedKcIdsForSubject(subjectId: string): Set<string> {
  if (subjectId === "maths") return new Set(MATHS_HL_KC_IDS);
  return new Set();
}

function sanitizeKcId(subjectId: string, level: "HL" | "OL", topicId: string, raw: string | null | undefined): string | null {
  const allowed = allowedKcIdsForSubject(subjectId);
  const trimmed = raw?.trim() ?? "";
  if (trimmed && allowed.has(trimmed)) return trimmed;
  return resolveKcId(subjectId, level, topicId);
}

function stripJsonFences(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

function parseExtracted(raw: unknown, session: StudySession): ExtractedWrapUp {
  const fallbackKc = resolveKcId(session.subjectId, session.level, session.topicId);
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const summaryLine =
    typeof obj.summaryLine === "string" && obj.summaryLine.trim()
      ? obj.summaryLine.trim().slice(0, 240)
      : `Ended a ${session.sessionType.replace("_", " ")} session on ${session.topicId}.`;

  const allowed = allowedKcIdsForSubject(session.subjectId);
  const kcIds = Array.isArray(obj.kcIds)
    ? obj.kcIds
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter((id) => allowed.has(id))
        .slice(0, 6)
    : [];
  if (!kcIds.length && fallbackKc) kcIds.push(fallbackKc);

  let gradedAttempt: ExtractedWrapUp["gradedAttempt"] = null;
  const graded = obj.gradedAttempt;
  if (graded && typeof graded === "object") {
    const g = graded as Record<string, unknown>;
    const outcome = typeof g.outcome === "string" && OUTCOMES.has(g.outcome as LearningOutcome) ? (g.outcome as LearningOutcome) : null;
    const kcId = sanitizeKcId(session.subjectId, session.level, session.topicId, typeof g.kcId === "string" ? g.kcId : null);
    if (outcome && kcId) gradedAttempt = { kcId, outcome };
  }

  const queuePushes: ExtractedWrapUp["queuePushes"] = [];
  if (Array.isArray(obj.queuePushes)) {
    for (const item of obj.queuePushes.slice(0, 5)) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const kcId = sanitizeKcId(
        session.subjectId,
        session.level,
        session.topicId,
        typeof row.kcId === "string" ? row.kcId : null,
      );
      const reason = typeof row.reason === "string" ? row.reason.trim().slice(0, 200) : "";
      if (kcId && reason) queuePushes.push({ kcId, reason });
    }
  }

  return { summaryLine, kcIds, gradedAttempt, queuePushes };
}

function mayWriteMastery(sessionType: StudySessionType) {
  // Never let freeform tutor chat invent mastery. Only bounded graded flows.
  return sessionType === "topic_check" || sessionType === "test_me";
}

async function loadTranscript(
  supabase: SupabaseClient,
  conversationId: string | null,
): Promise<{ role: string; content: string }[]> {
  if (!conversationId) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(40);
  if (error || !data) return [];
  return data.map((row) => ({
    role: String(row.role),
    content: String(row.content ?? "").slice(0, 1500),
  }));
}

async function extractWrapUpWithClaude(
  session: StudySession,
  transcript: { role: string; content: string }[],
): Promise<{ extracted: ExtractedWrapUp; usedFallback: boolean }> {
  const fallback = parseExtracted({}, session);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || transcript.length === 0) {
    return { extracted: fallback, usedFallback: true };
  }

  const allowed = [...allowedKcIdsForSubject(session.subjectId)];
  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 700,
      temperature: 0.2,
      system: [
        "You wrap up a short GrindsAI study session.",
        "Return ONLY valid JSON matching:",
        '{"summaryLine":"one plain-English line","kcIds":["..."],"gradedAttempt":null|{"kcId":"...","outcome":"correct|incorrect|partial"},"queuePushes":[{"kcId":"...","reason":"..."}]}',
        "Rules:",
        "- summaryLine: max ~20 words, no emojis, what the student worked on.",
        "- kcIds: only from the allowed list when provided; else empty.",
        "- gradedAttempt: ONLY if the transcript clearly contains a graded/assessed attempt with an explicit Correct / Partly correct / Needs correction (or equivalent). Otherwise null.",
        "- Do NOT invent mastery from vibes, confidence, or 'student seemed stuck'.",
        "- queuePushes: optional topics to re-check later (not mastery). Empty if unsure.",
        allowed.length ? `Allowed kcIds: ${allowed.join(", ")}` : "No KC catalogue for this subject — leave kcIds empty unless obvious; gradedAttempt null.",
      ].join("\n"),
      messages: [
        {
          role: "user",
          content: [
            `sessionType=${session.sessionType}`,
            `subject=${session.subjectId}`,
            `level=${session.level}`,
            `topicId=${session.topicId}`,
            "Transcript:",
            transcript.map((m) => `${m.role}: ${m.content}`).join("\n\n").slice(0, 12000),
          ].join("\n"),
        },
      ],
    });

    const block = response.content[0];
    const text = block?.type === "text" ? block.text : "";
    const parsed = JSON.parse(stripJsonFences(text)) as unknown;
    return { extracted: parseExtracted(parsed, session), usedFallback: false };
  } catch (err) {
    console.warn("[session-wrapup] extract failed, using fallback:", err);
    return { extracted: fallback, usedFallback: true };
  }
}

/**
 * End a session and write structured wrap-up only.
 * Mastery events are written solely for topic_check / test_me when gradedAttempt is present.
 * Transcript is used for extraction once at end — never as ongoing mastery input.
 */
export async function wrapUpAndEndSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
): Promise<
  | { ok: true; sessionId: string; wrapUp: SessionWrapUpResult }
  | { ok: false; error: string; status: number }
> {
  const session = await getOwnSession(supabase, userId, sessionId);
  if (!session) return { ok: false, error: "Session not found.", status: 404 };

  if (session.status === "ended") {
    const { data } = await supabase
      .from("study_sessions")
      .select("summary_line, kc_ids, graded_outcome")
      .eq("id", sessionId)
      .maybeSingle();
    return {
      ok: true,
      sessionId,
      wrapUp: {
        summaryLine: (data?.summary_line as string | null) ?? null,
        kcIds: Array.isArray(data?.kc_ids) ? (data?.kc_ids as string[]) : [],
        gradedOutcome:
          data?.graded_outcome === "correct" ||
          data?.graded_outcome === "incorrect" ||
          data?.graded_outcome === "partial"
            ? data.graded_outcome
            : null,
        queuePushed: 0,
        masteryWritten: false,
        usedFallback: true,
      },
    };
  }

  const transcript = await loadTranscript(supabase, session.conversationId);
  const { extracted, usedFallback } = await extractWrapUpWithClaude(session, transcript);

  let masteryWritten = false;
  let gradedOutcome: LearningOutcome | null = null;

  if (mayWriteMastery(session.sessionType) && extracted.gradedAttempt) {
    try {
      await recordLearningEvent(supabase, userId, {
        kcId: extracted.gradedAttempt.kcId,
        subjectId: session.subjectId,
        outcome: extracted.gradedAttempt.outcome,
        source: "tutor",
        conversationId: session.conversationId,
        scaffolded: false,
      });
      masteryWritten = true;
      gradedOutcome = extracted.gradedAttempt.outcome;
    } catch (err) {
      console.warn("[session-wrapup] mastery write failed:", err);
    }
  }

  let queuePushed = 0;
  for (const push of extracted.queuePushes) {
    try {
      await enqueueKcCheck(supabase, userId, {
        kcId: push.kcId,
        subjectId: session.subjectId,
        reason: push.reason,
        source: "system",
      });
      queuePushed += 1;
    } catch (err) {
      console.warn("[session-wrapup] queue push failed:", err);
    }
  }

  const { error: updateErr } = await supabase
    .from("study_sessions")
    .update({
      status: "ended",
      ended_at: new Date().toISOString(),
      summary_line: extracted.summaryLine,
      kc_ids: extracted.kcIds,
      graded_outcome: gradedOutcome,
    })
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (updateErr) {
    // Still try to mark ended without wrap-up fields
    const ended = await endStudySession(supabase, userId, sessionId);
    if (!ended.ok) return ended;
    return {
      ok: true,
      sessionId,
      wrapUp: {
        summaryLine: extracted.summaryLine,
        kcIds: extracted.kcIds,
        gradedOutcome,
        queuePushed,
        masteryWritten,
        usedFallback: true,
      },
    };
  }

  return {
    ok: true,
    sessionId,
    wrapUp: {
      summaryLine: extracted.summaryLine,
      kcIds: extracted.kcIds,
      gradedOutcome,
      queuePushed,
      masteryWritten,
      usedFallback,
    },
  };
}
