import OpenAI from "openai";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAppliedMathsSpecificationContext } from "@/lib/applied-maths-syllabus";
import { getSubjectAssessmentContext } from "@/lib/assessment-context";
import { getCurriculumContext } from "@/lib/curriculum-context";
import {
  getProcessedPastPaperContext,
  hasProcessedSubjectConfig,
} from "@/lib/exam-question-chunks";
import { selectHybridVectorChunks } from "@/lib/rag-hybrid-merge";
import { createAdminClient } from "@/lib/supabase/admin";

/** Maps app subject ids → exam_chunks.subject labels used by match_exam_chunks. */
const RAG_SUBJECTS: Record<string, string> = {
  accounting: "Accounting",
  "applied-maths": "Applied Maths",
  maths: "Mathematics",
  english: "English",
  biology: "Biology",
  chemistry: "Chemistry",
  "computer-science": "Computer Science",
  economics: "Economics",
  physics: "Physics",
  business: "Business",
  french: "French",
  irish: "Irish",
  german: "German",
  spanish: "Spanish",
  history: "History",
  geography: "Geography",
  technology: "Technology",
};

const LEVEL_MAP: Record<string, string> = {
  HL: "Higher",
  OL: "Ordinary",
};

const TOPIC_MAP: Record<string, Record<string, string | null>> = {
  maths: {
    algebra: "Algebra",
    "functions-graphs": "Functions",
    calculus: "Calculus",
    "sequences-series": "Sequences & Series",
    "complex-numbers": "Complex Numbers",
    "financial-maths": "Financial Maths",
    "coordinate-geometry": "Coordinate Geometry",
    "geometry-proofs": "Geometry",
    trigonometry: "Trigonometry",
    probability: "Probability",
    statistics: "Statistics",
    "area-volume-measurement": null,
    general: null,
  },
  english: {
    poetry: "Poetry",
    "unseen-poetry": "Poetry",
    composition: "Personal Essay",
    "language-analysis": "Language & Style",
    comparative: "Fiction",
    "single-text": "Fiction",
    shakespeare: "Drama",
    general: null,
  },
  biology: {
    "cell-biology": "Cell Biology",
    genetics: "Genetics & Evolution",
    ecology: "Ecology",
    "human-systems": "Human Systems",
    "photosynthesis-respiration": "Biochemistry",
    evolution: "Genetics & Evolution",
    experiments: null,
    general: null,
  },
  chemistry: {
    "atomic-theory": "Atomic Structure & Bonding",
    bonding: "Atomic Structure & Bonding",
    stoichiometry: "Stoichiometry",
    "organic-chemistry": "Organic Chemistry",
    "acids-bases": "Acids & Bases",
    equilibrium: "Reaction Rates",
    experiments: null,
    general: null,
  },
  physics: {
    mechanics: "Mechanics",
    electricity: "Electricity & Magnetism",
    "light-sound": "Waves & Light",
    heat: "Heat",
    waves: "Waves & Light",
    "modern-physics": "Atomic & Nuclear Physics",
    experiments: null,
    general: null,
  },
  business: {
    "people-in-business": "Enterprise & Management",
    enterprise: "Enterprise & Management",
    management: "Enterprise & Management",
    marketing: "Marketing",
    finance: "Finance",
    "business-documents": null,
    general: null,
  },
  history: {
    "ireland-topics": "Modern Ireland",
    "europe-topics": "Modern Europe",
    "dictatorship-democracy": "Modern Europe",
    "usa-topics": "USA",
    "research-study-report": "Depth Study",
    general: null,
  },
  geography: {
    "physical-geography": "Physical Geography",
    "regional-geography": "Regional Geography",
    geoecology: "Geoecology",
    elective: null,
    "map-skills": null,
    general: null,
  },
};

const VECTOR_TIMEOUT_MS = 2500;
const VECTOR_MATCH_COUNT = 3;
const VECTOR_MATCH_COUNT_WITH_KEYWORD = 2;
const MIN_VECTOR_SIMILARITY = 0.35;

type ExamChunkMatch = {
  id?: number;
  subject: string;
  year: number;
  level: string;
  paper_num: number | null;
  topic: string;
  question_ref: string;
  content: string;
  similarity?: number;
};

type VectorResult = {
  chunks: ExamChunkMatch[];
};

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function vectorRetrievalEnabled() {
  if (process.env.RAG_VECTOR_ENABLED === "false") return false;
  return Boolean(process.env.OPENAI_API_KEY);
}

function mapTopic(subjectId: string, topicId: string): string | null {
  if (subjectId === "french" || subjectId === "irish") return null;
  const subjectTopics = TOPIC_MAP[subjectId];
  if (!subjectTopics) return null;
  return subjectTopics[topicId] ?? null;
}

function formatChunkHeader(chunk: ExamChunkMatch) {
  const paper = chunk.paper_num != null ? `, Paper ${chunk.paper_num}` : "";
  return `${chunk.subject} ${chunk.year} ${chunk.level}${paper} — ${chunk.topic} — ${chunk.question_ref}`;
}

function formatPastPaperContext(chunks: ExamChunkMatch[], intro?: string) {
  const sections = chunks.map(
    (chunk) => `### ${formatChunkHeader(chunk)}\n\n${chunk.content.trim()}`,
  );

  return [
    intro ??
      "Relevant past Leaving Certificate exam questions from the State Examinations Commission (SEC), each merged with its official marking scheme. Use these as authentic examples when they help the student. Reference the marking scheme criteria to show what the examiner expects — e.g. required steps, keywords, or mark allocations — without simply giving away the full answer.",
    sections.join("\n\n---\n\n"),
  ].join("\n\n");
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise.then((value) => value),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function getVectorSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  // Prefer service role; fall back to anon (exam_chunks has no RLS on this project).
  try {
    return createAdminClient();
  } catch {
    /* no service role configured */
  }

  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anon) return null;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function rpcMatchExamChunks(
  supabase: SupabaseClient,
  args: {
    embeddingStr: string;
    matchCount: number;
    filterSubject: string;
    filterLevel: string;
    filterTopic: string | null;
  },
) {
  return supabase.rpc("match_exam_chunks", {
    query_embedding: args.embeddingStr,
    match_count: args.matchCount,
    filter_subject: args.filterSubject,
    filter_level: args.filterLevel,
    filter_topic: args.filterTopic,
    filter_year_min: null,
    filter_year_max: null,
  });
}

function toVectorResult(data: ExamChunkMatch[] | null): VectorResult | null {
  if (!data?.length) return null;
  const chunks = data.filter((chunk) => (chunk.similarity ?? 1) >= MIN_VECTOR_SIMILARITY);
  if (!chunks.length) return null;
  return { chunks };
}

async function fetchVectorPastPaperChunks(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  userMessage: string;
  matchCount: number;
}): Promise<VectorResult | null> {
  if (!vectorRetrievalEnabled()) return null;

  const filterSubject = RAG_SUBJECTS[input.subjectId];
  if (!filterSubject) return null;

  const filterLevel = LEVEL_MAP[input.level];
  if (!filterLevel) return null;

  const openai = getOpenAIClient();
  if (!openai) return null;

  let supabase = getVectorSupabaseClient();
  if (!supabase) {
    console.warn("[RAG] Vector path skipped: no Supabase URL/key configured");
    return null;
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input.userMessage.slice(0, 8000),
  });
  const queryEmbedding = embeddingResponse.data[0]?.embedding;
  if (!queryEmbedding?.length) return null;

  const filterTopic = mapTopic(input.subjectId, input.topicId ?? "general");
  const embeddingStr = `[${queryEmbedding.join(",")}]`;
  const baseArgs = {
    embeddingStr,
    matchCount: input.matchCount,
    filterSubject,
    filterLevel,
    filterTopic,
  };

  let { data, error } = await rpcMatchExamChunks(supabase, baseArgs);

  // Retry with anon if service role JWT is present but invalid.
  if (error && /invalid api key/i.test(error.message ?? "")) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anon) {
      console.warn("[RAG] Service role key rejected; using anon key for vector match");
      supabase = createClient(url, anon, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      ({ data, error } = await rpcMatchExamChunks(supabase, baseArgs));
    }
  }

  // Topic labels often differ between corpora — retry without topic if filtered search is empty.
  if (!error && (!data || data.length === 0) && filterTopic) {
    ({ data, error } = await rpcMatchExamChunks(supabase, { ...baseArgs, filterTopic: null }));
  }

  if (error) {
    console.warn("[RAG] match_exam_chunks RPC error:", error.message ?? error);
    return null;
  }

  return toVectorResult(data as ExamChunkMatch[]);
}

async function fetchLocalProcessedContext(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  userMessage: string;
}): Promise<{ past: string; curriculum: string; spec: string; assessment: string }> {
  if (!hasProcessedSubjectConfig(input.subjectId)) {
    return { past: "", curriculum: "", spec: "", assessment: "" };
  }

  try {
    const [past, curriculum, spec] = await Promise.all([
      getProcessedPastPaperContext(input),
      getCurriculumContext(input),
      input.subjectId === "applied-maths"
        ? getAppliedMathsSpecificationContext(input)
        : Promise.resolve(""),
    ]);
    return {
      past: past || "",
      curriculum: curriculum || "",
      spec: spec || "",
      assessment: getSubjectAssessmentContext(input),
    };
  } catch (err) {
    console.warn(`[RAG] Local processed context retrieval failed for ${input.subjectId}:`, err);
    return { past: "", curriculum: "", spec: "", assessment: "" };
  }
}

/**
 * Hybrid RAG: local keyword/topic chunks (+ curriculum) in parallel with optional
 * OpenAI embedding → Supabase match_exam_chunks. Vector is best-effort and never
 * blocks tutoring when the key, service role, or RPC is missing.
 */
export async function getPastPaperContext(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  userMessage: string;
}): Promise<string> {
  const provenance: string[] = [];
  const sections: string[] = [];

  const localPromise = fetchLocalProcessedContext(input);
  const vectorPromise = withTimeout(
    fetchVectorPastPaperChunks({
      ...input,
      matchCount: VECTOR_MATCH_COUNT,
    }).catch((err) => {
      console.warn("[RAG] Vector retrieval failed:", err instanceof Error ? err.message : err);
      return null;
    }),
    VECTOR_TIMEOUT_MS,
  );

  const [local, vector] = await Promise.all([localPromise, vectorPromise]);

  if (local.past) {
    sections.push(local.past);
    provenance.push("keyword");
  }
  if (local.curriculum) {
    sections.push(local.curriculum);
    provenance.push("curriculum");
  }
  if (local.spec) {
    sections.push(local.spec);
    provenance.push("applied-maths-spec");
  }
  if (local.assessment) {
    sections.push(local.assessment);
    provenance.push("assessment");
  }

  if (vector?.chunks?.length) {
    const keywordBlob = local.past;
    const kept = selectHybridVectorChunks(vector.chunks, keywordBlob, {
      withKeywordLimit: VECTOR_MATCH_COUNT_WITH_KEYWORD,
      vectorOnlyLimit: VECTOR_MATCH_COUNT,
    });
    if (kept.length) {
      sections.push(
        formatPastPaperContext(
          kept,
          local.past
            ? "Additional past-paper matches from semantic (vector) search. Use when they add something the keyword examples missed; still do not dump full answers."
            : "Relevant past Leaving Certificate exam questions from semantic (vector) search over embedded SEC chunks. Use as authentic examples; do not dump full answers.",
        ),
      );
      provenance.push("vector");
    }
  }

  const mode = provenance.length
    ? provenance.includes("keyword") && provenance.includes("vector")
      ? "hybrid"
      : provenance.includes("vector")
        ? "vector"
        : provenance.includes("keyword")
          ? "keyword"
          : provenance.join("+")
    : "none";

  console.info(
    `[RAG] subject=${input.subjectId} level=${input.level} topic=${input.topicId ?? "general"} mode=${mode} parts=${provenance.join("+") || "none"}`,
  );

  return sections.join("\n\n");
}
