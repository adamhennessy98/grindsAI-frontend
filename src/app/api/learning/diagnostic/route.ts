import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildDiagnosticPaper } from "@/lib/learning/diagnostic-bank";
import { recordLearningEvent } from "@/lib/learning/events";
import { upsertStudentPrefs } from "@/lib/learning/profile";
import type { StudentProfile, StudyChallenge, SubjectLevel, YearGroup } from "@/lib/onboarding";
import type { TargetGradeBand } from "@/lib/learning/diagnostic-bank";

/** Return the Stage 3 paper for the student's selected subjects. */
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

  const url = new URL(request.url);
  const subjectsParam = url.searchParams.get("subjects") ?? "";
  const subjectIds = subjectsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!subjectIds.length) {
    return NextResponse.json({ error: "subjects query required." }, { status: 400 });
  }

  const questions = buildDiagnosticPaper(subjectIds).map(({ correctChoiceId: _c, ...rest }) => rest);
  return NextResponse.json({ questions });
}

type AnswerPayload = {
  questionId: string;
  choiceId: string;
  subjectId: string;
  kcId: string;
  correctChoiceId: string;
};

type CompleteBody = {
  profile: StudentProfile;
  answers: AnswerPayload[];
};

/**
 * Grade diagnostic answers → learning_events (onboarding_diagnostic, no scaffolding),
 * then mark onboarding complete.
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

  let body: CompleteBody;
  try {
    body = (await request.json()) as CompleteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const profileIn = body.profile;
  if (
    !profileIn?.yearGroup ||
    !Array.isArray(profileIn.subjects) ||
    !profileIn.challenge ||
    !Array.isArray(body.answers)
  ) {
    return NextResponse.json({ error: "Invalid diagnostic payload." }, { status: 400 });
  }

  // Re-build expected paper server-side so clients can't invent correct answers.
  const paper = buildDiagnosticPaper(profileIn.subjects);
  if (!paper.length) {
    return NextResponse.json({ error: "No diagnostic questions for selected subjects." }, { status: 400 });
  }
  const byId = new Map(paper.map((q) => [q.id, q]));
  const answeredIds = new Set(body.answers.map((a) => a.questionId));
  if (answeredIds.size !== paper.length || paper.some((q) => !answeredIds.has(q.id))) {
    return NextResponse.json(
      { error: "All diagnostic questions must be answered before completing onboarding." },
      { status: 400 },
    );
  }

  try {
    for (const answer of body.answers) {
      const q = byId.get(answer.questionId);
      if (!q) {
        return NextResponse.json({ error: "Unknown diagnostic question." }, { status: 400 });
      }
      if (!q.choices.some((c) => c.id === answer.choiceId)) {
        return NextResponse.json({ error: "Invalid diagnostic choice." }, { status: 400 });
      }
      const outcome = answer.choiceId === q.correctChoiceId ? "correct" : "incorrect";
      await recordLearningEvent(supabase, user.id, {
        kcId: q.kcId,
        subjectId: q.subjectId,
        outcome,
        source: "onboarding_diagnostic",
        hintDepth: 0,
        scaffolded: false,
        transferCheck: false,
        chunkId: q.id,
      });
    }

    const completedAt = new Date().toISOString();
    const profile: StudentProfile = {
      yearGroup: profileIn.yearGroup as YearGroup,
      subjects: profileIn.subjects.map(String),
      subjectLevels: profileIn.subjectLevels as Record<string, SubjectLevel>,
      examTarget: profileIn.examTarget,
      challenge: profileIn.challenge as StudyChallenge,
      targetGradeBand: (profileIn.targetGradeBand as TargetGradeBand) ?? null,
      reasonForUsing: profileIn.reasonForUsing ?? null,
      completedAt,
    };

    await upsertStudentPrefs(supabase, profile, { markComplete: true });

    return NextResponse.json({ ok: true, completedAt });
  } catch (err) {
    console.error("[learning/diagnostic] POST failed:", err);
    return NextResponse.json({ error: "Could not finish diagnostic." }, { status: 500 });
  }
}
