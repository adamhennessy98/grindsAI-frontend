import { NextResponse } from "next/server";
import { conversationKey, getSubjectTopics, SUBJECTS } from "@/lib/constants";
import { streamTutorReply } from "@/lib/llm";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/lib/types";

type ChatBody = {
  conversationId?: string | null;
  subjectId: string;
  level: string;
  topicId?: string | null;
  text: string;
  history?: { role: "user" | "ai"; text: string }[];
  studentContext?: string;
};

function isValidSubject(id: string) {
  return SUBJECTS.some((s) => s.id === id && s.enabled);
}

function validTopicId(subjectId: string, topicId: unknown) {
  const requested = typeof topicId === "string" && topicId.trim() ? topicId.trim() : "general";
  return getSubjectTopics(subjectId).some((topic) => topic.id === requested) ? requested : "general";
}

async function* singleChunk(text: string) {
  yield text;
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
  const topicId = validTopicId(subjectId, body.topicId);
  const key = conversationKey(subjectId, level, topicId);

  const history: Pick<Message, "role" | "text">[] = Array.isArray(body.history)
    ? body.history.map((m) => ({ role: m.role === "ai" ? "ai" : "user", text: String(m.text) }))
    : [];

  const studentContext =
    typeof body.studentContext === "string" ? body.studentContext.trim().slice(0, 12000) : "";

  let conversationId = typeof body.conversationId === "string" ? body.conversationId : null;

  if (conversationId) {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id, conversation_key")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
  } else {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_id", user.id)
      .eq("conversation_key", key)
      .maybeSingle();

    if (existing?.id) {
      conversationId = existing.id;
    } else {
      const { data: created, error: insErr } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, subject_id: subjectId, level, topic_id: topicId, conversation_key: key })
        .select("id")
        .single();
      if (insErr || !created) {
        return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
      }
      conversationId = created.id;
    }
  }

  const { error: userMsgErr } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: text,
  });
  if (userMsgErr) {
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  let replyStream: AsyncIterable<string>;
  let usedFallback = false;
  try {
    const out = await streamTutorReply({
      subjectId,
      level,
      topicId,
      history,
      userMessage: text,
      studentContext: studentContext || undefined,
    });
    replyStream = out.stream;
    usedFallback = out.usedFallback;
  } catch (err) {
    console.error("[chat] streamTutorReply threw:", err);
    const { socraticReply } = await import("@/lib/constants");
    replyStream = singleChunk(socraticReply(subjectId, text));
    usedFallback = true;
  }

  if (!conversationId) {
    return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
  }
  const activeConversationId = conversationId;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let reply = "";
      try {
        for await (const chunk of replyStream) {
          reply += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        if (reply.trim()) {
          await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            role: "ai",
            content: reply,
          });
        }
      } catch {
        controller.enqueue(encoder.encode("\n\nSorry, something went wrong while writing that response. Try again."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Conversation-Id": activeConversationId,
      "X-Used-Fallback": String(usedFallback),
    },
  });
}
