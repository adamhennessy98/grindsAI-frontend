import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
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

type SaveMessageResult =
  | { ok: true; conversationId: string }
  | { ok: false; status: number; error: string };

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

async function saveUserMessage(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string | null;
  subjectId: string;
  level: string;
  topicId: string;
  key: string;
  text: string;
}): Promise<SaveMessageResult> {
  let conversationId = input.conversationId;

  if (conversationId) {
    const { data: conv, error: convErr } = await input.supabase
      .from("conversations")
      .select("id, conversation_key")
      .eq("id", conversationId)
      .eq("user_id", input.userId)
      .maybeSingle();
    if (convErr || !conv) {
      return { ok: false, status: 404, error: "Conversation not found." };
    }
  } else {
    const { data: existing } = await input.supabase
      .from("conversations")
      .select("id")
      .eq("user_id", input.userId)
      .eq("conversation_key", input.key)
      .maybeSingle();

    if (existing?.id) {
      conversationId = existing.id;
    } else {
      const { data: created, error: insErr } = await input.supabase
        .from("conversations")
        .insert({
          user_id: input.userId,
          subject_id: input.subjectId,
          level: input.level,
          topic_id: input.topicId,
          conversation_key: input.key,
        })
        .select("id")
        .single();
      if (insErr || !created) {
        return { ok: false, status: 500, error: "Could not start conversation." };
      }
      conversationId = created.id;
    }
  }

  const { error: userMsgErr } = await input.supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: input.text,
  });
  if (userMsgErr) {
    return { ok: false, status: 500, error: "Could not save your message." };
  }

  return { ok: true, conversationId };
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

  const bodyP = request
    .json()
    .then((value) => ({ ok: true as const, body: value as ChatBody }))
    .catch(() => ({ ok: false as const }));
  const [gate, parsed] = await Promise.all([assertChatAllowed(supabase, user.id, user.email), bodyP]);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = parsed.body;
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

  const briefP = getLearningProfile(supabase, user.id)
    .then((learning) => ({
      profile: learning.prefs,
      composed: composeStudentContext({
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
      }),
    }))
    .catch((err) => {
      console.warn("[chat] learning profile compose failed, using handoff only:", err);
      return { profile: null, composed: handoffContext };
    });

  const savedP = saveUserMessage({
    supabase,
    userId: user.id,
    conversationId: typeof body.conversationId === "string" ? body.conversationId : null,
    subjectId,
    level,
    topicId,
    key,
    text,
  });

  const ctxP = loadAgentContext({
    supabase,
    userId: user.id,
    userMessage: text,
    history,
    agentId: agentId ?? "subject-tutor",
    mode,
    subjectId,
    level,
    topicId,
    profile: briefP.then((brief) => brief.profile),
    extras: briefP.then((brief) => (brief.composed ? [brief.composed] : undefined)),
  });

  const saved = await savedP;
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: saved.status });
  }

  let replyStream: AsyncIterable<string>;
  let usedFallback = false;
  let resolvedAgentId = agentId ?? "subject-tutor";
  try {
    const ctx = await ctxP;
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

  const activeConversationId = saved.conversationId;
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
