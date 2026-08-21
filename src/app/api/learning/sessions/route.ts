import { NextResponse } from "next/server";
import { getSubjectTopics, SUBJECTS } from "@/lib/constants";
import { listArchivedSessions } from "@/lib/learning/session-archive";
import {
  createStudySession,
  parseSessionType,
  type StudySessionType,
} from "@/lib/learning/sessions";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

type Body = {
  sessionType?: string;
  subjectId?: string;
  level?: string;
  topicId?: string;
};

function isValidSubject(id: string) {
  return SUBJECTS.some((s) => s.id === id && s.enabled);
}

function validTopicId(subjectId: string, topicId: unknown) {
  const requested = typeof topicId === "string" && topicId.trim() ? topicId.trim() : "general";
  return getSubjectTopics(subjectId).some((topic) => topic.id === requested) ? requested : "general";
}

/** List ended sessions (archive) for a subject, optional topic filter. */
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
  const subjectId = url.searchParams.get("subjectId") ?? "";
  const topicId = url.searchParams.get("topicId");
  if (!isValidSubject(subjectId)) {
    return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
  }

  try {
    const sessions = await listArchivedSessions(supabase, user.id, {
      subjectId,
      topicId: topicId ? validTopicId(subjectId, topicId) : null,
    });
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("[learning/sessions] GET failed:", err);
    return NextResponse.json({ error: "Could not load archived sessions." }, { status: 500 });
  }
}

/** Start a study session (Topic Check / explicit new tutor sitting). Chat can also create on first message. */
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

  const gate = await assertChatAllowed(supabase, user.id, user.email);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const subjectId = typeof body.subjectId === "string" ? body.subjectId : "";
  const level = body.level === "OL" ? "OL" : "HL";
  if (!isValidSubject(subjectId)) {
    return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
  }
  const topicId = validTopicId(subjectId, body.topicId);
  const sessionType: StudySessionType = parseSessionType(body.sessionType, "explain");

  const created = await createStudySession(supabase, {
    userId: user.id,
    sessionType,
    subjectId,
    level,
    topicId,
  });
  if (!created.ok) {
    return NextResponse.json({ error: created.error }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: created.session.id,
    sessionType: created.session.sessionType,
    status: created.session.status,
  });
}
