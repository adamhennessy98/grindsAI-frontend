import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordLearningEvent } from "@/lib/learning/events";
import type { LearningEventInput, LearningEventSource, LearningOutcome } from "@/lib/learning/kc";

const OUTCOMES = new Set(["correct", "incorrect", "partial"]);
const SOURCES = new Set(["tutor", "exam_gen", "archive", "system", "onboarding_diagnostic"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const kcId = typeof body.kcId === "string" ? body.kcId.trim() : "";
  const subjectId = typeof body.subjectId === "string" ? body.subjectId.trim() : "";
  const outcome = typeof body.outcome === "string" ? body.outcome : "";
  const source = typeof body.source === "string" ? body.source : "";

  if (!kcId || !subjectId || !OUTCOMES.has(outcome) || !SOURCES.has(source)) {
    return NextResponse.json(
      { error: "kcId, subjectId, outcome, and source are required." },
      { status: 400 },
    );
  }

  const input: LearningEventInput = {
    kcId,
    subjectId,
    outcome: outcome as LearningOutcome,
    source: source as LearningEventSource,
    chunkId: typeof body.chunkId === "string" ? body.chunkId : null,
    marksEarned: typeof body.marksEarned === "number" ? body.marksEarned : null,
    marksPossible: typeof body.marksPossible === "number" ? body.marksPossible : null,
    hintDepth: typeof body.hintDepth === "number" ? Math.max(0, Math.floor(body.hintDepth)) : 0,
    scaffolded: Boolean(body.scaffolded),
    transferCheck: Boolean(body.transferCheck),
    errorType: typeof body.errorType === "string" ? body.errorType : null,
    latencyMs: typeof body.latencyMs === "number" ? body.latencyMs : null,
    conversationId: typeof body.conversationId === "string" ? body.conversationId : null,
    messageId: typeof body.messageId === "string" ? body.messageId : null,
  };

  try {
    const result = await recordLearningEvent(supabase, user.id, input);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[learning/events] POST failed:", err);
    return NextResponse.json({ error: "Could not record learning event." }, { status: 500 });
  }
}
