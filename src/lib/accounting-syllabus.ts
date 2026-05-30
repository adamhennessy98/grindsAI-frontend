import { readFile } from "node:fs/promises";
import path from "node:path";
import { SUBJECT_TOPICS } from "@/lib/constants";

const SYLLABUS_PATH = path.join(
  process.cwd(),
  "docs",
  "processed",
  "accounting",
  "leaving_cert",
  "syllabus",
  "leaving_certificate_accounting_syllabus_for_examination_to_june_2028.md",
);

const MAX_SYLLABUS_SNIPPETS = 4;
const MAX_SNIPPET_LENGTH = 900;

let syllabusCache: Promise<string> | null = null;
let warnedMissingSyllabus = false;

const SYLLABUS_STOP_WORDS = new Set([
  "accounting",
  "certificate",
  "exam",
  "examination",
  "general",
  "higher",
  "leaving",
  "level",
  "ordinary",
  "question",
  "syllabus",
  "that",
  "this",
  "with",
]);

function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

async function loadSyllabus() {
  try {
    return stripFrontmatter(await readFile(SYLLABUS_PATH, "utf8"))
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch (error) {
    if (!warnedMissingSyllabus) {
      console.warn(`[RAG] Accounting syllabus context is unavailable at ${SYLLABUS_PATH}.`, error);
      warnedMissingSyllabus = true;
    }
    return "";
  }
}

function getSyllabus() {
  syllabusCache ??= loadSyllabus();
  return syllabusCache;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(text: string) {
  return Array.from(
    new Set(
      normalize(text)
        .split(/\s+/)
        .filter((word) => word.length > 2 && !SYLLABUS_STOP_WORDS.has(word)),
    ),
  ).slice(0, 50);
}

function chunksFromSyllabus(markdown: string) {
  return markdown
    .split(/\n(?=## Page \d+\b)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function scoreSnippet(snippet: string, tokens: string[]) {
  const normalized = normalize(snippet);
  return tokens.reduce((score, token) => score + (normalized.includes(token) ? 1 : 0), 0);
}

function truncate(text: string) {
  if (text.length <= MAX_SNIPPET_LENGTH) return text;
  return `${text.slice(0, MAX_SNIPPET_LENGTH).trim()}...`;
}

export async function getAccountingSyllabusContext(input: {
  subjectId: string;
  topicId?: string;
  userMessage: string;
}) {
  if (input.subjectId !== "accounting") return "";

  const syllabus = await getSyllabus();
  if (!syllabus) return "";

  const topicName =
    (SUBJECT_TOPICS.accounting ?? []).find((topic) => topic.id === (input.topicId ?? "general"))?.name ?? "";
  const tokens = tokenize([topicName, input.userMessage].join(" "));
  const snippets = chunksFromSyllabus(syllabus);
  const selected = snippets
    .map((snippet) => ({ snippet, score: scoreSnippet(snippet, tokens) }))
    .filter(({ score }) => (input.topicId === "general" ? score > 0 : score > 1))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SYLLABUS_SNIPPETS)
    .map(({ snippet }) => truncate(snippet));

  if (!selected.length) {
    const overview = snippets.slice(0, 2).map(truncate);
    if (!overview.length) return "";
    return [
      "[Accounting Syllabus Context]",
      "Broad syllabus overview for Leaving Certificate Accounting. Use this only for course scope, terminology, and assessment alignment.",
      overview.join("\n\n---\n\n"),
    ].join("\n\n");
  }

  return [
    "[Accounting Syllabus Context]",
    "Relevant syllabus excerpts for Leaving Certificate Accounting. Use this for course scope, terminology, and assessment alignment alongside the processed past-paper examples.",
    selected.join("\n\n---\n\n"),
  ].join("\n\n");
}
