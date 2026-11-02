import { getSubjectTopics } from "@/lib/constants";
import type { NextStep } from "@/lib/learning/next-step";

export function recommendationDestination(step: NextStep) {
  const topics = getSubjectTopics(step.subjectId);
  const topic = topics.find((item) => item.id === step.topicId) ?? topics[0];
  const topicId = step.action === "topic-check" && topic?.id === "general"
    ? topics.find((item) => item.id !== "general")?.id ?? ""
    : topic?.id ?? "general";
  const screen = step.action === "questions" ? "generator" : step.action === "tutor" ? "conversation" : step.action;
  return { screen, subjectId: step.subjectId, topicId, summary: step.lastSummary } as const;
}
