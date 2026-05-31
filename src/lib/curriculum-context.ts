import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { SUBJECT_TOPICS } from "@/lib/constants";
import { getProcessedSubjectConfig } from "@/lib/processed-subjects";

const MAX_CURRICULUM_SNIPPETS = 3;
const MAX_SNIPPET_LENGTH = 900;

const curriculumCache = new Map<string, Promise<string[]>>();
const warnedMissingCurriculum = new Set<string>();

const CURRICULUM_STOP_WORDS = new Set([
  "certificate",
  "course",
  "curriculum",
  "exam",
  "examination",
  "general",
  "higher",
  "leaving",
  "level",
  "ordinary",
  "question",
  "specification",
  "subject",
  "syllabus",
  "that",
  "this",
  "with",
]);

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

function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function cleanMarkdown(raw: string) {
  return stripFrontmatter(raw)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function loadCurriculum(subjectId: string) {
  const subjectConfig = getProcessedSubjectConfig(subjectId);
  if (!subjectConfig) return [];

  try {
    const files = await listMarkdownFiles(subjectConfig.curriculumRoot);
    return Promise.all(files.map(async (filePath) => cleanMarkdown(await readFile(filePath, "utf8"))));
  } catch (error) {
    if (!warnedMissingCurriculum.has(subjectId)) {
      console.warn(
        `[RAG] ${subjectConfig.displayName} curriculum context is unavailable at ${subjectConfig.curriculumRoot}.`,
        error,
      );
      warnedMissingCurriculum.add(subjectId);
    }
    return [];
  }
}

function getCurriculum(subjectId: string) {
  if (!curriculumCache.has(subjectId)) {
    curriculumCache.set(subjectId, loadCurriculum(subjectId));
  }
  return curriculumCache.get(subjectId) ?? Promise.resolve([]);
}

function normalize(text: string) {
  return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(text: string) {
  return Array.from(
    new Set(
      normalize(text)
        .split(/\s+/)
        .filter((word) => word.length > 2 && !CURRICULUM_STOP_WORDS.has(word)),
    ),
  ).slice(0, 50);
}

function splitIntoSnippets(markdown: string) {
  const byPage = markdown
    .split(/\n(?=#{1,3}\s*(?:Page\s+)?\d+\b|<!--\s*PAGE\s+\d+\s*-->)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (byPage.length > 1) return byPage;

  return markdown
    .split(/\n(?=#{1,3}\s+)/)
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

export async function getCurriculumContext(input: {
  subjectId: string;
  topicId?: string;
  userMessage: string;
}) {
  const subjectConfig = getProcessedSubjectConfig(input.subjectId);
  if (!subjectConfig) return "";

  const curriculumFiles = await getCurriculum(input.subjectId);
  if (!curriculumFiles.length) return "";

  const topicName =
    (SUBJECT_TOPICS[input.subjectId] ?? []).find((topic) => topic.id === (input.topicId ?? "general"))?.name ?? "";
  const tokens = tokenize([subjectConfig.displayName, topicName, input.userMessage].join(" "));
  const snippets = curriculumFiles.flatMap(splitIntoSnippets);
  const selected = snippets
    .map((snippet) => ({ snippet, score: scoreSnippet(snippet, tokens) }))
    .filter(({ score }) => (input.topicId === "general" ? score > 0 : score > 1))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CURRICULUM_SNIPPETS)
    .map(({ snippet }) => truncate(snippet));

  const excerpts = selected.length ? selected : snippets.slice(0, 2).map(truncate);
  if (!excerpts.length) return "";

  const topicLine = topicName ? `Topic: ${topicName}` : `Topic: ${input.topicId ?? "general"}`;
  return [
    "[Syllabus / Curriculum Scope]",
    `Subject: ${subjectConfig.displayName}`,
    topicLine,
    "",
    "Relevant syllabus context:",
    excerpts.join("\n\n---\n\n"),
  ].join("\n");
}
