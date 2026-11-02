import { describe, expect, it } from "vitest";
import { readStudyLocation, studyLocationUrl } from "./study-location";

describe("study navigation locations", () => {
  it("opens the subjects home for invalid subjects", () => {
    expect(readStudyLocation("#subject=unknown&tool=conversation")).toEqual({ screen: "home", subjectId: "", topicId: "general" });
  });
  it.each(["workspace", "conversation", "generator", "progress", "topic-check"] as const)("restores %s with a valid subject", (screen) => {
    const location = { screen, subjectId: "maths", topicId: "calculus" };
    const restored = readStudyLocation(studyLocationUrl(location).split("#")[1] ?? "");
    expect(restored).toEqual({ ...location, topicId: screen === "workspace" ? "general" : "calculus" });
  });
  it("falls back safely for stale topics and tools", () => {
    expect(readStudyLocation("#subject=maths&tool=removed&topic=removed")).toEqual({ screen: "workspace", subjectId: "maths", topicId: "general" });
  });
  it("does not expose subject context on the home URL", () => {
    expect(studyLocationUrl({ screen: "home", subjectId: "maths", topicId: "calculus" })).toBe("/chat");
  });
});
