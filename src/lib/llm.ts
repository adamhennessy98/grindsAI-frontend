import Anthropic from "@anthropic-ai/sdk";
import type { AgentRuntimeContext } from "@/lib/agents/load-context";
import { composeSystemPrompt } from "@/lib/agents/compose-prompt";
import { getAgent } from "@/lib/agents/registry";
import { getTopic, SUBJECTS } from "@/lib/constants";
import { getFormulaBookContext } from "@/lib/formula-book";
import { getPastPaperContext } from "@/lib/retrieve";
import type { Message } from "@/lib/types";

function subjectLabel(subjectId: string): string {
  return SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
}

async function* singleChunk(text: string) {
  yield text;
}

/** @deprecated Prefer composeSystemPrompt via the agent registry. Kept for older call sites. */
export function buildSystemPrompt(
  subjectId: string,
  level: string,
  topicId = "general",
  formulaBookContext = "",
  pastPaperContext = "",
  studentContext = "",
): string {
  const name = subjectLabel(subjectId);
  const topic = getTopic(subjectId, topicId);
  const lvl = level === "HL" ? "Leaving Certificate Higher Level" : "Leaving Certificate Ordinary Level";
  return [
    `You are GrindsAI, a ${lvl} tutor for ${name} (Irish Leaving Cert).`,
    studentContext,
    topic.id === "general"
      ? "The current chat is for general subject help."
      : `The current chat topic is ${topic.name}. Keep explanations anchored to that topic unless the student asks to move elsewhere.`,
    "Use the Socratic method: ask guiding questions, give hints, and help the student discover answers.",
    "Do not do the student's homework for them when they ask for direct answers; redirect to understanding.",
    "Keep replies concise but warm. Use markdown sparingly (bold for key terms).",
    "If the student is stuck, break the problem into smaller steps.",
    "When Formulae and Tables excerpts are present, prefer that notation and cite the printed page shown there before relying on memory or alternative notation.",
    "Write mathematical expressions using LaTeX. Use inline maths with $...$ and display maths with $$...$$ where appropriate. Do not overuse display maths for small expressions.",
    pastPaperContext,
    formulaBookContext,
  ]
    .filter(Boolean)
    .join(" ");
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

export async function generateTutorReply(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  history: Pick<Message, "role" | "text">[];
  userMessage: string;
  studentContext?: string;
}): Promise<{ text: string; usedFallback: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const { socraticReply } = await import("@/lib/constants");
    return { text: socraticReply(input.subjectId, input.userMessage), usedFallback: true };
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const agent = getAgent("subject-tutor");
  const [formulaBookContext, pastPaperContext] = await Promise.all([
    getFormulaBookContext(input),
    getPastPaperContext(input),
  ]);
  const system = composeSystemPrompt({
    agent,
    subjectId: input.subjectId,
    level: input.level,
    topicId: input.topicId,
    rag: {
      formulaBook: formulaBookContext || undefined,
      pastPapers: pastPaperContext || undefined,
    },
    extras: input.studentContext ? [input.studentContext] : undefined,
  });

  const response = await client.messages.create({
    model,
    system,
    messages: anthropicMessages(input.history, input.userMessage),
    max_tokens: agent.maxTokens,
    temperature: agent.temperature,
  });

  const block = response.content[0];
  const text = block?.type === "text" ? block.text.trim() : "";
  if (!text) {
    const { socraticReply } = await import("@/lib/constants");
    return { text: socraticReply(input.subjectId, input.userMessage), usedFallback: true };
  }

  return { text, usedFallback: false };
}

/** @deprecated Prefer streamAgentReply with loadAgentContext. */
export async function streamTutorReply(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  history: Pick<Message, "role" | "text">[];
  userMessage: string;
  studentContext?: string;
}): Promise<{ stream: AsyncIterable<string>; usedFallback: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const { socraticReply } = await import("@/lib/constants");
    return { stream: singleChunk(socraticReply(input.subjectId, input.userMessage)), usedFallback: true };
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const agent = getAgent("subject-tutor");
  const [formulaBookContext, pastPaperContext] = await Promise.all([
    getFormulaBookContext(input),
    getPastPaperContext(input),
  ]);
  const system = composeSystemPrompt({
    agent,
    subjectId: input.subjectId,
    level: input.level,
    topicId: input.topicId,
    rag: {
      formulaBook: formulaBookContext || undefined,
      pastPapers: pastPaperContext || undefined,
    },
    extras: input.studentContext ? [input.studentContext] : undefined,
  });

  const anthropicStream = client.messages.stream({
    model,
    system,
    messages: anthropicMessages(input.history, input.userMessage),
    max_tokens: agent.maxTokens,
    temperature: agent.temperature,
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
