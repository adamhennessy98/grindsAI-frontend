import { NextResponse } from "next/server";
import { wrapUpAndEndSession } from "@/lib/learning/session-wrapup";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

type Body = { sessionId?: string };

/** End a study session and run constrained wrap-up (Stage 02). */
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

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const ended = await wrapUpAndEndSession(supabase, user.id, sessionId);
  if (!ended.ok) {
    return NextResponse.json({ error: ended.error }, { status: ended.status });
  }

  return NextResponse.json({
    ok: true,
    sessionId: ended.sessionId,
    wrapUp: ended.wrapUp,
  });
}
