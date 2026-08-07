import { getTopic, SUBJECTS } from "@/lib/constants";
import { buildStudentContextPrompt } from "@/lib/profile";
import type { StudentProfile } from "@/lib/onboarding";
import type { AgentDefinition, AgentMode } from "@/lib/agents/registry";

export type RagContext = {
  formulaBook?: string;
  pastPapers?: string;
};

export type ComposePromptInput = {
  agent: AgentDefinition;
  profile?: StudentProfile | null;
  subjectId?: string;
  level?: string;
  topicId?: string;
  mode?: AgentMode;
  rag?: RagContext;
  memoryContext?: string;
  /** Extra agent-specific instructions (e.g. exam generator question count/type). */
  extras?: string[];
};

function subjectLabel(subjectId: string): string {
  return SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
}

function levelLabel(level: string): string {
  return level === "OL" ? "Leaving Certificate Ordinary Level" : "Leaving Certificate Higher Level";
}

function subjectTopicBlock(subjectId?: string, level?: string, topicId?: string): string {
  if (!subjectId) return "";

  const name = subjectLabel(subjectId);
  const lvl = level ? levelLabel(level) : "Leaving Certificate";
  const topic = getTopic(subjectId, topicId ?? "general");

  return [
    `Subject focus: ${name} (${lvl}).`,
    topic.id === "general"
      ? "The current chat is for general subject help."
      : `The current chat topic is ${topic.name}. Keep explanations anchored to that topic unless the student asks to move elsewhere.`,
  ].join(" ");
}

/** Layer agent base + mode + student profile + subject/topic + RAG into one system prompt. */
export function composeSystemPrompt(input: ComposePromptInput): string {
  const mode = input.mode && input.mode !== "normal" ? input.agent.modes?.[input.mode] : undefined;
  const studentContext = input.profile ? buildStudentContextPrompt(input.profile) : "";

  return [
    input.agent.basePrompt,
    mode,
    studentContext,
    input.memoryContext,
    subjectTopicBlock(input.subjectId, input.level, input.topicId),
    ...(input.extras ?? []),
    input.rag?.pastPapers,
    input.rag?.formulaBook,
  ]
    .filter(Boolean)
    .join(" ");
}
