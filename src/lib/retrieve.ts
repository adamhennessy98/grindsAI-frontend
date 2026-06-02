import OpenAI from "openai";
import { getAppliedMathsSpecificationContext } from "@/lib/applied-maths-syllabus";
import { getCurriculumContext } from "@/lib/curriculum-context";
import {
  getAppliedMathsProcessedPastPaperContext,
  getProcessedPastPaperContext,
  hasProcessedSubjectConfig,
} from "@/lib/exam-question-chunks";
import { createAdminClient } from "@/lib/supabase/admin";

const RAG_SUBJECTS: Record<string, string> = {
  maths: "Mathematics",
  english: "English",
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
  business: "Business",
  french: "French",
  irish: "Irish",
  history: "History",
  geography: "Geography",
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

type ExamChunkMatch = {
  subject: string;
  year: number;
  level: string;
  paper_num: number | null;
  topic: string;
  question_ref: string;
  content: string;
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

function formatPastPaperContext(chunks: ExamChunkMatch[]) {
  const sections = chunks.map(
    (chunk) => `### ${formatChunkHeader(chunk)}\n\n${chunk.content.trim()}`,
  );

  return [
    "Relevant past Leaving Certificate exam questions from the State Examinations Commission (SEC), each merged with its official marking scheme. Use these as authentic examples when they help the student. Reference the marking scheme criteria to show what the examiner expects — e.g. required steps, keywords, or mark allocations — without simply giving away the full answer.",
    sections.join("\n\n---\n\n"),
  ].join("\n\n");
}

export async function getPastPaperContext(input: {
  subjectId: string;
  level: string;
  topicId?: string;
  userMessage: string;
}): Promise<string> {
  if (hasProcessedSubjectConfig(input.subjectId)) {
    try {
      const [pastPaperContext, curriculumContext] = await Promise.all([
        getProcessedPastPaperContext(input),
        getCurriculumContext(input),
      ]);
      return [pastPaperContext, curriculumContext].filter(Boolean).join("\n\n");
    } catch (err) {
      console.warn(`[RAG] Local processed context retrieval failed for ${input.subjectId}:`, err);
      return "";
    }
  }

  if (input.subjectId === "applied-maths") {
    try {
      const [specificationContext, pastPaperContext] = await Promise.all([
        getAppliedMathsSpecificationContext(input),
        getAppliedMathsProcessedPastPaperContext(input),
      ]);
      return [specificationContext, pastPaperContext].filter(Boolean).join("\n\n");
    } catch (err) {
      console.warn("[RAG] Applied Mathematics processed context retrieval failed:", err);
      return "";
    }
  }

  try {
    const filterSubject = RAG_SUBJECTS[input.subjectId];
    if (!filterSubject) return "";

    const filterLevel = LEVEL_MAP[input.level];
    if (!filterLevel) return "";

    const openai = getOpenAIClient();
    if (!openai) return "";

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input.userMessage,
    });
    const queryEmbedding = embeddingResponse.data[0]?.embedding;
    if (!queryEmbedding?.length) return "";

    const filterTopic = mapTopic(input.subjectId, input.topicId ?? "general");

    const embeddingStr = `[${queryEmbedding.join(",")}]`;
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("match_exam_chunks", {
      query_embedding: embeddingStr,
      match_count: 3,
      filter_subject: filterSubject,
      filter_level: filterLevel,
      filter_topic: filterTopic,
      filter_year_min: null,
      filter_year_max: null,
    });

    if (error) {
      console.error("[RAG] RPC error:", error);
      return "";
    }
    if (!data?.length) return "";

    return formatPastPaperContext(data as ExamChunkMatch[]);
  } catch (err) {
    console.error("[RAG] caught exception:", err);
    return "";
  }
}
