import { describe, expect, it } from "vitest";
import { recommendationDestination } from "./study-navigation";
import type { NextStep } from "./learning/next-step";

const step: NextStep = { subjectId: "maths", topicId: "calculus", title: "Continue", reason: "Recent work", cta: "Continue", action: "tutor", feature: "tutor", lastSummary: "Practising derivatives", source: "last_session", examInDays: null, examBadge: null };
describe("recommendation destinations", () => {
  it.each([["tutor", "conversation"], ["questions", "generator"], ["topic-check", "topic-check"], ["progress", "progress"]] as const)("opens %s in the correct tool with subject and topic", (action, screen) => {
    expect(recommendationDestination({ ...step, action })).toEqual({ screen, subjectId: "maths", topicId: "calculus", summary: "Practising derivatives" });
  });
  it("does not send General to a topic-specific check", () => {
    expect(recommendationDestination({ ...step, action: "topic-check", topicId: "general" }).topicId).toBe("algebra");
  });
  it("validates stale topic IDs against the real subject mapping", () => {
    expect(recommendationDestination({ ...step, topicId: "no-longer-a-topic" }).topicId).toBe("general");
  });
});
