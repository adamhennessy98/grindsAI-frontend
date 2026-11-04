import { SUBJECTS, getSubjectTopics } from "./constants";
import type { Screen } from "@/components/app/types";

export type StudyLocation = { screen: Screen; subjectId: string; topicId: string };
export function readStudyLocation(hash: string): StudyLocation {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const subjectId = params.get("subject") ?? "";
  if (!SUBJECTS.some((subject) => subject.id === subjectId)) return { screen: "home", subjectId: "", topicId: "general" };
  const tool = params.get("tool");
  const screen = (["conversation", "generator", "progress", "topic-check"] as const).find((item) => item === tool) ?? "workspace";
  const requestedTopic = params.get("topic");
  const topicId = getSubjectTopics(subjectId).find((topic) => topic.id === requestedTopic)?.id ?? "general";
  return { screen, subjectId, topicId };
}
export function studyLocationUrl(location: StudyLocation) {
  if (location.screen === "home" || !location.subjectId) return "/chat";
  const params = new URLSearchParams({ subject: location.subjectId });
  if (location.screen !== "workspace") params.set("tool", location.screen);
  if (location.screen !== "workspace" && location.topicId !== "general") params.set("topic", location.topicId);
  return `/chat#${params}`;
}
