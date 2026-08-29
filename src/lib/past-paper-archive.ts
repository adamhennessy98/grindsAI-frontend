import { open, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getSubjectTopics } from "@/lib/constants";

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
};

type RecordDetail = RecordItem & {
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
export type PastPaperArchiveAsset =
  | { bytes: Buffer; contentType: string }
  | { remoteUrl: string };

const ARCHIVE_ROOTS = {
  accounting: "accounting-rag-preprocessing",
  "applied-maths": "applied-maths-rag-preprocessing",
  biology: "biology-rag-preprocessing",
  business: "business-rag-preprocessing",
  chemistry: "chemistry-rag-preprocessing",
  "computer-science": "computer-science-rag-preprocessing",
  economics: "economics-rag-preprocessing",
  english: "english-rag-preprocessing",
  french: "french-rag-preprocessing",
  geography: "geography-rag-preprocessing",
  german: "german-rag-preprocessing",
  history: "history-rag-preprocessing",
  irish: "irish-rag-preprocessing",
  maths: "maths-rag-preprocessing",
  physics: "physics-rag-preprocessing",
  spanish: "spanish-rag-preprocessing",
  technology: "technology-rag-preprocessing",
} as const;
const ARCHIVE_SUBJECT_IDS = new Set(Object.keys(ARCHIVE_ROOTS));
const archiveCache = new Map<string, Promise<RecordItem[]>>();
const FRONTMATTER_READ_SIZE = 32 * 1024;
const ARCHIVE_READ_CONCURRENCY = 24;
const DEFAULT_ARCHIVE_ASSET_BASE_URL = "https://raw.githubusercontent.com/adamhennessy98/grindsAI-frontend/main";

function archiveRoot(subjectId: string) {
  const root = ARCHIVE_ROOTS[subjectId as keyof typeof ARCHIVE_ROOTS];
  return root ? path.join(process.cwd(), "docs", "processed", root, "output_question_chunks") : null;
}

function assetsRoot(subjectId: string) {
  const root = ARCHIVE_ROOTS[subjectId as keyof typeof ARCHIVE_ROOTS];
  return root ? path.join(process.cwd(), "docs", "processed", root, "image_assets") : null;
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

function remoteAssetUrl(filePath: string) {
  const baseUrl = (process.env.PAST_PAPER_ASSET_BASE_URL || DEFAULT_ARCHIVE_ASSET_BASE_URL).replace(/\/$/, "");
  const relativePath = path.relative(process.cwd(), filePath).split(path.sep).map(encodeURIComponent).join("/");
  return `${baseUrl}/${relativePath}`;
}

async function mapWithConcurrency<T, R>(items: T[], mapper: (item: T) => Promise<R>, concurrency = ARCHIVE_READ_CONCURRENCY) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function readFrontmatter(filePath: string) {
  const handle = await open(filePath, "r");
  try {
    const buffer = Buffer.alloc(FRONTMATTER_READ_SIZE);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const opening = buffer.subarray(0, bytesRead).toString("utf8");
    const match = opening.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (match) return match[1];
  } finally {
    await handle.close();
  }

  // The processed question frontmatter is intentionally small. This fallback
  // keeps older or unusually large source files compatible.
  const raw = await readFile(filePath, "utf8");
  return raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)?.[1] ?? null;
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
  const candidateFiles = files.filter((filePath) => Boolean(locationFor(filePath)));
  const records = await mapWithConcurrency(candidateFiles, async (filePath) => {
    const location = locationFor(filePath);
    if (!location) return null;
    const frontmatter = await readFrontmatter(filePath);
    if (!frontmatter) return null;
    const year = Number(scalar(frontmatter, "year"));
    const questionNumber = Number(scalar(frontmatter, "question_number"));
    const topic = scalar(frontmatter, "topic");
    if (!Number.isFinite(year) || !Number.isFinite(questionNumber) || !topic) return null;
    const id = encodeId(root, filePath);
    return {
      id, filePath, ...location, year, questionNumber, topic,
      secondaryTopics: list(frontmatter, "secondary_topics"),
      visualAssets: list(frontmatter, "visual_assets"),
      hasVisual: scalar(frontmatter, "has_visual").toLowerCase() === "true" || list(frontmatter, "visual_assets").length > 0,
    } satisfies RecordItem;
  });
  return records.filter((record): record is RecordItem => Boolean(record));
}

async function loadRecordDetail(subjectId: string, record: RecordItem): Promise<RecordDetail | null> {
  const raw = await readFile(record.filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const body = match[2];
  const visualAssets = imageReferences(body);
  if (visualAssets.length === 0) visualAssets.push(...record.visualAssets);
  const cursor = { value: 0 };

  return {
    ...record,
    visualAssets,
    hasVisual: visualAssets.length > 0,
    questionText: cleanMarkdown(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References"), subjectId, record.id, cursor),
    markingSchemeText: cleanMarkdown(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References"), subjectId, record.id, cursor),
    tutorQuestionText: tutorText(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References")),
    tutorMarkingSchemeText: tutorText(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References")),
  };
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
  if (!record) return null;
  const detail = await loadRecordDetail(input.subjectId, record);
  return detail ? {
    ...summary(input.subjectId, detail),
    questionText: detail.questionText,
    markingSchemeText: detail.markingSchemeText,
    tutorQuestionText: detail.tutorQuestionText,
    tutorMarkingSchemeText: detail.tutorMarkingSchemeText,
  } : null;
}

export async function getPastPaperArchiveAsset(input: { subjectId: string; id: string; assetIndex: number }): Promise<PastPaperArchiveAsset | null> {
  const root = assetsRoot(input.subjectId);
  const record = (await getArchive(input.subjectId)).find((item) => item.id === input.id);
  if (!root || !record) return null;
  const detail = await loadRecordDetail(input.subjectId, record);
  const reference = detail?.visualAssets[input.assetIndex];
  if (!reference) return null;
  const filePath = path.resolve(path.dirname(record.filePath), reference);
  if (!filePath.startsWith(`${root}${path.sep}`)) return null;
  const extension = path.extname(filePath).toLowerCase();
  const contentType = extension === ".png" ? "image/png" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/webp";
  try {
    return { bytes: await readFile(filePath), contentType };
  } catch {
    return { remoteUrl: remoteAssetUrl(filePath) };
  }
}
