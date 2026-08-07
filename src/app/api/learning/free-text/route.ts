import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enqueueKcCheck } from "@/lib/learning/check-queue";
import {
  extractFreeTextSignals,
  upsertStudentToneContext,
} from "@/lib/learning/student-context";

/**
 * Anytime free-text box. Extracts tone → student_context and topics → check queue.
 * Never writes learning_events or student_kc_state.
 */
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

  let body: { text?: string };
  try {
    body = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 4000) {
    return NextResponse.json({ error: "Text required (max 4000 chars)." }, { status: 400 });
  }

  try {
    const signals = extractFreeTextSignals(text);
    const tone = await upsertStudentToneContext(supabase, user.id, {
      anxietyFlag: signals.anxietyFlag || undefined,
      notes: signals.toneNotes.length ? signals.toneNotes : undefined,
      rawFreeText: text,
    });

    for (const hint of signals.topicHints) {
      await enqueueKcCheck(supabase, user.id, {
        kcId: hint.kcId,
        subjectId: hint.subjectId,
        reason: hint.reason,
        source: "free_text",
      });
    }

    return NextResponse.json({
      ok: true,
      queuedTopics: signals.topicHints.length,
      tone: { anxietyFlag: tone.anxietyFlag, notes: tone.notes },
    });
  } catch (err) {
    console.error("[learning/free-text] failed:", err);
    return NextResponse.json({ error: "Could not save note." }, { status: 500 });
  }
}
