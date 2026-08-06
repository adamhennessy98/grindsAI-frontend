import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchStudentPrefs, upsertStudentPrefs } from "@/lib/learning/profile";
import type { StudentProfile, StudyChallenge, SubjectLevel, YearGroup } from "@/lib/onboarding";
import type { TargetGradeBand } from "@/lib/learning/diagnostic-bank";

type PrefsBody = StudentProfile & { markComplete?: boolean };

function isProfile(body: unknown): body is PrefsBody {
  if (!body || typeof body !== "object") return false;
  const p = body as PrefsBody;
  return (
    typeof p.yearGroup === "string" &&
    Array.isArray(p.subjects) &&
    typeof p.subjectLevels === "object" &&
    p.subjectLevels !== null &&
    typeof p.examTarget === "string" &&
    typeof p.challenge === "string"
  );
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
    const profile = await fetchStudentPrefs(supabase, user.id);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("[learning/prefs] GET failed:", err);
    return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
  }
}

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!isProfile(body)) {
    return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
  }

  const markComplete = Boolean(body.markComplete);
  const profile: StudentProfile = {
    yearGroup: body.yearGroup as YearGroup,
    subjects: body.subjects.map(String),
    subjectLevels: body.subjectLevels as Record<string, SubjectLevel>,
    examTarget: body.examTarget,
    challenge: body.challenge as StudyChallenge,
    targetGradeBand: (body.targetGradeBand as TargetGradeBand) ?? null,
    reasonForUsing: body.reasonForUsing ?? null,
    completedAt: markComplete
      ? body.completedAt || new Date().toISOString()
      : body.completedAt ?? null,
  };

  try {
    await upsertStudentPrefs(supabase, profile, { markComplete });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[learning/prefs] POST failed:", err);
    return NextResponse.json({ error: "Could not save profile." }, { status: 500 });
  }
}
