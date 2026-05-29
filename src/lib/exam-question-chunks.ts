import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CHUNKS_ROOT = path.join(process.cwd(), "docs", "processed", "maths", "leaving_cert", "output_question_chunks");
const MAX_CHUNKS = 4;

const TOPIC_LABELS: Record<string, string> = {
  algebra: "Algebra",
  "functions-graphs": "Functions & Graphs",
  calculus: "Calculus",
  "sequences-series": "Sequences & Series",
  "complex-numbers": "Complex Numbers",
  "financial-maths": "Financial Maths",
  "coordinate-geometry": "Coordinate Geometry",
  "geometry-proofs": "Geometry & Proofs",
  trigonometry: "Trigonometry",
  probability: "Probability",
  statistics: "Statistics",
  "area-volume-measurement": "Area, Volume & Measurement",
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "answer",
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
  level?: string;
  year?: number;
  paper?: string;
  question_number?: number;
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

let chunkCache: Promise<ExamQuestionChunk[]> | null = null;
let warnedMissingChunks = false;

function normalizeLevel(level: string): "higher" | "ordinary" {
  const value = level.toLowerCase();
  if (value === "ol" || value.includes("ordinary")) return "ordinary";
  return "higher";
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
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

async function loadChunks() {
  try {
    const files = await listMarkdownFiles(CHUNKS_ROOT);
    const chunks = await Promise.all(
      files.map(async (filePath) => {
        try {
          const location = levelAndCollectionFromPath(filePath);
          if (!location) return null;
          const parsed = parseFrontmatter(await readFile(filePath, "utf8"));
          if (!parsed) {
            console.warn(`[RAG] Skipping chunk with invalid frontmatter: ${filePath}`);
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
          console.warn(`[RAG] Skipping unreadable Maths chunk: ${filePath}`, error);
          return null;
        }
      }),
    );
    return chunks.filter((chunk): chunk is ExamQuestionChunk => Boolean(chunk));
  } catch (error) {
    if (!warnedMissingChunks) {
      console.warn(`[RAG] Maths processed chunks are unavailable at ${CHUNKS_ROOT}.`, error);
      warnedMissingChunks = true;
    }
    return [];
  }
}

function getChunks() {
  chunkCache ??= loadChunks();
  return chunkCache;
}

function keywordScore(queryTokens: string[], text: string) {
  if (!queryTokens.length) return 0;
  const normalizedText = normalizeLabel(text);
  return queryTokens.reduce((score, token) => score + (normalizedText.includes(token) ? 1 : 0), 0);
}

function scoreChunk(chunk: ExamQuestionChunk, input: { topicId: string; queryTokens: string[] }) {
  const targetTopic = TOPIC_LABELS[input.topicId];
  const chunkTopic = normalizeLabel(chunk.metadata.topic ?? "");
  const secondaryTopics = (chunk.metadata.secondary_topics ?? []).map(normalizeLabel);
  const target = targetTopic ? normalizeLabel(targetTopic) : "";

  let score = 0;
  if (input.topicId === "general") {
    score += chunk.collection === "mixed" ? 8 : chunk.collection === "topic_specific" ? 2 : 0;
  } else {
    if (chunkTopic === target) score += 20;
    if (secondaryTopics.includes(target)) score += 10;
    if (chunk.collection === "topic_specific" && chunkTopic === target) score += 4;
    if (chunk.collection === "mixed" && secondaryTopics.includes(target)) score += 3;
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

function formatChunk(chunk: ExamQuestionChunk) {
  const metadata = chunk.metadata;
  const secondaryTopics = metadata.secondary_topics?.length ? metadata.secondary_topics.join(", ") : "none";
  const visualAssets = metadata.visual_assets?.length ?? 0;
  return [
    "[Past Paper Example]",
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

export async function getMathsProcessedPastPaperContext(input: {
  level: string;
  topicId?: string;
  userMessage: string;
}) {
  const levelFolder = normalizeLevel(input.level);
  const topicId = input.topicId ?? "general";
  const queryTokens = tokenize([input.userMessage, TOPIC_LABELS[topicId] ?? ""].join(" "));
  const allChunks = (await getChunks()).filter((chunk) => chunk.levelFolder === levelFolder);
  if (!allChunks.length) return "";

  const scored = allChunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, { topicId, queryTokens }) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.chunk.metadata.year ?? 0) - (a.chunk.metadata.year ?? 0))
    .map(({ chunk }) => chunk);

  const selected = topicId === "general" ? selectDiverse(scored) : scored.slice(0, MAX_CHUNKS);
  if (!selected.length) return "";

  return [
    "Relevant Leaving Certificate Maths past-paper examples with paired marking schemes from processed per-question chunks. Use these as reference examples for style, examiner expectations, and mark allocation. Do not claim generated questions are actual past paper questions unless explicitly discussing the cited example.",
    selected.map(formatChunk).join("\n\n---\n\n"),
  ].join("\n\n");
}
