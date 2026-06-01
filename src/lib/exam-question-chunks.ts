import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { SUBJECT_TOPICS } from "@/lib/constants";

const MAX_CHUNKS = 4;

const PROCESSED_SUBJECTS: Record<
  string,
  {
    chunksRoot: string;
    displayName: string;
    contextLabel: string;
    intro: string;
  }
> = {
  accounting: {
    chunksRoot: path.join(process.cwd(), "docs", "processed", "accounting", "leaving_cert", "output_question_chunks"),
    displayName: "Accounting",
    contextLabel: "Accounting Past Paper Example",
    intro:
      "Relevant Leaving Certificate Accounting past-paper examples with paired marking schemes from processed per-question chunks. Use these as reference examples for style, examiner expectations, accounting layouts, workings, and mark allocation. Do not claim generated questions are actual past paper questions unless explicitly discussing the cited example.",
  },
  "applied-maths": {
    chunksRoot: path.join(process.cwd(), "docs", "processed", "applied_maths", "output_question_chunks"),
    displayName: "Applied Maths",
    contextLabel: "Applied Mathematics Past Paper Example",
    intro:
      "Relevant Leaving Certificate Applied Mathematics past-paper examples with paired marking schemes from processed per-question chunks. Use these as reference examples for terminology, modelling style, examiner expectations, worked-solution style, diagrams, and mark allocation. Do not infer Applied Mathematics content from Maths, and do not claim generated questions are actual past paper questions unless explicitly discussing the cited example.",
  },
  maths: {
    chunksRoot: path.join(process.cwd(), "docs", "processed", "maths", "leaving_cert", "output_question_chunks"),
    displayName: "Maths",
    contextLabel: "Past Paper Example",
    intro:
      "Relevant Leaving Certificate Maths past-paper examples with paired marking schemes from processed per-question chunks. Use these as reference examples for style, examiner expectations, and mark allocation. Do not claim generated questions are actual past paper questions unless explicitly discussing the cited example.",
  },
};

const STOP_WORDS = new Set([
  "about",
  "accounting",
  "after",
  "again",
  "answer",
  "applied",
  "based",
  "before",
  "being",
  "could",
  "exam",
  "find",
  "from",
  "generate",
  "give",
  "help",
  "higher",
  "level",
  "maths",
  "mathematics",
  "ordinary",
  "paper",
  "question",
  "show",
  "style",
  "tell",
  "that",
  "their",
  "there",
  "these",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "work",
]);

type FrontmatterValue = string | number | boolean | string[] | number[];

type ChunkMetadata = {
  subject?: string;
  subject_id?: string;
  level?: string;
  year?: number;
  paper?: string;
  paper_num?: number;
  question_number?: number;
  section?: string;
  topic?: string;
  secondary_topics?: string[];
  classification_type?: string;
  has_visual?: boolean;
  visual_assets?: string[];
  source_exam_pages?: number[];
  source_marking_scheme_pages?: number[];
};

type ExamQuestionChunk = {
  filePath: string;
  levelFolder: "higher" | "ordinary";
  collection: "mixed" | "topic_specific" | "unclassified";
  metadata: ChunkMetadata;
  questionText: string;
  markingSchemeText: string;
  searchableText: string;
};

const chunkCache = new Map<string, Promise<ExamQuestionChunk[]>>();
const warnedMissingChunks = new Set<string>();

function normalizeLevel(level: string): "higher" | "ordinary" {
  const value = level.toLowerCase();
  if (value === "ol" || value.includes("ordinary")) return "ordinary";
  return "higher";
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function topicLabelsForSubject(subjectId: string) {
  return Object.fromEntries((SUBJECT_TOPICS[subjectId] ?? []).map((topic) => [topic.id, topic.name]));
}

function tokenize(text: string) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
    ),
  ).slice(0, 40);
}

function parseScalar(value: string): FrontmatterValue {
  const trimmed = value.trim();
  if (trimmed === "[]") return [];
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^["']|["']$/g, "");
}

function parseFrontmatter(raw: string): { metadata: ChunkMetadata; body: string } | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const lines = match[1].split(/\r?\n/);
  const metadata: Record<string, FrontmatterValue> = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const field = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!field) continue;

    const key = field[1];
    const value = field[2];
    if (value.trim()) {
      metadata[key] = parseScalar(value);
      continue;
    }

    const list: Array<string | number> = [];
    while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
      i += 1;
      const item = lines[i].replace(/^\s+-\s+/, "").trim();
      const parsed = parseScalar(item);
      if (typeof parsed === "string" || typeof parsed === "number") {
        list.push(parsed);
      }
    }
    metadata[key] = list as string[] | number[];
  }

  return { metadata: metadata as ChunkMetadata, body: match[2] };
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
    }),
  );
  return files.flat();
}

function stripPromptNoise(text: string) {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^# Page \d+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitBody(body: string) {
  const markingStart = body.search(/^# Marking Scheme\s*$/m);
  const sourceStart = body.search(/^# Source References\s*$/m);
  const questionPart =
    markingStart >= 0 ? body.slice(0, markingStart) : sourceStart >= 0 ? body.slice(0, sourceStart) : body;
  const markingPart =
    markingStart >= 0
      ? body.slice(markingStart, sourceStart >= 0 ? sourceStart : undefined)
      : "";

  return {
    questionText: stripPromptNoise(questionPart.replace(/^# Question\s*/m, "")),
    markingSchemeText: stripPromptNoise(markingPart.replace(/^# Marking Scheme\s*/m, "")),
  };
}

function levelAndCollectionFromPath(filePath: string): Pick<ExamQuestionChunk, "levelFolder" | "collection"> | null {
  const parts = filePath.split(path.sep);
  const level = parts.includes("ordinary") ? "ordinary" : parts.includes("higher") ? "higher" : null;
  const collection = parts.includes("topic_specific")
    ? "topic_specific"
    : parts.includes("mixed")
      ? "mixed"
      : parts.includes("unclassified")
        ? "unclassified"
        : null;
  if (!level || !collection) return null;
  return { levelFolder: level, collection };
}

async function loadChunks(subjectId: string) {
  const subjectConfig = PROCESSED_SUBJECTS[subjectId];
  if (!subjectConfig) return [];

  try {
    const files = await listMarkdownFiles(subjectConfig.chunksRoot);
    const chunks = await Promise.all(
      files.map(async (filePath) => {
        try {
          const location = levelAndCollectionFromPath(filePath);
          if (!location) return null;
          const parsed = parseFrontmatter(await readFile(filePath, "utf8"));
          if (!parsed) {
            console.warn(`[RAG] Skipping ${subjectConfig.displayName} chunk with invalid frontmatter: ${filePath}`);
            return null;
          }
          const { questionText, markingSchemeText } = splitBody(parsed.body);
          return {
            filePath,
            ...location,
            metadata: parsed.metadata,
            questionText,
            markingSchemeText,
            searchableText: [
              parsed.metadata.topic,
              ...(parsed.metadata.secondary_topics ?? []),
              questionText,
              markingSchemeText,
            ].join(" "),
          } satisfies ExamQuestionChunk;
        } catch (error) {
          console.warn(`[RAG] Skipping unreadable ${subjectConfig.displayName} chunk: ${filePath}`, error);
          return null;
        }
      }),
    );
    return chunks.filter((chunk): chunk is ExamQuestionChunk => Boolean(chunk));
  } catch (error) {
    if (!warnedMissingChunks.has(subjectId)) {
      console.warn(`[RAG] ${subjectConfig.displayName} processed chunks are unavailable at ${subjectConfig.chunksRoot}.`, error);
      warnedMissingChunks.add(subjectId);
    }
    return [];
  }
}

function getChunks(subjectId: string) {
  if (!chunkCache.has(subjectId)) {
    chunkCache.set(subjectId, loadChunks(subjectId));
  }
  return chunkCache.get(subjectId) ?? Promise.resolve([]);
}

function keywordScore(queryTokens: string[], text: string) {
  if (!queryTokens.length) return 0;
  const normalizedText = normalizeLabel(text);
  return queryTokens.reduce((score, token) => score + (normalizedText.includes(token) ? 1 : 0), 0);
}

function scoreChunk(
  chunk: ExamQuestionChunk,
  input: { topicId: string; targetTopic: string | undefined; queryTokens: string[] },
) {
  const chunkTopic = normalizeLabel(chunk.metadata.topic ?? "");
  const secondaryTopics = (chunk.metadata.secondary_topics ?? []).map(normalizeLabel);
  const target = input.targetTopic ? normalizeLabel(input.targetTopic) : "";

  let score = 0;
  if (input.topicId === "general") {
    score += chunk.collection === "mixed" ? 8 : chunk.collection === "topic_specific" ? 2 : 0;
  } else {
    if (target && chunkTopic === target) score += 20;
    if (target && secondaryTopics.includes(target)) score += 10;
    if (target && chunk.collection === "topic_specific" && chunkTopic === target) score += 4;
    if (target && chunk.collection === "mixed" && secondaryTopics.includes(target)) score += 3;
  }

  score += keywordScore(input.queryTokens, chunk.searchableText) * 2;
  score += Math.max(0, ((chunk.metadata.year ?? 2015) - 2015) / 20);
  return score;
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function formatPages(pages: number[] | undefined) {
  return pages?.length ? pages.join(", ") : "not specified";
}

function formatChunk(chunk: ExamQuestionChunk, contextLabel: string) {
  const metadata = chunk.metadata;
  const secondaryTopics = metadata.secondary_topics?.length ? metadata.secondary_topics.join(", ") : "none";
  const visualAssets = metadata.visual_assets?.length ?? 0;
  return [
    `[${contextLabel}]`,
    `Year: ${metadata.year ?? "Unknown"}`,
    `Level: ${metadata.level ?? chunk.levelFolder}`,
    `Paper: ${metadata.paper ?? "Unknown"}`,
    `Question: Q${metadata.question_number ?? "?"}`,
    `Topic: ${metadata.topic ?? "Unclassified"}`,
    `Secondary topics: ${secondaryTopics}`,
    `Has visual: ${metadata.has_visual ? `true (${visualAssets} referenced image asset${visualAssets === 1 ? "" : "s"})` : "false"}`,
    "",
    "Question:",
    truncate(chunk.questionText, 1400),
    "",
    "Marking scheme:",
    truncate(chunk.markingSchemeText, 1400),
    "",
    "Source:",
    `Exam pages: ${formatPages(metadata.source_exam_pages)}`,
    `Marking scheme pages: ${formatPages(metadata.source_marking_scheme_pages)}`,
    `Chunk file: ${path.relative(process.cwd(), chunk.filePath).replace(/\\/g, "/")}`,
  ].join("\n");
}

function selectDiverse(chunks: ExamQuestionChunk[]) {
  const selected: ExamQuestionChunk[] = [];
  const seenTopics = new Set<string>();
  for (const chunk of chunks) {
    const topic = chunk.metadata.topic ?? chunk.filePath;
    if (selected.length < 2 || !seenTopics.has(topic)) {
      selected.push(chunk);
      seenTopics.add(topic);
    }
    if (selected.length >= MAX_CHUNKS) break;
  }
  return selected;
}

export async function getProcessedPastPaperContext(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  userMessage: string;
}) {
  const subjectConfig = PROCESSED_SUBJECTS[input.subjectId];
  if (!subjectConfig) return "";

  const levelFolder = normalizeLevel(input.level);
  const topicId = input.topicId ?? "general";
  const topicLabels = topicLabelsForSubject(input.subjectId);
  const targetTopic = topicLabels[topicId];
  const queryTokens = tokenize([input.userMessage, targetTopic ?? ""].join(" "));
  const allChunks = (await getChunks(input.subjectId)).filter((chunk) => chunk.levelFolder === levelFolder);
  if (!allChunks.length) return "";

  const scored = allChunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, { topicId, targetTopic, queryTokens }) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.chunk.metadata.year ?? 0) - (a.chunk.metadata.year ?? 0))
    .map(({ chunk }) => chunk);

  const selected = topicId === "general" ? selectDiverse(scored) : scored.slice(0, MAX_CHUNKS);
  if (!selected.length) return "";

  return [
    subjectConfig.intro,
    selected.map((chunk) => formatChunk(chunk, subjectConfig.contextLabel)).join("\n\n---\n\n"),
  ].join("\n\n");
}

export async function getMathsProcessedPastPaperContext(input: {
  level: string;
  topicId?: string;
  userMessage: string;
}) {
  return getProcessedPastPaperContext({ ...input, subjectId: "maths" });
}

export async function getAccountingProcessedPastPaperContext(input: {
  level: string;
  topicId?: string;
  userMessage: string;
}) {
  return getProcessedPastPaperContext({ ...input, subjectId: "accounting" });
}

export async function getAppliedMathsProcessedPastPaperContext(input: {
  level: string;
  topicId?: string;
  userMessage: string;
}) {
  return getProcessedPastPaperContext({ ...input, subjectId: "applied-maths" });
}
