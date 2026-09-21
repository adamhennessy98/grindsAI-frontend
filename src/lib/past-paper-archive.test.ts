import { describe, expect, it } from "vitest";
import { getPastPaperArchiveAsset, getPastPaperArchiveByTopic, getPastPaperArchiveDetail } from "./past-paper-archive";

describe("past-paper archive", () => {
  it("indexes Biology questions without loading every full question into the listing", async () => {
    const years = await getPastPaperArchiveByTopic({ subjectId: "biology", level: "HL", topicId: "general" });

    expect(years.length).toBeGreaterThan(0);
    expect(years.flatMap((year) => year.questions).length).toBeGreaterThan(100);
  }, 30_000);

  it("returns a Maths scanned asset for a visual question", async () => {
    const years = await getPastPaperArchiveByTopic({ subjectId: "maths", level: "HL", topicId: "general" });
    const visualQuestion = years.flatMap((year) => year.questions).find((question) => question.hasVisual);

    expect(visualQuestion).toBeDefined();
    const detail = await getPastPaperArchiveDetail({ subjectId: "maths", id: visualQuestion!.id });
    expect(detail?.questionText).toContain("/api/past-paper-archive?");

    const asset = await getPastPaperArchiveAsset({ subjectId: "maths", id: visualQuestion!.id, assetIndex: 0 });
    expect(asset).toBeDefined();
    expect(asset && "bytes" in asset ? asset.bytes.byteLength : 0).toBeGreaterThan(0);
    expect(asset && "contentType" in asset ? asset.contentType : "").toBe("image/png");
  }, 30_000);
});
