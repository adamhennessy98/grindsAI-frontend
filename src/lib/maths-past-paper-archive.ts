import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getSubjectTopics } from "@/lib/constants";

const ARCHIVE_ROOT = path.join(process.cwd(), "docs", "processed", "maths-rag-preprocessing", "output_question_chunks");
const ASSETS_ROOT = path.join(process.cwd(), "docs", "processed", "maths-rag-preprocessing", "image_assets");

type Collection = "mixed" | "topic_specific" | "unclassified";
type RecordItem = {
  id: string;
  filePath: string;
  level: "higher" | "ordinary";
  collection: Collection;
  year: number;
  questionNumber: number;
  topic: string;
  secondaryTopics: string[];
  visualAssets: string[];
  hasVisual: boolean;
  questionText: string;
  markingSchemeText: string;
  tutorQuestionText: string;
  tutorMarkingSchemeText: string;
};

export type MathsArchiveQuestion = Pick<RecordItem, "id" | "year" | "questionNumber" | "topic" | "hasVisual"> & { topicId: string };
export type MathsArchiveYear = { year: number; questions: MathsArchiveQuestion[] };
export type MathsArchiveDetail = MathsArchiveQuestion & {
  questionText: string;
  markingSchemeText: string;
  tutorQuestionText: string;
  tutorMarkingSchemeText: string;
};

let archiveCache: Promise<RecordItem[]> | undefined;

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeLevel(level: string) {
  return level === "OL" || level.toLowerCase().includes("ordinary") ? "ordinary" : "higher";
}

function encodeId(filePath: string) {
  return Buffer.from(path.relative(ARCHIVE_ROOT, filePath)).toString("base64url");
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  }))).flat();
}

function scalar(frontmatter: string, key: string) {
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
}

function list(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*\\r?\\n((?:\\s+-\\s+.+\\r?\\n?)*)`, "m"));
  return match?.[1] ? Array.from(match[1].matchAll(/^\s+-\s+(.+)$/gm), (item) => item[1].trim().replace(/^["']|["']$/g, "")) : [];
}

function sectionBefore(body: string, heading: "Marking Scheme" | "Source References") {
  const index = body.search(new RegExp(`^# ${heading}\\s*$`, "m"));
  return index < 0 ? body : body.slice(0, index);
}

function sectionAfter(body: string, heading: "Marking Scheme") {
  const index = body.search(new RegExp(`^# ${heading}\\s*$`, "m"));
  return index < 0 ? "" : body.slice(index);
}

function imageReferences(value: string) {
  return Array.from(value.matchAll(/!\[[^\]]*]\(([^)]+)\)/g), (match) => match[1].trim());
}

function cleanMarkdown(value: string, questionId: string, assetCursor: { value: number }) {
  const images = imageReferences(value);
  if (images.length > 0) {
    const firstImageIndex = assetCursor.value;
    assetCursor.value += images.length;
    // The scanned pages are more reliable than the OCR for formulae and diagrams.
    return images.map((_image, offset) => `![Scanned exam page](/api/maths-archive?questionId=${encodeURIComponent(questionId)}&asset=${firstImageIndex + offset})`).join("\n\n");
  }
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^# (Question|Marking Scheme|Page \d+)\s*$/gm, "")
    .replace(/^# Source References[\s\S]*$/m, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tutorText(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^# (Question|Marking Scheme|Page \d+)\s*$/gm, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/^# Source References[\s\S]*$/m, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 10000);
}

function locationFor(filePath: string): Pick<RecordItem, "level" | "collection"> | null {
  const parts = filePath.split(path.sep);
  const level = parts.includes("ordinary") ? "ordinary" : parts.includes("higher") ? "higher" : null;
  const collection = parts.includes("topic_specific") ? "topic_specific" : parts.includes("mixed") ? "mixed" : parts.includes("unclassified") ? "unclassified" : null;
  return level && collection ? { level, collection } : null;
}

async function loadArchive() {
  const files = await listMarkdownFiles(ARCHIVE_ROOT);
  const records = await Promise.all(files.map(async (filePath) => {
    const location = locationFor(filePath);
    if (!location) return null;
    const raw = await readFile(filePath, "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return null;
    const frontmatter = match[1];
    const year = Number(scalar(frontmatter, "year"));
    const questionNumber = Number(scalar(frontmatter, "question_number"));
    const topic = scalar(frontmatter, "topic");
    if (!Number.isFinite(year) || !Number.isFinite(questionNumber) || !topic) return null;
    const id = encodeId(filePath);
    const cursor = { value: 0 };
    const body = match[2];
    const visualAssets = imageReferences(body);
    if (visualAssets.length === 0) visualAssets.push(...list(frontmatter, "visual_assets"));
    return {
      id, filePath, ...location, year, questionNumber, topic,
      secondaryTopics: list(frontmatter, "secondary_topics"), visualAssets,
      hasVisual: visualAssets.length > 0,
      questionText: cleanMarkdown(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References"), id, cursor),
      markingSchemeText: cleanMarkdown(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References"), id, cursor),
      tutorQuestionText: tutorText(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References")),
      tutorMarkingSchemeText: tutorText(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References")),
    } satisfies RecordItem;
  }));
  return records.filter((record): record is RecordItem => Boolean(record));
}

function getArchive() {
  archiveCache ??= loadArchive();
  return archiveCache;
}

function matchesTopic(record: RecordItem, topicId: string) {
  if (topicId === "general") return true;
  if (record.collection === "mixed") return false;
  const topicName = getSubjectTopics("maths").find((topic) => topic.id === topicId)?.name;
  if (!topicName) return false;
  const target = normalizeLabel(topicName);
  return normalizeLabel(record.topic) === target || record.secondaryTopics.some((topic) => normalizeLabel(topic) === target);
}

function summary(record: RecordItem): MathsArchiveQuestion {
  if (record.collection === "mixed" || record.collection === "unclassified") {
    return { id: record.id, year: record.year, questionNumber: record.questionNumber, topic: "Mixed", topicId: "general", hasVisual: record.hasVisual };
  }
  const mappedTopic = getSubjectTopics("maths").find((topic) => normalizeLabel(topic.name) === normalizeLabel(record.topic));
  return {
    id: record.id,
    year: record.year,
    questionNumber: record.questionNumber,
    topic: mappedTopic?.name ?? record.topic,
    topicId: mappedTopic?.id ?? "general",
    hasVisual: record.hasVisual,
  };
}

export async function getMathsArchiveByTopic(input: { level: string; topicId: string }) {
  const byYear = new Map<number, MathsArchiveQuestion[]>();
  for (const record of await getArchive()) {
    if (record.level !== normalizeLevel(input.level) || !matchesTopic(record, input.topicId)) continue;
    const questions = byYear.get(record.year) ?? [];
    questions.push(summary(record));
    byYear.set(record.year, questions);
  }
  return Array.from(byYear, ([year, questions]) => ({ year, questions: questions.sort((a, b) => a.questionNumber - b.questionNumber) })).sort((a, b) => b.year - a.year) satisfies MathsArchiveYear[];
}

export async function getMathsArchiveDetail(id: string): Promise<MathsArchiveDetail | null> {
  const record = (await getArchive()).find((item) => item.id === id);
  return record ? {
    ...summary(record),
    questionText: record.questionText,
    markingSchemeText: record.markingSchemeText,
    tutorQuestionText: record.tutorQuestionText,
    tutorMarkingSchemeText: record.tutorMarkingSchemeText,
  } : null;
}

export async function getMathsArchiveAsset(id: string, assetIndex: number) {
  const record = (await getArchive()).find((item) => item.id === id);
  const reference = record?.visualAssets[assetIndex];
  if (!record || !reference) return null;
  const filePath = path.resolve(path.dirname(record.filePath), reference);
  if (!filePath.startsWith(`${ASSETS_ROOT}${path.sep}`)) return null;
  const extension = path.extname(filePath).toLowerCase();
  const contentType = extension === ".png" ? "image/png" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/webp";
  return { bytes: await readFile(filePath), contentType };
}
