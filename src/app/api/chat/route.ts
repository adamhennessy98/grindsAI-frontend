import { NextResponse } from "next/server";
import { conversationKey, getTopic, getSubjectTopics, SUBJECTS } from "@/lib/constants";
import { loadAgentContext } from "@/lib/agents/load-context";
import { isAgentId, isAgentMode } from "@/lib/agents/registry";
import { composeStudentContext } from "@/lib/learning/compose-student-context";
import { getLearningProfile } from "@/lib/learning/profile";
import { streamAgentReply } from "@/lib/llm";
import { buildChatMemorySummary, saveMemory } from "@/lib/memory";
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
  agentId?: string | null;
  mode?: string | null;
  /** Papers → tutor handoff only (question text). Profile/tone/mastery loaded server-side. */
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

  const mode = isAgentMode(body.mode) ? body.mode : "normal";
  const agentId = isAgentId(body.agentId) ? body.agentId : undefined;
  const handoffContext =
    typeof body.studentContext === "string" ? body.studentContext.trim().slice(0, 12000) : "";

  let composedContext = handoffContext;
  try {
    const learning = await getLearningProfile(supabase, user.id);
    composedContext = composeStudentContext({
      profile: learning.prefs,
      tone: learning.tone
        ? {
            anxietyFlag: learning.tone.anxietyFlag,
            notes: learning.tone.notes,
            learnerStyle: learning.tone.learnerStyle,
          }
        : null,
      strugglingKcs: learning.strugglingKcs,
      handoffContext,
    });
  } catch (err) {
    console.warn("[chat] learning profile compose failed, using handoff only:", err);
  }

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
  let resolvedAgentId = agentId ?? "subject-tutor";
  try {
    const ctx = await loadAgentContext({
      supabase,
      userId: user.id,
      userMessage: text,
      history,
      agentId: agentId ?? "subject-tutor",
      mode,
      subjectId,
      level,
      topicId,
      extras: composedContext ? [composedContext] : undefined,
    });
    resolvedAgentId = ctx.agentId;
    const out = await streamAgentReply(ctx);
    replyStream = out.stream;
    usedFallback = out.usedFallback;
  } catch (err) {
    console.error("[chat] streamAgentReply threw:", err);
    const { socraticReply } = await import("@/lib/constants");
    replyStream = singleChunk(socraticReply(subjectId, text));
    usedFallback = true;
  }

  if (!conversationId) {
    return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
  }
  const activeConversationId = conversationId;
  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name;
  const topicName = getTopic(subjectId, topicId).name;
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

          const memory = await saveMemory(supabase, user.id, {
            subjectId,
            topicId,
            level,
            source: "chat",
            summary: buildChatMemorySummary({
              subjectId,
              topicId,
              mode,
              userMessage: text,
              subjectName,
              topicName,
            }),
            metadata: {
              conversationId: activeConversationId,
              agentId: resolvedAgentId,
              mode,
              usedFallback,
            },
          });
          if (!memory.ok) {
            console.warn("[chat] could not save student memory:", memory.message);
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\nSorry, something went wrong while writing that response. Try again."),
        );
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
      "X-Agent-Id": resolvedAgentId,
      "X-Used-Fallback": String(usedFallback),
    },
  });
}
