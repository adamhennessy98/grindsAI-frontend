import { NextResponse } from "next/server";
import { isSameOriginRequest, readJsonBody } from "@/lib/request-security";
import { normaliseStudyStateBySubject, type StudyStateBySubject } from "@/lib/study-state";
import { createClient } from "@/lib/supabase/server";

const MAX_BODY_BYTES = 96_000;

async function currentUser() {
  const supabase = await createClient();
  if (!supabase) return { error: NextResponse.json({ error: "Supabase is not configured." }, { status: 503 }) };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { supabase, user };
}

export async function GET() {
  const auth = await currentUser();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("student_subject_progress")
    .select("subject_id, state")
    .eq("user_id", auth.user.id);

  if (error) {
    console.error("[learning/study-state] GET failed:", error);
    return NextResponse.json({ error: "Could not load progress." }, { status: 500 });
  }

  const state = normaliseStudyStateBySubject(
    Object.fromEntries((data ?? []).map((row) => [row.subject_id as string, row.state])),
  );
  return NextResponse.json({ state });
}

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const auth = await currentUser();
  if ("error" in auth) return auth.error;

  const parsed = await readJsonBody<Record<string, unknown>>(request, MAX_BODY_BYTES);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });

  const state = normaliseStudyStateBySubject(parsed.body.state);
  const rows = Object.entries(state).map(([subjectId, subjectState]) => ({
    user_id: auth.user.id,
    subject_id: subjectId,
    state: subjectState,
  }));

  if (!rows.length) return NextResponse.json({ state: {} satisfies StudyStateBySubject });

  const { error } = await auth.supabase
    .from("student_subject_progress")
    .upsert(rows, { onConflict: "user_id,subject_id" });

  if (error) {
    console.error("[learning/study-state] PUT failed:", error);
    return NextResponse.json({ error: "Could not save progress." }, { status: 500 });
  }

  return NextResponse.json({ state });
}
