import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertChatAllowed } from "@/lib/subscription";
import { SUBJECTS } from "@/lib/constants";
import { generateTutorReply } from "@/lib/llm";
import type { Message } from "@/lib/types";

type ChatBody = {
  conversationId?: string | null;
  subjectId: string;
  level: string;
  text: string;
};

function isValidSubject(id: string) {
  return SUBJECTS.some((s) => s.id === id && s.enabled);
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

  const gate = await assertChatAllowed(supabase, user.id);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  const subjectId = typeof body.subjectId === "string" ? body.subjectId : "";
  const level = body.level === "OL" ? "OL" : "HL";
  if (!isValidSubject(subjectId)) {
    return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
  }

  let conversationId = typeof body.conversationId === "string" ? body.conversationId : null;

  if (conversationId) {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
  } else {
    const { data: created, error: insErr } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, subject_id: subjectId, level })
      .select("id")
      .single();
    if (insErr || !created) {
      return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
    }
    conversationId = created.id;
  }

  const { error: userMsgErr } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: text,
  });
  if (userMsgErr) {
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  const { data: rows, error: rowsErr } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (rowsErr || !rows?.length) {
    return NextResponse.json({ error: "Could not load conversation." }, { status: 500 });
  }

  const mapped: Message[] = rows.map((r: { role: string; content: string }) => ({
    role: r.role === "ai" ? "ai" : "user",
    text: r.content,
  }));

  const history = mapped.slice(0, -1).map((m) => ({ role: m.role, text: m.text }));
  const userMessage = mapped[mapped.length - 1]!.text;

  let reply: string;
  let usedFallback = false;
  try {
    const out = await generateTutorReply({ subjectId, level, history, userMessage });
    reply = out.text;
    usedFallback = out.usedFallback;
  } catch {
    const { socraticReply } = await import("@/lib/constants");
    reply = socraticReply(subjectId, userMessage);
    usedFallback = true;
  }

  const { error: aiMsgErr } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "ai",
    content: reply,
  });
  if (aiMsgErr) {
    return NextResponse.json({ error: "Could not save the tutor reply." }, { status: 500 });
  }

  return NextResponse.json({ conversationId, reply, usedFallback });
}
