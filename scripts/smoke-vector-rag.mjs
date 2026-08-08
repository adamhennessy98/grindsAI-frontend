#!/usr/bin/env node
/**
 * Smoke: embed one query → match_exam_chunks → print top matches.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, OPENAI_API_KEY
 * Auth: SUPABASE_SERVICE_ROLE_KEY preferred; falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY
 * (exam_chunks has no RLS; anon may execute match_exam_chunks on this project).
 *
 * Usage:
 *   node --env-file=.env.local scripts/smoke-vector-rag.mjs
 *   node --env-file=.env.local scripts/smoke-vector-rag.mjs "integration by parts" Mathematics Higher
 */

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const query = process.argv[2] ?? "Explain how to integrate by parts for Leaving Cert Higher Level maths";
const filterSubject = process.argv[3] ?? "Mathematics";
const filterLevel = process.argv[4] ?? "Higher";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!url) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}
if (!serviceKey && !anonKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiKey });

const embeddingResponse = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: query,
});
const embedding = embeddingResponse.data[0]?.embedding;
if (!embedding?.length) {
  console.error("No embedding returned");
  process.exit(1);
}

const embeddingStr = `[${embedding.join(",")}]`;
const rpcArgs = {
  query_embedding: embeddingStr,
  match_count: 5,
  filter_subject: filterSubject,
  filter_level: filterLevel,
  filter_topic: null,
  filter_year_min: null,
  filter_year_max: null,
};

async function matchWithKey(key, label) {
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("match_exam_chunks", rpcArgs);
  return { data, error, label };
}

let result = null;
if (serviceKey) {
  result = await matchWithKey(serviceKey, "service_role");
  if (result.error && /invalid api key/i.test(result.error.message ?? "")) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY rejected by Supabase; retrying with anon key…");
    result = null;
  }
}
if (!result && anonKey) {
  result = await matchWithKey(anonKey, "anon");
}

if (!result || result.error) {
  console.error("RPC error:", result?.error ?? "no key worked");
  console.error(
    "Tip: In Supabase Dashboard → Settings → API, copy the legacy service_role JWT,\n" +
      "or remove the bad SUPABASE_SERVICE_ROLE_KEY line and rely on NEXT_PUBLIC_SUPABASE_ANON_KEY for this smoke test.",
  );
  process.exit(1);
}

const { data, label } = result;
console.log(`Auth: ${label}`);
console.log(`Query: ${query}`);
console.log(`Filter: ${filterSubject} / ${filterLevel}`);
console.log(`Matches: ${data?.length ?? 0}\n`);

for (const row of data ?? []) {
  const sim = typeof row.similarity === "number" ? row.similarity.toFixed(3) : "?";
  const preview = String(row.content ?? "").replace(/\s+/g, " ").slice(0, 160);
  console.log(`- [${sim}] ${row.year} ${row.level} ${row.topic} ${row.question_ref}`);
  console.log(`  ${preview}…\n`);
}
