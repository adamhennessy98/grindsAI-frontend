import Anthropic from "@anthropic-ai/sdk";
import type { AgentRuntimeContext } from "@/lib/agents/load-context";
import type { Message } from "@/lib/types";

async function* singleChunk(text: string) {
  yield text;
}

function anthropicMessages(history: Pick<Message, "role" | "text">[], userMessage: string): Anthropic.MessageParam[] {
  return [
    ...history.map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    })),
    { role: "user" as const, content: userMessage },
  ];
}

/** Stream a tutor reply from a pre-built agent context (RAG/prompt loaded elsewhere). */
export async function streamAgentReply(
  ctx: AgentRuntimeContext,
): Promise<{ stream: AsyncIterable<string>; usedFallback: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const fallbackSubject = ctx.subjectId ?? "maths";

  if (!apiKey) {
    const { socraticReply } = await import("@/lib/constants");
    return { stream: singleChunk(socraticReply(fallbackSubject, ctx.userMessage)), usedFallback: true };
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

  const anthropicStream = client.messages.stream({
    model,
    system: ctx.systemPrompt,
    messages: anthropicMessages(ctx.history, ctx.userMessage),
    max_tokens: ctx.agent.maxTokens,
    temperature: ctx.agent.temperature,
  });

  async function* chunks() {
    for await (const event of anthropicStream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  }

  return { stream: chunks(), usedFallback: false };
}
