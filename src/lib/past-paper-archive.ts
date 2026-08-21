import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getSubjectTopics, SUBJECTS } from "@/lib/constants";

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

export type PastPaperArchiveQuestion = Pick<RecordItem, "id" | "year" | "questionNumber" | "topic" | "hasVisual"> & { topicId: string };
export type PastPaperArchiveYear = { year: number; questions: PastPaperArchiveQuestion[] };
export type PastPaperArchiveDetail = PastPaperArchiveQuestion & {
  questionText: string;
  markingSchemeText: string;
  tutorQuestionText: string;
  tutorMarkingSchemeText: string;
};

const ARCHIVE_SUBJECT_IDS = new Set(SUBJECTS.map((subject) => subject.id));
const archiveCache = new Map<string, Promise<RecordItem[]>>();

function archiveRoot(subjectId: string) {
  if (!ARCHIVE_SUBJECT_IDS.has(subjectId)) return null;
  return path.join(process.cwd(), "docs", "processed", `${subjectId}-rag-preprocessing`, "output_question_chunks");
}

function assetsRoot(subjectId: string) {
  if (!ARCHIVE_SUBJECT_IDS.has(subjectId)) return null;
  return path.join(process.cwd(), "docs", "processed", `${subjectId}-rag-preprocessing`, "image_assets");
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeLevel(level: string) {
  return level === "OL" || level.toLowerCase().includes("ordinary") ? "ordinary" : "higher";
}

function encodeId(root: string, filePath: string) {
  return Buffer.from(path.relative(root, filePath)).toString("base64url");
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

function cleanMarkdown(value: string, subjectId: string, questionId: string, assetCursor: { value: number }) {
  const images = imageReferences(value);
  if (images.length > 0) {
    const firstImageIndex = assetCursor.value;
    assetCursor.value += images.length;
    return images.map((_image, offset) => `![Scanned exam page](/api/past-paper-archive?subjectId=${encodeURIComponent(subjectId)}&questionId=${encodeURIComponent(questionId)}&asset=${firstImageIndex + offset})`).join("\n\n");
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

async function loadArchive(subjectId: string) {
  const root = archiveRoot(subjectId);
  if (!root) return [];
  const files = await listMarkdownFiles(root);
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
    const id = encodeId(root, filePath);
    const cursor = { value: 0 };
    const body = match[2];
    const visualAssets = imageReferences(body);
    if (visualAssets.length === 0) visualAssets.push(...list(frontmatter, "visual_assets"));
    return {
      id, filePath, ...location, year, questionNumber, topic,
      secondaryTopics: list(frontmatter, "secondary_topics"), visualAssets,
      hasVisual: visualAssets.length > 0,
      questionText: cleanMarkdown(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References"), subjectId, id, cursor),
      markingSchemeText: cleanMarkdown(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References"), subjectId, id, cursor),
      tutorQuestionText: tutorText(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References")),
      tutorMarkingSchemeText: tutorText(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References")),
    } satisfies RecordItem;
  }));
  return records.filter((record): record is RecordItem => Boolean(record));
}

function getArchive(subjectId: string) {
  if (!archiveCache.has(subjectId)) archiveCache.set(subjectId, loadArchive(subjectId));
  return archiveCache.get(subjectId)!;
}

function matchesTopic(subjectId: string, record: RecordItem, topicId: string) {
  if (topicId === "general") return true;
  if (record.collection === "mixed") return false;
  const topicName = getSubjectTopics(subjectId).find((topic) => topic.id === topicId)?.name;
  if (!topicName) return false;
  const target = normalizeLabel(topicName);
  return normalizeLabel(record.topic) === target || record.secondaryTopics.some((topic) => normalizeLabel(topic) === target);
}

function summary(subjectId: string, record: RecordItem): PastPaperArchiveQuestion {
  if (record.collection === "mixed" || record.collection === "unclassified") {
    return { id: record.id, year: record.year, questionNumber: record.questionNumber, topic: "Mixed", topicId: "general", hasVisual: record.hasVisual };
  }
  const mappedTopic = getSubjectTopics(subjectId).find((topic) => normalizeLabel(topic.name) === normalizeLabel(record.topic));
  return {
    id: record.id,
    year: record.year,
    questionNumber: record.questionNumber,
    topic: mappedTopic?.name ?? record.topic,
    topicId: mappedTopic?.id ?? "general",
    hasVisual: record.hasVisual,
  };
}

export function isPastPaperArchiveSubject(subjectId: string) {
  return ARCHIVE_SUBJECT_IDS.has(subjectId);
}

export async function getPastPaperArchiveByTopic(input: { subjectId: string; level: string; topicId: string }) {
  const byYear = new Map<number, PastPaperArchiveQuestion[]>();
  for (const record of await getArchive(input.subjectId)) {
    if (record.level !== normalizeLevel(input.level) || !matchesTopic(input.subjectId, record, input.topicId)) continue;
    const questions = byYear.get(record.year) ?? [];
    questions.push(summary(input.subjectId, record));
    byYear.set(record.year, questions);
  }
  return Array.from(byYear, ([year, questions]) => ({ year, questions: questions.sort((a, b) => a.questionNumber - b.questionNumber) })).sort((a, b) => b.year - a.year) satisfies PastPaperArchiveYear[];
}

export async function getPastPaperArchiveDetail(input: { subjectId: string; id: string }): Promise<PastPaperArchiveDetail | null> {
  const record = (await getArchive(input.subjectId)).find((item) => item.id === input.id);
  return record ? {
    ...summary(input.subjectId, record),
    questionText: record.questionText,
    markingSchemeText: record.markingSchemeText,
    tutorQuestionText: record.tutorQuestionText,
    tutorMarkingSchemeText: record.tutorMarkingSchemeText,
  } : null;
}

export async function getPastPaperArchiveAsset(input: { subjectId: string; id: string; assetIndex: number }) {
  const root = assetsRoot(input.subjectId);
  const record = (await getArchive(input.subjectId)).find((item) => item.id === input.id);
  const reference = record?.visualAssets[input.assetIndex];
  if (!root || !record || !reference) return null;
  const filePath = path.resolve(path.dirname(record.filePath), reference);
  if (!filePath.startsWith(`${root}${path.sep}`)) return null;
  const extension = path.extname(filePath).toLowerCase();
  const contentType = extension === ".png" ? "image/png" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/webp";
  return { bytes: await readFile(filePath), contentType };
}
