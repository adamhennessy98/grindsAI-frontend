import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enqueueKcCheck } from "@/lib/learning/check-queue";
import { isLearnerStyle } from "@/lib/learning/learner-style";
import {
  extractFreeTextSignals,
  upsertStudentToneContext,
} from "@/lib/learning/student-context";

/**
 * Save learner-style self-report (+ optional free-text) into student_context only.
 * Never writes mastery.
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

  let body: { learnerStyle?: unknown; freeText?: unknown };
  try {
    body = (await request.json()) as { learnerStyle?: unknown; freeText?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isLearnerStyle(body.learnerStyle)) {
    return NextResponse.json({ error: "Invalid learnerStyle." }, { status: 400 });
  }

  const freeText = typeof body.freeText === "string" ? body.freeText.trim() : "";

  try {
    const signals = freeText ? extractFreeTextSignals(freeText) : null;
    await upsertStudentToneContext(supabase, user.id, {
      learnerStyle: body.learnerStyle,
      anxietyFlag: signals?.anxietyFlag,
      notes: signals?.toneNotes,
      rawFreeText: freeText || null,
    });

    if (signals?.topicHints.length) {
      for (const hint of signals.topicHints) {
        await enqueueKcCheck(supabase, user.id, {
          kcId: hint.kcId,
          subjectId: hint.subjectId,
          reason: hint.reason,
          source: "free_text",
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[learning/learner-style] failed:", err);
    return NextResponse.json({ error: "Could not save learner style." }, { status: 500 });
  }
}

export async function GET() {
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

  try {
    const { data, error } = await supabase
      .from("student_context")
      .select("learner_style")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({
      learnerStyle: isLearnerStyle(data?.learner_style) ? data.learner_style : null,
    });
  } catch (err) {
    console.error("[learning/learner-style] GET failed:", err);
    return NextResponse.json({ learnerStyle: null });
  }
}
