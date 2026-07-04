import Anthropic from "@anthropic-ai/sdk";
import { getSubjectTopics, getTopic, SUBJECTS } from "@/lib/constants";
import { getFormulaBookContext } from "@/lib/formula-book";
import { getPastPaperContext } from "@/lib/retrieve";
import type {
  ExamGeneratorRequest,
  ExamGeneratorResponse,
  GeneratedExamQuestion,
} from "@/lib/exam-generator";

type GenerationContext = ExamGeneratorRequest & {
  subjectName: string;
  topicName: string;
};

const QUESTION_TYPE_LABELS: Record<ExamGeneratorRequest["questionType"], string> = {
  short: "Short Questions",
  long: "Long Questions",
  mixed: "Mixed Exam Questions",
};

function levelLabel(level: string) {
  return level === "OL" ? "Ordinary Level" : "Higher Level";
}

function defaultMarks(type: ExamGeneratorRequest["questionType"], index: number) {
  if (type === "short") return 10;
  if (type === "long") return 25;
  return index % 2 === 0 ? 15 : 20;
}

function generationBrief(input: GenerationContext) {
  const topicInstruction =
    input.topicId === "general"
      ? `Generate mixed ${input.subjectName} questions across suitable syllabus areas for ${levelLabel(input.level)}.`
      : `Generate questions focused only on ${input.topicName}.`;

  return [
    `${input.subjectName} ${levelLabel(input.level)} ${QUESTION_TYPE_LABELS[input.questionType]}`,
    topicInstruction,
    `Difficulty: ${input.difficulty === "exam" ? "Exam standard" : "Easy basics practice"}.`,
  ].join(" ");
}

function fallbackQuestions(input: GenerationContext): GeneratedExamQuestion[] {
  return Array.from({ length: input.count }, (_, index) => {
    const questionNumber = index + 1;
    const focus =
      input.topicId === "general"
        ? `a mixed ${input.subjectName} syllabus area`
        : input.topicName;
    return {
      title: `Question ${questionNumber}`,
      subject: input.subjectName,
      level: levelLabel(input.level),
      topic: input.topicName,
      marks: defaultMarks(input.questionType, index),
      question: `Exam-style placeholder for ${input.subjectName} / ${levelLabel(input.level)} / ${input.topicName}. This will become a generated SEC-style question about ${focus} when the AI service is configured.`,
      hint: input.includeHints ? `Identify the key information in the question, then choose the relevant method for ${focus}.` : undefined,
      workedSolution: input.includeWorkedSolution
        ? "Worked solution placeholder: outline the method, substitute the given information, simplify carefully, and state the final answer with units or context where needed."
        : undefined,
      markingScheme: input.includeMarkingScheme
        ? "Marking scheme placeholder: marks will be allocated for method, correct substitution, accurate working, and a clear final answer."
        : undefined,
    };
  });
}

function buildExamGeneratorPrompt(input: GenerationContext, formulaBookContext: string, pastPaperContext: string) {
  const topicLine =
    input.topicId === "general"
      ? "The selected topic is General, so generate a mixed set across appropriate syllabus areas."
      : `The selected topic is ${input.topicName}. Keep every question focused on this topic.`;

  return [
    `You are GrindsAI's Leaving Certificate exam-question generator for ${input.subjectName}.`,
    `Level: ${levelLabel(input.level)}.`,
    `Question type: ${QUESTION_TYPE_LABELS[input.questionType]}.`,
    `Difficulty: ${input.difficulty === "exam" ? "Exam level difficulty" : "Easy, for solidifying the basics"}.`,
    topicLine,
    `Generate exactly ${input.count} question${input.count === 1 ? "" : "s"}.`,
    "Write original exam-style or SEC-style questions. Do not claim that any question is an actual SEC past paper question.",
    "Use available formula-book, syllabus, or retrieval context where relevant.",
    "When Formulae and Tables excerpts are present, that notation and printed page reference take precedence over alternative notation.",
    "Write mathematical expressions using LaTeX. Use inline maths with $...$ and display maths with $$...$$ where appropriate. Do not overuse display maths for small expressions.",
    input.includeHints ? "Include a useful hint for every question." : "Do not include hints.",
    input.includeWorkedSolution ? "Include a worked solution for every question." : "Do not include worked solutions.",
    input.includeMarkingScheme ? "Include a concise marking scheme for every question." : "Do not include marking schemes.",
    "Return only valid JSON. Do not wrap it in markdown.",
    "The JSON must match this shape exactly: {\"questions\":[{\"title\":\"Question 1\",\"subject\":\"Maths\",\"level\":\"Higher Level\",\"topic\":\"Algebra\",\"marks\":25,\"question\":\"...\",\"hint\":\"...\",\"workedSolution\":\"...\",\"markingScheme\":\"...\"}]}",
    "Omit hint, workedSolution, and markingScheme keys when they were not requested.",
    pastPaperContext
      ? [
          "Past-paper retrieval context is provided for style and marking guidance only.",
          "Do not copy it verbatim and do not describe generated questions as actual past paper questions.",
          pastPaperContext,
        ].join("\n\n")
      : "",
    formulaBookContext,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function stripJsonFences(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function cleanOptional(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeQuestions(raw: unknown, input: GenerationContext): GeneratedExamQuestion[] | null {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { questions?: unknown }).questions)) {
    return null;
  }

  const questions = (raw as { questions: unknown[] }).questions.slice(0, input.count).map((question, index) => {
    const item = question && typeof question === "object" ? (question as Record<string, unknown>) : {};
    return {
      title: cleanOptional(item.title) ?? `Question ${index + 1}`,
      subject: cleanOptional(item.subject) ?? input.subjectName,
      level: cleanOptional(item.level) ?? levelLabel(input.level),
      topic: cleanOptional(item.topic) ?? input.topicName,
      marks: Number.isFinite(Number(item.marks)) ? Math.max(1, Math.round(Number(item.marks))) : defaultMarks(input.questionType, index),
      question: cleanOptional(item.question) ?? fallbackQuestions(input)[index]?.question ?? "",
      hint: input.includeHints ? cleanOptional(item.hint) : undefined,
      workedSolution: input.includeWorkedSolution ? cleanOptional(item.workedSolution) : undefined,
      markingScheme: input.includeMarkingScheme ? cleanOptional(item.markingScheme) : undefined,
    };
  });

  if (questions.length !== input.count || questions.some((question) => !question.question.trim())) {
    return null;
  }

  return questions;
}

export function resolveExamGeneratorContext(input: ExamGeneratorRequest): GenerationContext | null {
  const subject = SUBJECTS.find((item) => item.id === input.subjectId && item.enabled);
  if (!subject) return null;

  const validTopic = getSubjectTopics(input.subjectId).some((topic) => topic.id === input.topicId)
    ? input.topicId
    : "general";
  const topic = getTopic(input.subjectId, validTopic);

  return {
    ...input,
    level: input.level === "OL" ? "OL" : "HL",
    topicId: validTopic,
    count: Math.min(3, Math.max(1, Math.round(Number(input.count) || 1))),
    subjectName: subject.name,
    topicName: topic.name,
  };
}

export async function generateExamQuestions(input: GenerationContext): Promise<ExamGeneratorResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { questions: fallbackQuestions(input), usedFallback: true };
  }

  const brief = generationBrief(input);
  const [formulaBookContext, pastPaperContext] = await Promise.all([
    getFormulaBookContext({ subjectId: input.subjectId, level: input.level, topicId: input.topicId, userMessage: brief }),
    getPastPaperContext({ subjectId: input.subjectId, level: input.level, topicId: input.topicId, userMessage: brief }),
  ]);

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const response = await client.messages.create({
    model,
    system: buildExamGeneratorPrompt(input, formulaBookContext, pastPaperContext),
    messages: [
      {
        role: "user",
        content: `Generate ${input.count} ${QUESTION_TYPE_LABELS[input.questionType].toLowerCase()} for ${input.subjectName} / ${levelLabel(input.level)} / ${input.topicName}.`,
      },
    ],
    max_tokens: 3200,
    temperature: input.difficulty === "exam" ? 0.55 : 0.45,
  });

  const block = response.content[0];
  const text = block?.type === "text" ? block.text : "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(text));
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  const questions = normalizeQuestions(parsed, input);
  if (!questions) {
    throw new Error("The AI response did not match the expected question format.");
  }

  return { questions, usedFallback: false };
}
