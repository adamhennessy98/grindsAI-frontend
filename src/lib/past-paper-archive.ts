import { readdir, readFile } from "node:fs/promises";
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

export function isArchiveInstructionOnly(value: string) {
  const text = value.replace(/<!--[\s\S]*?-->/g, "").replace(/^#.*$/gm, "").trim().replace(/\s+/g, " ");
  if (!text) return true;
  return /^(?:section [a-z],? leaving \d+ minutes for section [a-z][.!]?|instructions(?: to candidates)?:?|blank page|this page (?:is |has been )?(?:intentionally )?left blank[.!]?|answer (?:all|any (?:one|two|three|four|five|six|\d+)) (?:of the )?(?:following )?questions(?: in (?:this )?section [a-z])?[.!]?)$/i.test(text);
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
    let questionBody = sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References");
    let schemeBody = sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References");
    const fallbackAssets = list(frontmatter, "visual_assets");
    const hasQuestionScan = imageReferences(questionBody).length > 0 || fallbackAssets.some((asset) => !asset.replace(/\\/g, "/").includes("/marking_schemes/"));
    if (isArchiveInstructionOnly(questionBody) && (tutorText(questionBody) || !hasQuestionScan)) return null;
    // Some preprocessors record scans only in frontmatter, not in the Markdown.
    if (!imageReferences(questionBody).length) {
      questionBody += fallbackAssets.filter((asset) => !asset.replace(/\\/g, "/").includes("/marking_schemes/"))
        .map((asset) => `\n\n![Scanned exam page](${asset})`).join("");
    }
    if (!imageReferences(schemeBody).length) {
      schemeBody += fallbackAssets.filter((asset) => asset.replace(/\\/g, "/").includes("/marking_schemes/"))
        .map((asset) => `\n\n![Scanned marking scheme](${asset})`).join("");
    }
    const visualAssets = [...imageReferences(questionBody), ...imageReferences(schemeBody)];
    return {
      id, filePath, ...location, year, questionNumber, topic,
      secondaryTopics: list(frontmatter, "secondary_topics"), visualAssets,
      hasVisual: visualAssets.length > 0,
      questionText: cleanMarkdown(questionBody, subjectId, id, cursor),
      markingSchemeText: cleanMarkdown(schemeBody, subjectId, id, cursor),
      tutorQuestionText: tutorText(sectionBefore(sectionBefore(body, "Marking Scheme"), "Source References")),
      tutorMarkingSchemeText: tutorText(sectionBefore(sectionAfter(body, "Marking Scheme"), "Source References")),
    } satisfies RecordItem;
  }));
  const unique = new Map<string, RecordItem>();
  const rank = { topic_specific: 0, mixed: 1, unclassified: 2 };
  for (const record of records.filter((item): item is RecordItem => Boolean(item)).sort((a, b) => rank[a.collection] - rank[b.collection])) {
    // The same preprocessed source often exists in classified and unclassified folders.
    const sourceName = path.basename(record.filePath).replace(/_q\d+_.+\.md$/, "");
    const key = `${record.level}:${sourceName}:${record.questionNumber}:${record.tutorQuestionText.replace(/\s+/g, " ")}`;
    const existing = unique.get(key);
    if (!existing) unique.set(key, record);
    else if (record.collection === "topic_specific" && existing.collection === "topic_specific") {
      existing.secondaryTopics = [...new Set([...existing.secondaryTopics, record.topic, ...record.secondaryTopics])];
    }
  }
  return [...unique.values()];
}

function getArchive(subjectId: string) {
  if (!archiveCache.has(subjectId)) archiveCache.set(subjectId, loadArchive(subjectId).catch((error) => {
    archiveCache.delete(subjectId);
    throw error;
  }));
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

export async function getPastPaperArchiveAsset(input: { subjectId: string; id: string; assetIndex: number }): Promise<{ url: string } | { bytes: Buffer; contentType: string } | null> {
  const root = assetsRoot(input.subjectId);
  const record = (await getArchive(input.subjectId)).find((item) => item.id === input.id);
  const reference = record?.visualAssets[input.assetIndex];
  if (!root || !record || !reference) return null;
  const filePath = path.resolve(path.dirname(record.filePath), reference);
  if (!filePath.startsWith(`${root}${path.sep}`)) return null;
  const assetBase = process.env.PAST_PAPER_ASSET_BASE_URL?.trim();
  if (assetBase) {
    const base = new URL(assetBase.endsWith("/") ? assetBase : `${assetBase}/`);
    if (!['https:', 'http:'].includes(base.protocol)) throw new Error("Invalid past-paper asset base URL");
    const assetPath = [input.subjectId, ...path.relative(root, filePath).split(path.sep)].map(encodeURIComponent).join("/");
    return { url: new URL(assetPath, base).toString() };
  }
  const extension = path.extname(filePath).toLowerCase();
  const contentType = extension === ".png" ? "image/png" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/webp";
  try {
    return { bytes: await readFile(filePath), contentType };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
