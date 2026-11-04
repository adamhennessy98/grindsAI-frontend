import path from "node:path";
import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { getPastPaperArchiveAsset, getPastPaperArchiveByTopic, getPastPaperArchiveDetail, isArchiveInstructionOnly } from "./past-paper-archive";

const fs = vi.hoisted(() => ({ readdir: vi.fn(), readFile: vi.fn() }));
vi.mock("node:fs/promises", () => fs);
const source = "biology_higher_2025_paper_1";
const classified = path.join("higher", "topic_specific", `${source}_q001_plant_biology.md`);
const duplicate = path.join("higher", "unclassified", `${source}_q001_unclassified.md`);
const instruction = path.join("higher", "topic_specific", `${source}_q002_plant_biology.md`);
const scan = path.join("higher", "topic_specific", `${source}_q003_plant_biology.md`);
const image = "../../../image_assets/exam_papers/higher/page003.png";
function markdown(number: number, question: string, assets = "") {
  return `---\nyear: 2025\nquestion_number: ${number}\ntopic: "Plant Biology"\n${assets}---\n# Question\n${question}\n# Marking Scheme\nX is the xylem.\n# Source References\nsource.pdf`;
}
beforeAll(() => {
  const fixtures = new Map([
    [classified, markdown(1, "Name the tissue that transports water in a plant.")],
    [duplicate, markdown(1, "Name the tissue that transports water in a plant.")],
    [instruction, markdown(2, "Section B, leaving 120 minutes for Section C.")],
    [scan, markdown(3, "Name structure X in the diagram.", `visual_assets:\n  - "${image}"\n`)],
  ]);
  fs.readdir.mockResolvedValue([...fixtures.keys()].map(name => ({ name, isDirectory: () => false, isFile: () => true })));
  fs.readFile.mockImplementation(async (file: string) => {
    const key = [...fixtures.keys()].find(item => file.endsWith(item));
    return key ? fixtures.get(key) : Buffer.from("image fixture");
  });
});
afterEach(() => vi.unstubAllEnvs());

describe("archive release content", () => {
  it("filters section instructions but preserves short genuine questions and image-only Markdown", () => {
    expect(isArchiveInstructionOnly("Section B, leaving 120 minutes for Section C.")).toBe(true);
    expect(isArchiveInstructionOnly("Answer all questions.")).toBe(true);
    expect(isArchiveInstructionOnly("Solve x + 1 = 2.")).toBe(false);
    expect(isArchiveInstructionOnly("![Question](page.png)")).toBe(false);
  });
  it("lists one copy of each question and excludes the instruction fragment", async () => {
    const years = await getPastPaperArchiveByTopic({ subjectId: "biology", level: "HL", topicId: "general" });
    expect(years[0].questions.map(q => q.questionNumber)).toEqual([1, 3]);
    expect(years[0].questions[0].topicId).toBe("plant-biology");
  });
  it("displays frontmatter-only scans and resolves the same indexed asset", async () => {
    vi.stubEnv("PAST_PAPER_ASSET_BASE_URL", "");
    const id = Buffer.from(scan).toString("base64url");
    const question = await getPastPaperArchiveDetail({ subjectId: "biology", id });
    expect(question?.questionText).toContain("&asset=0)");
    const asset = await getPastPaperArchiveAsset({ subjectId: "biology", id, assetIndex: 0 });
    expect(asset).toMatchObject({ contentType: "image/png" });
    expect(fs.readFile).toHaveBeenLastCalledWith(expect.stringContaining(path.join("image_assets", "exam_papers", "higher", "page003.png")));
  });
  it("can serve uploaded production scans without reading local image files", async () => {
    vi.stubEnv("PAST_PAPER_ASSET_BASE_URL", "https://storage.example/exam-archive");
    const asset = await getPastPaperArchiveAsset({ subjectId: "biology", id: Buffer.from(scan).toString("base64url"), assetIndex: 0 });
    expect(asset).toEqual({ url: "https://storage.example/exam-archive/biology/exam_papers/higher/page003.png" });
  });
  it("returns no asset for an invalid question ID", async () => {
    expect(await getPastPaperArchiveAsset({ subjectId: "biology", id: "invalid", assetIndex: 0 })).toBeNull();
  });
});
