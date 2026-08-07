export type ExamQuestionType = "short" | "long" | "mixed";
export type ExamQuestionDifficulty = "easy" | "exam";
export type ExamQuestionPurpose = "exam-practice" | "topic-check";

export type ExamGeneratorRequest = {
  subjectId: string;
  level: string;
  topicId: string;
  questionType: ExamQuestionType;
  difficulty: ExamQuestionDifficulty;
  count: number;
  includeHints: boolean;
  includeWorkedSolution: boolean;
  includeMarkingScheme: boolean;
  /** Keeps Topic Check generation distinct from normal exam-style practice. */
  purpose?: ExamQuestionPurpose;
  /** The question's position in an ordered Topic Check sequence. */
  topicCheckStep?: number;
  topicCheckTotal?: number;
};

export type GeneratedExamQuestion = {
  title: string;
  subject: string;
  level: string;
  topic: string;
  marks: number;
  question: string;
  hint?: string;
  workedSolution?: string;
  markingScheme?: string;
};

export type ExamGeneratorResponse = {
  questions: GeneratedExamQuestion[];
  usedFallback?: boolean;
};

export async function requestExamQuestions(input: ExamGeneratorRequest): Promise<ExamGeneratorResponse> {
  const response = await fetch("/api/exam-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json().catch(() => null)) as Partial<ExamGeneratorResponse> & { error?: string } | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not generate questions. Try again.");
  }

  if (!data || !Array.isArray(data.questions)) {
    throw new Error("The generator returned an invalid response. Try again.");
  }

  return {
    questions: data.questions,
    usedFallback: data.usedFallback,
  };
}
