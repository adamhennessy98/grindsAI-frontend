import OpenAI from "openai";
import { SUBJECTS } from "@/lib/constants";
import type { Message } from "@/lib/types";

function subjectLabel(subjectId: string): string {
  return SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
}

export function buildSystemPrompt(subjectId: string, level: string): string {
  const name = subjectLabel(subjectId);
  const lvl = level === "HL" ? "Leaving Certificate Higher Level" : "Leaving Certificate Ordinary Level";
  return [
    `You are GrindsAI, a ${lvl} tutor for ${name} (Irish Leaving Cert).`,
    "Use the Socratic method: ask guiding questions, give hints, and help the student discover answers.",
    "Do not do the student's homework for them when they ask for direct answers; redirect to understanding.",
    "Keep replies concise but warm. Use markdown sparingly (bold for key terms).",
    "If the student is stuck, break the problem into smaller steps.",
  ].join(" ");
}

export async function generateTutorReply(input: {
  subjectId: string;
  level: string;
  history: Pick<Message, "role" | "text">[];
  userMessage: string;
}): Promise<{ text: string; usedFallback: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const { socraticReply } = await import("@/lib/constants");
    return { text: socraticReply(input.subjectId, input.userMessage), usedFallback: true };
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const system = buildSystemPrompt(input.subjectId, input.level);
  const messages = [
    { role: "system" as const, content: system },
    ...input.history.map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    })),
    { role: "user" as const, content: input.userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.6,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) {
    const { socraticReply } = await import("@/lib/constants");
    return { text: socraticReply(input.subjectId, input.userMessage), usedFallback: true };
  }

  return { text, usedFallback: false };
}
