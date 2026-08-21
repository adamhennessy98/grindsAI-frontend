import type { SupabaseClient } from "@supabase/supabase-js";
import { getSubjectTopics, SUBJECTS } from "@/lib/constants";
import { getFormulaBookContext } from "@/lib/formula-book";
import { getPastPaperContext } from "@/lib/retrieve";
import { getStudentProfile } from "@/lib/profile";
import { formatMemoriesForPrompt, loadRecentMemories } from "@/lib/memory";
import type { StudentProfile } from "@/lib/onboarding";
import type { Message } from "@/lib/types";
import {
  getAgent,
  isAgentId,
  isAgentMode,
  type AgentDefinition,
  type AgentId,
  type AgentMode,
} from "@/lib/agents/registry";
import { composeSystemPrompt, type RagContext } from "@/lib/agents/compose-prompt";

export type LoadAgentContextInput = {
  supabase: SupabaseClient;
  userId: string;
  userMessage: string;
  history?: Pick<Message, "role" | "text">[];
  agentId?: AgentId | string | null;
  mode?: AgentMode | string | null;
  subjectId?: string | null;
  level?: string | null;
  topicId?: string | null;
  /**
   * Extra prompt fragments (e.g. question handoff context).
   * Accept a Promise so callers can start RAG/memories without waiting for the brief.
   */
  extras?: string[] | Promise<string[] | undefined>;
  /**
   * When provided (including a Promise), skip a second profiles read.
   * Omit to load via getStudentProfile.
   */
  profile?: StudentProfile | null | Promise<StudentProfile | null>;
};

export type AgentRuntimeContext = {
  agent: AgentDefinition;
  agentId: AgentId;
  userId: string;
  profile: StudentProfile | null;
  subjectId?: string;
  level?: string;
  topicId?: string;
  mode: AgentMode;
  history: Pick<Message, "role" | "text">[];
  userMessage: string;
  rag: RagContext;
  memoryContext: string;
  systemPrompt: string;
};

function isEnabledSubject(subjectId: string) {
  return SUBJECTS.some((subject) => subject.id === subjectId && subject.enabled);
}

function resolveTopicId(subjectId: string, topicId: unknown) {
  const requested = typeof topicId === "string" && topicId.trim() ? topicId.trim() : "general";
  return getSubjectTopics(subjectId).some((topic) => topic.id === requested) ? requested : "general";
}

/** Pick an agent from explicit id or current screen context. */
export function resolveAgentId(input: {
  explicitAgentId?: AgentId | string | null;
  subjectId?: string | null;
}): AgentId {
  if (isAgentId(input.explicitAgentId)) return input.explicitAgentId;
  if (input.subjectId && isEnabledSubject(input.subjectId)) return "subject-tutor";
  return "general-coach";
}

async function loadRagContext(input: {
  agent: AgentDefinition;
  subjectId?: string;
  level?: string;
  topicId?: string;
  userMessage: string;
}): Promise<RagContext> {
  const rag: RagContext = {};
  const { agent, subjectId, level, topicId, userMessage } = input;
  if (!subjectId || (!agent.rag.formulaBook && !agent.rag.pastPapers)) return rag;

  const [formulaBook, pastPapers] = await Promise.all([
    agent.rag.formulaBook
      ? getFormulaBookContext({
          subjectId,
          level,
          topicId,
          userMessage,
        })
      : Promise.resolve(""),
    agent.rag.pastPapers
      ? getPastPaperContext({
          subjectId,
          level: level ?? "HL",
          topicId,
          userMessage,
        })
      : Promise.resolve(""),
  ]);
  if (formulaBook) rag.formulaBook = formulaBook;
  if (pastPapers) rag.pastPapers = pastPapers;
  console.log("[RAG]", pastPapers ? `${pastPapers.substring(0, 150)}...` : "EMPTY");
  return rag;
}

export async function loadAgentContext(input: LoadAgentContextInput): Promise<AgentRuntimeContext> {
  const agentId = resolveAgentId({
    explicitAgentId: input.agentId,
    subjectId: input.subjectId,
  });
  const agent = getAgent(agentId);
  const mode: AgentMode = isAgentMode(input.mode) ? input.mode : "normal";

  const subjectId =
    typeof input.subjectId === "string" && isEnabledSubject(input.subjectId) ? input.subjectId : undefined;
  const level = input.level === "OL" ? "OL" : subjectId ? "HL" : undefined;
  const topicId = subjectId ? resolveTopicId(subjectId, input.topicId) : undefined;

  const profileP =
    input.profile !== undefined ? Promise.resolve(input.profile) : getStudentProfile(input.supabase, input.userId);
  const memoriesP = loadRecentMemories(input.supabase, input.userId, {
    subjectId,
    limit: 8,
  });
  const ragP = loadRagContext({
    agent,
    subjectId,
    level,
    topicId,
    userMessage: input.userMessage,
  });
  const extrasP = Promise.resolve(input.extras);

  const [profile, memories, rag, extras] = await Promise.all([profileP, memoriesP, ragP, extrasP]);
  const memoryContext = formatMemoriesForPrompt(memories);

  const systemPrompt = composeSystemPrompt({
    agent,
    profile,
    subjectId,
    level,
    topicId,
    mode,
    rag,
    memoryContext,
    extras,
  });

  return {
    agent,
    agentId,
    userId: input.userId,
    profile,
    subjectId,
    level,
    topicId,
    mode,
    history: input.history ?? [],
    userMessage: input.userMessage,
    rag,
    memoryContext,
    systemPrompt,
  };
}
