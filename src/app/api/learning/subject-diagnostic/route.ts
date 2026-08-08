import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildSubjectQuickCheck } from "@/lib/learning/diagnostic-bank";
import { recordLearningEvent } from "@/lib/learning/events";

type AnswerPayload = {
  questionId: string;
  choiceId: string;
};

/**
 * GET ?subjectId=maths — 2 content questions for first-open quick check, or empty.
 * Also returns whether this user already completed/skipped for that subject.
 */
export async function GET(request: Request) {
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

  const subjectId = new URL(request.url).searchParams.get("subjectId")?.trim() ?? "";
  if (!subjectId) {
    return NextResponse.json({ error: "subjectId required." }, { status: 400 });
  }

  const { data: statusRow } = await supabase
    .from("subject_diagnostic_status")
    .select("status")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId)
    .maybeSingle();

  const paper = buildSubjectQuickCheck(subjectId);
  const questions = paper.map(({ correctChoiceId: _c, ...rest }) => rest);

  return NextResponse.json({
    questions,
    alreadyDone: Boolean(statusRow?.status),
    status: statusRow?.status ?? null,
  });
}

/**
 * POST — submit answers (source: subject_diagnostic) or skip.
 * Events are best-effort; status is always recorded so the prompt does not reappear.
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

  let body: { subjectId?: string; action?: "complete" | "skip"; answers?: AnswerPayload[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const subjectId = typeof body.subjectId === "string" ? body.subjectId.trim() : "";
  if (!subjectId) {
    return NextResponse.json({ error: "subjectId required." }, { status: 400 });
  }

  const action = body.action === "skip" ? "skip" : "complete";

  try {
    if (action === "skip") {
      await upsertDiagnosticStatus(supabase, user.id, subjectId, "skipped");
      return NextResponse.json({ ok: true, status: "skipped" });
    }

    const paper = buildSubjectQuickCheck(subjectId);
    if (paper.length < 2) {
      await upsertDiagnosticStatus(supabase, user.id, subjectId, "skipped");
      return NextResponse.json({ ok: true, status: "skipped", reason: "no_content_bank" });
    }

    const answers = Array.isArray(body.answers) ? body.answers : [];
    const byId = new Map(paper.map((q) => [q.id, q]));
    const answered = new Set(answers.map((a) => a.questionId));
    if (answered.size !== paper.length || paper.some((q) => !answered.has(q.id))) {
      return NextResponse.json({ error: "Answer both quick-check questions, or skip." }, { status: 400 });
    }

    // Record status first so a bad event write cannot leave the UI stuck re-prompting.
    await upsertDiagnosticStatus(supabase, user.id, subjectId, "completed");

    const eventErrors: string[] = [];
    for (const answer of answers) {
      const q = byId.get(answer.questionId);
      if (!q || !q.choices.some((c) => c.id === answer.choiceId)) {
        eventErrors.push(answer.questionId);
        continue;
      }
      const outcome = answer.choiceId === q.correctChoiceId ? "correct" : "incorrect";
      try {
        await recordLearningEvent(supabase, user.id, {
          kcId: q.kcId,
          subjectId: q.subjectId,
          outcome,
          source: "subject_diagnostic",
          hintDepth: 0,
          scaffolded: false,
          transferCheck: false,
          chunkId: q.id,
        });
      } catch (err) {
        console.error("[subject-diagnostic] event failed:", q.kcId, err);
        eventErrors.push(q.kcId);
      }
    }

    return NextResponse.json({
      ok: true,
      status: "completed",
      eventWarnings: eventErrors.length,
    });
  } catch (err) {
    console.error("[subject-diagnostic] POST failed:", err);
    return NextResponse.json({ error: "Could not save quick check." }, { status: 500 });
  }
}

async function upsertDiagnosticStatus(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  userId: string,
  subjectId: string,
  status: "completed" | "skipped",
) {
  const { error } = await supabase.from("subject_diagnostic_status").upsert(
    {
      user_id: userId,
      subject_id: subjectId,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,subject_id" },
  );
  if (error) throw error;
}
