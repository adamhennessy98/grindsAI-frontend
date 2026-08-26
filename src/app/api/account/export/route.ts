import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type QueryBuilder = {
  select: (columns: string) => QueryBuilder;
  eq: (column: string, value: string) => QueryBuilder;
  in: (column: string, values: string[]) => QueryBuilder;
  order: (column: string, options: { ascending: boolean }) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
  maybeSingle: () => Promise<{ data?: unknown; error?: { message?: string } | null }>;
};

async function readTable(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, table: string, query: (builder: QueryBuilder) => Promise<{ data?: unknown; error?: { message?: string } | null }>) {
  try {
    const result = await query(supabase.from(table) as unknown as QueryBuilder);
    return result.error ? { available: false, data: null } : { available: true, data: result.data ?? null };
  } catch {
    return { available: false, data: null };
  }
}

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await readTable(supabase, "conversations", (query) => query
    .select("id, subject_id, level, topic_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true }));
  const conversationIds = Array.isArray(conversations.data)
    ? conversations.data.flatMap((row) => row && typeof row === "object" && "id" in row && typeof row.id === "string" ? [row.id] : [])
    : [];
  const messages = conversationIds.length
    ? await readTable(supabase, "messages", (query) => query
      .select("conversation_id, role, content, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true }))
    : { available: true, data: [] };

  const [profile, progress, memories, context, learningEvents, mastery, sessions, examSchedule] = await Promise.all([
    readTable(supabase, "profiles", (query) => query.select("id, email, display_name, year_group, exam_target, challenge, subjects, subject_levels, onboarding_completed_at").eq("id", user.id).maybeSingle()),
    readTable(supabase, "student_subject_progress", (query) => query.select("subject_id, state, updated_at").eq("user_id", user.id).order("updated_at", { ascending: true })),
    readTable(supabase, "student_memories", (query) => query.select("subject_id, topic_id, level, source, summary, metadata, created_at").eq("user_id", user.id).order("created_at", { ascending: true })),
    readTable(supabase, "student_context", (query) => query.select("anxiety_flag, notes, raw_free_text, learner_style, updated_at").eq("user_id", user.id).maybeSingle()),
    readTable(supabase, "learning_events", (query) => query.select("kc_id, subject_id, outcome, source, marks_earned, marks_possible, hint_depth, scaffolded, transfer_check, error_type, created_at").eq("user_id", user.id).order("created_at", { ascending: true })),
    readTable(supabase, "student_kc_state", (query) => query.select("kc_id, mastery_p, evidence_n, last_outcome, last_event_at, updated_at").eq("user_id", user.id).order("updated_at", { ascending: true })),
    readTable(supabase, "study_sessions", (query) => query.select("id, subject_id, level, topic_id, session_type, started_at, ended_at, summary_line, graded_outcome").eq("user_id", user.id).order("started_at", { ascending: true })),
    readTable(supabase, "student_exam_schedule", (query) => query.select("subject_id, level, exam_date, paper_label, updated_at").eq("user_id", user.id).order("updated_at", { ascending: true })),
  ]);

  const body = {
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email ?? null },
    data: { profile, progress, conversations, messages, memories, context, learningEvents, mastery, sessions, examSchedule },
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=grindsai-account-data.json",
      "Cache-Control": "no-store, private",
    },
  });
}
