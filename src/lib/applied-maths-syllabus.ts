import { readFile } from "node:fs/promises";
import path from "node:path";
import { SUBJECT_TOPICS } from "@/lib/constants";

const SPECIFICATION_PATH = path.join(
  process.cwd(),
  "docs",
  "processed",
  "applied_maths",
  "syllabus",
  "leaving_certificate_applied_mathematics_specification.md",
);

const MAX_SPEC_SNIPPETS = 4;
const MAX_SNIPPET_LENGTH = 900;

let specificationCache: Promise<string> | null = null;
let warnedMissingSpecification = false;

const SPEC_STOP_WORDS = new Set([
  "applied",
  "certificate",
  "exam",
  "examination",
  "general",
  "higher",
  "leaving",
  "level",
  "maths",
  "mathematics",
  "ordinary",
  "question",
  "specification",
  "syllabus",
  "that",
  "this",
  "with",
]);

async function loadSpecification() {
  try {
    return (await readFile(SPECIFICATION_PATH, "utf8"))
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch (error) {
    if (!warnedMissingSpecification) {
      console.warn(`[RAG] Applied Mathematics specification context is unavailable at ${SPECIFICATION_PATH}.`, error);
      warnedMissingSpecification = true;
    }
    return "";
  }
}

function getSpecification() {
  specificationCache ??= loadSpecification();
  return specificationCache;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(text: string) {
  return Array.from(
    new Set(
      normalize(text)
        .split(/\s+/)
        .filter((word) => word.length > 2 && !SPEC_STOP_WORDS.has(word)),
    ),
  ).slice(0, 50);
}

function chunksFromSpecification(markdown: string) {
  return markdown
    .split(/\n(?=#{1,2} Page \d+\b)/)
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

export async function getAppliedMathsSpecificationContext(input: {
  subjectId: string;
  topicId?: string;
  userMessage: string;
}) {
  if (input.subjectId !== "applied-maths") return "";

  const specification = await getSpecification();
  if (!specification) return "";

  const topicName =
    (SUBJECT_TOPICS["applied-maths"] ?? []).find((topic) => topic.id === (input.topicId ?? "general"))?.name ?? "";
  const tokens = tokenize([topicName, input.userMessage].join(" "));
  const snippets = chunksFromSpecification(specification);
  const selected = snippets
    .map((snippet) => ({ snippet, score: scoreSnippet(snippet, tokens) }))
    .filter(({ score }) => (input.topicId === "general" ? score > 0 : score > 1))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SPEC_SNIPPETS)
    .map(({ snippet }) => truncate(snippet));

  if (!selected.length) {
    const overview = snippets.slice(0, 2).map(truncate);
    if (!overview.length) return "";
    return [
      "[Applied Mathematics Specification Context]",
      "Broad official specification overview for Leaving Certificate Applied Mathematics. Treat this as the highest-priority curriculum source for Applied Mathematics scope, terminology, assessment alignment, and topic coverage.",
      overview.join("\n\n---\n\n"),
    ].join("\n\n");
  }

  return [
    "[Applied Mathematics Specification Context]",
    "Relevant official specification excerpts for Leaving Certificate Applied Mathematics. Treat this as the highest-priority curriculum source for Applied Mathematics scope, terminology, assessment alignment, and topic coverage.",
    selected.join("\n\n---\n\n"),
  ].join("\n\n");
}
