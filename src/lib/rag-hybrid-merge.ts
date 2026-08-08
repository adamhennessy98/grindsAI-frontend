/**
 * Pure hybrid RAG merge helpers (keyword corpus + vector hits).
 * Kept free of OpenAI/Supabase so eval scripts can import them directly.
 */

export type HybridChunk = {
  year?: number | null;
  topic?: string | null;
  question_ref?: string | null;
  similarity?: number;
};

/** Normalize "Q6" / "Question 6" / "q.6" → comparable token like "q6". */
export function normalizeQuestionRef(ref: string): string {
  return ref
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(/^question\s+/i, "q")
    .replace(/^q\s+/, "q")
    .replace(/\s+/g, "");
}

/**
 * True when a vector chunk is already represented in the keyword past-paper blob.
 * Exact: year + question_ref substring.
 * Soft: year + topic, when refs normalize to the same question id (handles Q6 vs Question 6).
 */
export function chunkAlreadyCovered(chunk: HybridChunk, keywordContext: string): boolean {
  if (!keywordContext) return false;
  const haystack = keywordContext.toLowerCase();
  const year = chunk.year != null ? String(chunk.year) : "";
  const ref = chunk.question_ref?.trim() ?? "";
  const topic = chunk.topic?.toLowerCase().trim() ?? "";

  if (ref && year && haystack.includes(ref.toLowerCase()) && haystack.includes(year)) {
    return true;
  }

  // Soft: year + topic when the keyword blob already cites the same question number
  // under a different ref format (e.g. vector "Q6" vs keyword "Question 6").
  if (year && topic && haystack.includes(year) && haystack.includes(topic) && ref) {
    const normalized = normalizeQuestionRef(ref);
    if (!normalized) return false;
    // Pull candidate refs from headers like "— Q6" / "— Question 6"
    const refMatches = haystack.match(/(?:question\s+\d+|q\s*\d+)/gi) ?? [];
    if (refMatches.some((candidate) => normalizeQuestionRef(candidate) === normalized)) {
      return true;
    }
  }

  return false;
}

export function selectHybridVectorChunks<T extends HybridChunk>(
  vectorChunks: T[],
  keywordPastPaper: string,
  opts: { withKeywordLimit: number; vectorOnlyLimit: number },
): T[] {
  const unique = vectorChunks.filter((chunk) => !chunkAlreadyCovered(chunk, keywordPastPaper));
  const limit = keywordPastPaper ? opts.withKeywordLimit : opts.vectorOnlyLimit;
  return unique.slice(0, limit);
}
