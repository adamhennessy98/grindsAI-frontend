import Anthropic from "@anthropic-ai/sdk";
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
    topic.id === "general" ? "The current chat is for general subject help." : `The current chat topic is ${topic.name}. Keep explanations anchored to that topic unless the student asks to move elsewhere.`,
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
  const [formulaBookContext, pastPaperContext] = await Promise.all([
    getFormulaBookContext(input),
    getPastPaperContext(input),
  ]);
  console.log("[RAG]", pastPaperContext ? `${pastPaperContext.substring(0, 150)}...` : "EMPTY");
  const system = buildSystemPrompt(
    input.subjectId,
    input.level,
    input.topicId,
    formulaBookContext,
    pastPaperContext,
    input.studentContext,
  );

  const response = await client.messages.create({
    model,
    system,
    messages: anthropicMessages(input.history, input.userMessage),
    max_tokens: 1024,
    temperature: 0.6,
  });

  const block = response.content[0];
  const text = block?.type === "text" ? block.text.trim() : "";
  if (!text) {
    const { socraticReply } = await import("@/lib/constants");
    return { text: socraticReply(input.subjectId, input.userMessage), usedFallback: true };
  }

  return { text, usedFallback: false };
}

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
  const [formulaBookContext, pastPaperContext] = await Promise.all([
    getFormulaBookContext(input),
    getPastPaperContext(input),
  ]);
  console.log("[RAG]", pastPaperContext ? `${pastPaperContext.substring(0, 150)}...` : "EMPTY");
  const system = buildSystemPrompt(
    input.subjectId,
    input.level,
    input.topicId,
    formulaBookContext,
    pastPaperContext,
    input.studentContext,
  );

  const anthropicStream = client.messages.stream({
    model,
    system,
    messages: anthropicMessages(input.history, input.userMessage),
    max_tokens: 1024,
    temperature: 0.6,
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
