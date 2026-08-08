#!/usr/bin/env node
/**
 * Ingest processed question chunks → public.exam_chunks (with embeddings).
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (preferred) or anon,
 *           OPENAI_API_KEY
 *
 * Usage:
 *   node --env-file=.env.local scripts/ingest-exam-chunks.mjs --subject physics
 *   node --env-file=.env.local scripts/ingest-exam-chunks.mjs --subject physics --limit 20 --dry-run
 *   node --env-file=.env.local scripts/ingest-exam-chunks.mjs --all-missing
 *
 * Re-run safely: upserts on (source_path, chunk_index).
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUBJECT_FOLDERS = {
  accounting: { folder: "accounting-rag-preprocessing", label: "Accounting" },
  "applied-maths": { folder: "applied-maths-rag-preprocessing", label: "Applied Maths" },
  biology: { folder: "biology-rag-preprocessing", label: "Biology" },
  business: { folder: "business-rag-preprocessing", label: "Business" },
  chemistry: { folder: "chemistry-rag-preprocessing", label: "Chemistry" },
  "computer-science": { folder: "computer-science-rag-preprocessing", label: "Computer Science" },
  economics: { folder: "economics-rag-preprocessing", label: "Economics" },
  english: { folder: "english-rag-preprocessing", label: "English" },
  french: { folder: "french-rag-preprocessing", label: "French" },
  geography: { folder: "geography-rag-preprocessing", label: "Geography" },
  german: { folder: "german-rag-preprocessing", label: "German" },
  history: { folder: "history-rag-preprocessing", label: "History" },
  irish: { folder: "irish-rag-preprocessing", label: "Irish" },
  maths: { folder: "maths-rag-preprocessing", label: "Mathematics" },
  physics: { folder: "physics-rag-preprocessing", label: "Physics" },
  spanish: { folder: "spanish-rag-preprocessing", label: "Spanish" },
  technology: { folder: "technology-rag-preprocessing", label: "Technology" },
};

const EMBED_MODEL = "text-embedding-3-small";
const EMBED_BATCH = 64;
const MAX_CONTENT_CHARS = 6000;

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const subjectArg = argValue("--subject");
const limitArg = Number(argValue("--limit") ?? "0");
const dryRun = process.argv.includes("--dry-run");
const allMissing = process.argv.includes("--all-missing");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const key = serviceKey || anonKey;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and a Supabase key");
  process.exit(1);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}
if (!subjectArg && !allMissing) {
  console.error("Pass --subject <id> or --all-missing");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiKey });
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(full);
      return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
    }),
  );
  return nested.flat();
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const meta = {};
  const lines = match[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const field = lines[i].match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!field) continue;
    const keyName = field[1];
    const value = field[2].trim();
    if (value) {
      meta[keyName] = value.replace(/^["']|["']$/g, "");
      continue;
    }
    const list = [];
    while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
      i += 1;
      list.push(lines[i].replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, ""));
    }
    meta[keyName] = list;
  }
  return { meta, body: match[2] };
}

function stripNoise(text) {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^# Page \d+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitBody(body) {
  const markingStart = body.search(/^# Marking Scheme\s*$/m);
  const sourceStart = body.search(/^# Source References\s*$/m);
  const questionPart =
    markingStart >= 0 ? body.slice(0, markingStart) : sourceStart >= 0 ? body.slice(0, sourceStart) : body;
  const markingPart =
    markingStart >= 0 ? body.slice(markingStart, sourceStart >= 0 ? sourceStart : undefined) : "";
  return {
    question: stripNoise(questionPart.replace(/^# Question\s*/m, "")),
    marking: stripNoise(markingPart.replace(/^# Marking Scheme\s*/m, "")),
  };
}

function levelFromPath(filePath) {
  const parts = filePath.split(path.sep).map((p) => p.toLowerCase());
  if (parts.includes("ordinary")) return "Ordinary";
  if (parts.includes("higher")) return "Higher";
  return null;
}

function isIngestablePath(filePath) {
  const parts = filePath.split(path.sep).map((p) => p.toLowerCase());
  const hasLevel = parts.includes("higher") || parts.includes("ordinary");
  const hasCollection =
    parts.includes("mixed") || parts.includes("topic_specific") || parts.includes("unclassified");
  return hasLevel && hasCollection;
}

async function loadSubjectRows(subjectId) {
  const cfg = SUBJECT_FOLDERS[subjectId];
  if (!cfg) throw new Error(`Unknown subject: ${subjectId}`);
  const root = path.join(process.cwd(), "docs", "processed", cfg.folder, "output_question_chunks");
  const files = (await listMarkdownFiles(root)).filter(isIngestablePath);
  const rows = [];

  for (const filePath of files) {
    const level = levelFromPath(filePath);
    if (!level) continue;
    const raw = await readFile(filePath, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const { question, marking } = splitBody(parsed.body);
    if (!question && !marking) continue;

    const rel = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
    const year = Number(parsed.meta.year);
    const qn = parsed.meta.question_number;
    const content = [`Question:\n${question}`, marking ? `Marking scheme:\n${marking}` : ""]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, MAX_CONTENT_CHARS);

    rows.push({
      subject: cfg.label,
      year: Number.isFinite(year) ? year : null,
      level,
      paper_num: null,
      question_ref: qn != null ? `Q${qn}` : path.basename(filePath, ".md"),
      chunk_index: 0,
      content,
      source_file: path.basename(filePath),
      source_path: `processed/${rel}`,
      topic: String(parsed.meta.topic || "Other"),
    });
  }
  return rows;
}

async function embedBatch(texts) {
  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((row) => row.embedding);
}

async function upsertRows(rows) {
  // Upsert in small batches; unique on (source_path, chunk_index)
  const batchSize = 50;
  for (let i = 0; i < rows.length; i += batchSize) {
    const slice = rows.slice(i, i + batchSize).map((row) => ({
      ...row,
      embedding: `[${row.embedding.join(",")}]`,
    }));
    const { error } = await supabase.from("exam_chunks").upsert(slice, {
      onConflict: "source_path,chunk_index",
    });
    if (error) throw error;
    process.stdout.write(`\rupserted ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function ingestSubject(subjectId) {
  console.log(`\n=== Ingest ${subjectId} ===`);
  let rows = await loadSubjectRows(subjectId);
  console.log(`Loaded ${rows.length} chunks from processed markdown`);
  if (limitArg > 0) {
    rows = rows.slice(0, limitArg);
    console.log(`Limited to ${rows.length}`);
  }
  if (!rows.length) return { subjectId, count: 0 };

  if (dryRun) {
    console.log(`[dry-run] Would embed+upsert ${rows.length} rows (e.g. ${rows[0].source_path})`);
    return { subjectId, count: rows.length, dryRun: true };
  }

  for (let i = 0; i < rows.length; i += EMBED_BATCH) {
    const slice = rows.slice(i, i + EMBED_BATCH);
    const embeddings = await embedBatch(slice.map((row) => row.content));
    for (let j = 0; j < slice.length; j += 1) {
      slice[j].embedding = embeddings[j];
    }
    process.stdout.write(`\rembedded ${Math.min(i + EMBED_BATCH, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");

  await upsertRows(rows);
  return { subjectId, count: rows.length };
}

async function missingSubjects() {
  const { data, error } = await supabase.from("exam_chunks").select("subject");
  if (error) throw error;
  const present = new Set((data ?? []).map((row) => row.subject));
  return Object.entries(SUBJECT_FOLDERS)
    .filter(([, cfg]) => !present.has(cfg.label))
    .map(([id]) => id);
}

const targets = allMissing ? await missingSubjects() : [subjectArg];
if (allMissing) console.log("Missing subjects to ingest:", targets.join(", ") || "(none)");

const results = [];
for (const id of targets) {
  results.push(await ingestSubject(id));
}

console.log("\nDone:", results);
