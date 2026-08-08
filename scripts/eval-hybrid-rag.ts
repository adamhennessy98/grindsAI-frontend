#!/usr/bin/env node
/**
 * Hybrid RAG eval:
 * 1) Vector leg — fixed queries → embed → match_exam_chunks (on-subject hits)
 * 2) Merge leg — shared selectHybridVectorChunks / chunkAlreadyCovered (same as retrieve.ts)
 *
 * Usage:
 *   node --experimental-strip-types --env-file=.env.local scripts/eval-hybrid-rag.ts
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mergeUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "rag-hybrid-merge.ts"),
).href;
const { chunkAlreadyCovered, normalizeQuestionRef, selectHybridVectorChunks } = await import(
  mergeUrl
);

const CASES = [
  {
    id: "maths-ibp",
    query: "How do I integrate by parts for Leaving Cert Higher Level?",
    subject: "Mathematics",
    subjectId: "maths",
    level: "Higher",
    expectAny: ["calculus", "integrat", "differentiat", "function"],
  },
  {
    id: "maths-prob",
    query: "Explain conditional probability with a tree diagram",
    subject: "Mathematics",
    subjectId: "maths",
    level: "Higher",
    expectAny: ["probab", "statistic", "combin"],
  },
  {
    id: "bio-photo",
    query: "What happens in the light-dependent stage of photosynthesis?",
    subject: "Biology",
    subjectId: "biology",
    level: "Higher",
    expectAny: ["photosynth", "plant", "chlorophyll", "light"],
  },
  {
    id: "eng-poetry",
    query: "How should I structure a poetry essay on theme and imagery?",
    subject: "English",
    subjectId: "english",
    level: "Higher",
    expectAny: ["poem", "poetry", "theme", "imagery", "literary"],
  },
  {
    id: "business-marketing",
    query: "Explain the marketing mix for a Leaving Cert business short question",
    subject: "Business",
    subjectId: "business",
    level: "Higher",
    expectAny: ["market", "product", "price", "promot", "business"],
  },
  {
    id: "geo-physical",
    query: "Describe processes of coastal erosion for geography",
    subject: "Geography",
    subjectId: "geography",
    level: "Higher",
    expectAny: ["coast", "erosion", "physical", "wave", "landform", "geography"],
  },
  {
    id: "physics-waves",
    query: "Explain refraction of light and Snell's law for physics HL",
    subject: "Physics",
    subjectId: "physics",
    level: "Higher",
    expectAny: ["refract", "light", "wave", "lens", "optic", "snell", "physics"],
  },
  {
    id: "chem-acid",
    query: "How do I calculate pH for a strong acid titration question?",
    subject: "Chemistry",
    subjectId: "chemistry",
    level: "Higher",
    expectAny: ["acid", "base", "ph", "titration", "mole", "chemistry"],
  },
  {
    id: "synonym-maths",
    query: "I am stuck finding the slope of the tangent line to a curve",
    subject: "Mathematics",
    subjectId: "maths",
    level: "Higher",
    expectAny: ["tangent", "differenti", "deriv", "calculus", "function", "slope"],
  },
  {
    id: "multi-topic-bio",
    query: "Link genetics and evolution — natural selection question help",
    subject: "Biology",
    subjectId: "biology",
    level: "Higher",
    expectAny: ["gene", "evolut", "select", "allele", "dna", "species"],
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!url || !key || !openaiKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, a Supabase key, and OPENAI_API_KEY");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiKey });
const supabase = createClient(url, key, { auth: { persistSession: false } });

function hitText(row: { topic?: string; question_ref?: string; content?: string }) {
  return `${row.topic ?? ""} ${row.question_ref ?? ""} ${row.content ?? ""}`.toLowerCase();
}

function passes(row: { topic?: string; question_ref?: string; content?: string }, expectAny: string[]) {
  const text = hitText(row);
  return expectAny.some((token) => text.includes(token.toLowerCase()));
}

/** Unit checks for merge/dedupe — same helpers retrieve.ts uses. */
function runMergeSelfChecks() {
  const keywordExact =
    "### Mathematics 2022 Higher — Calculus — Q6\n\nIntegrate by parts example…";
  const keywordSoft =
    "### Mathematics 2022 Higher — Calculus — Question 6\n\nIntegrate by parts example…";

  const duplicateExact = {
    year: 2022,
    topic: "Calculus",
    question_ref: "Q6",
    content: "vector dup",
  };
  const duplicateSoft = {
    year: 2022,
    topic: "Calculus",
    question_ref: "Q6",
    content: "vector soft dup",
  };
  const novel = {
    year: 2019,
    topic: "Probability",
    question_ref: "Q3",
    content: "novel vector hit",
  };

  const checks = [
    {
      id: "merge-exact-dedupe",
      ok: chunkAlreadyCovered(duplicateExact, keywordExact) === true,
    },
    {
      id: "merge-soft-q-vs-question",
      ok:
        normalizeQuestionRef("Question 6") === "q6" &&
        chunkAlreadyCovered(duplicateSoft, keywordSoft) === true,
    },
    {
      id: "merge-keeps-novel",
      ok: chunkAlreadyCovered(novel, keywordExact) === false,
    },
    {
      id: "merge-cap-with-keyword",
      ok:
        selectHybridVectorChunks(
          [duplicateExact, novel, { year: 2018, topic: "Stats", question_ref: "Q1" }],
          keywordExact,
          { withKeywordLimit: 2, vectorOnlyLimit: 3 },
        ).length === 2,
    },
    {
      id: "merge-vector-only-cap",
      ok:
        selectHybridVectorChunks([novel, duplicateExact, { year: 2017, topic: "Algebra", question_ref: "Q2" }], "", {
          withKeywordLimit: 2,
          vectorOnlyLimit: 3,
        }).length === 3,
    },
  ];

  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} ${check.id}`);
  }
  return checks;
}

const results: Array<Record<string, unknown>> = [];
for (const testCase of CASES) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: testCase.query,
  });
  const embedding = embeddingResponse.data[0]?.embedding;
  const { data, error } = await supabase.rpc("match_exam_chunks", {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: 5,
    filter_subject: testCase.subject,
    filter_level: testCase.level,
    filter_topic: null,
    filter_year_min: null,
    filter_year_max: null,
  });

  if (error) {
    results.push({ ...testCase, ok: false, error: error.message, hits: 0, hybrid: null });
    console.log(`FAIL ${testCase.id}: ${error.message}`);
    continue;
  }

  const hits = (data ?? []) as Array<{
    year?: number;
    topic?: string;
    question_ref?: string;
    content?: string;
    similarity?: number;
  }>;
  const top = hits[0];
  const vectorOk = hits.some((row) => passes(row, testCase.expectAny));

  // Simulate hybrid merge: if keyword blob already cites top hit, it should drop; else append.
  const keywordStub = top
    ? `### ${testCase.subject} ${top.year} ${testCase.level} — ${top.topic} — Question ${String(top.question_ref ?? "").replace(/^q/i, "")}\n\nkeyword copy of top hit`
    : `### ${testCase.subject} keyword-only corpus present`;
  const keptBesideKeyword = selectHybridVectorChunks(hits, keywordStub, {
    withKeywordLimit: 2,
    vectorOnlyLimit: 3,
  });
  // Soft-dedupe should remove the top hit when keyword uses "Question N" form.
  const topDeduped =
    !top ||
    chunkAlreadyCovered(
      { year: top.year, topic: top.topic, question_ref: top.question_ref },
      keywordStub,
    );
  const hybridOk = vectorOk && topDeduped && keptBesideKeyword.length <= 2;
  const mode = vectorOk ? "hybrid" : "keyword"; // keyword always retained in app when processed files exist

  const ok = vectorOk && hybridOk;
  results.push({
    id: testCase.id,
    subject: testCase.subject,
    ok,
    vectorOk,
    hybridOk,
    mode,
    hits: hits.length,
    keptAfterDedupe: keptBesideKeyword.length,
    topSim: top?.similarity ?? null,
    topTopic: top?.topic ?? null,
    topRef: top?.question_ref ?? null,
  });
  console.log(
    `${ok ? "PASS" : "WEAK"} ${testCase.id}: hits=${hits.length} kept=${keptBesideKeyword.length} top=${top?.topic ?? "-"}/${top?.question_ref ?? "-"} sim=${top?.similarity?.toFixed?.(3) ?? "?"} mode=${mode}`,
  );
}

console.log("\n--- merge self-checks ---");
const mergeChecks = runMergeSelfChecks();
const mergePassed = mergeChecks.filter((row) => row.ok).length;

const passed = results.filter((row) => row.ok).length;
const summary = {
  generatedAt: new Date().toISOString(),
  passed,
  total: results.length,
  passRate: `${passed}/${results.length}`,
  mergeSelfChecks: `${mergePassed}/${mergeChecks.length}`,
  results,
  mergeChecks,
  notes: [
    "Vector leg: match_exam_chunks on-subject quality.",
    "Hybrid merge: uses src/lib/rag-hybrid-merge.ts (same helpers as retrieve.ts) — soft dedupe Qn vs Question N, caps 2/3.",
    "Live app always keeps local keyword + curriculum via getPastPaperContext(); vector is best-effort parallel.",
  ],
};

if (mergePassed !== mergeChecks.length) {
  console.error(`\nMerge self-checks failed: ${summary.mergeSelfChecks}`);
  process.exitCode = 1;
}

const outPath = path.join(
  process.cwd(),
  "docs",
  "icm",
  "ai-gaps",
  "vector-rag",
  "output",
  "EVAL.json",
);
await writeFile(outPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(`\nWrote ${outPath} (vector ${summary.passRate}, merge ${summary.mergeSelfChecks})`);
