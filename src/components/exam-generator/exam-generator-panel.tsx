import * as React from "react";
import type { Subject, SubjectTopic } from "@/lib/types";

type QuestionType = "short" | "long" | "mixed";
type Difficulty = "easy" | "exam";

type GeneratedQuestion = {
  id: string;
  index: number;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  subject: string;
  level: string;
  topic: string;
};

interface ExamGeneratorPanelProps {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
}

const QUESTION_TYPES: Array<{ id: QuestionType; label: string; marks: number }> = [
  { id: "short", label: "Short Questions", marks: 10 },
  { id: "long", label: "Long Questions", marks: 25 },
  { id: "mixed", label: "Mixed Exam Questions", marks: 15 },
];

const DIFFICULTIES: Array<{ id: Difficulty; label: string; description: string }> = [
  { id: "easy", label: "Easy", description: "For solidifying the basics" },
  { id: "exam", label: "Exam standard", description: "Exam level difficulty" },
];

function levelLabel(level: string) {
  return level === "OL" ? "Ordinary Level" : "Higher Level";
}

function questionTypeLabel(type: QuestionType) {
  return QUESTION_TYPES.find((option) => option.id === type)?.label ?? "Exam Questions";
}

function buildMockQuestions(input: {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
  type: QuestionType;
  difficulty: Difficulty;
  count: number;
}) {
  const type = QUESTION_TYPES.find((option) => option.id === input.type) ?? QUESTION_TYPES[0];
  return Array.from({ length: input.count }, (_, i): GeneratedQuestion => ({
    id: `${input.subject.id}:${input.level}:${input.topic.id}:${input.type}:${Date.now()}:${i}`,
    index: i + 1,
    type: input.type,
    difficulty: input.difficulty,
    marks: type.marks,
    subject: input.subject.name,
    level: levelLabel(input.level),
    topic: input.topic.name,
  }));
}

export function ExamGeneratorPanel({ subject, level, topic }: ExamGeneratorPanelProps) {
  const contextKey = `${subject.id}:${level}:${topic.id}`;
  const [questionType, setQuestionType] = React.useState<QuestionType>("mixed");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("exam");
  const [count, setCount] = React.useState(3);
  const [includeWorkedSolution, setIncludeWorkedSolution] = React.useState(true);
  const [includeHints, setIncludeHints] = React.useState(true);
  const [generatedSet, setGeneratedSet] = React.useState<{ contextKey: string; questions: GeneratedQuestion[] } | null>(null);
  const generated = generatedSet?.contextKey === contextKey ? generatedSet.questions : [];

  const generate = () => {
    setGeneratedSet({
      contextKey,
      questions: buildMockQuestions({ subject, level, topic, type: questionType, difficulty, count }),
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-[960px] mx-auto px-6 max-sm:px-3 py-7 max-sm:py-5">
        <div className="flex flex-col gap-1.5 mb-5">
          <h2 className="m-0 text-[26px] max-sm:text-[22px] font-semibold tracking-[-0.02em]">
            Exam Question Generator
          </h2>
          <p className="m-0 text-[14px] text-gray-500">
            {subject.name} / {levelLabel(level)} / {topic.name}
          </p>
        </div>

        <QuestionGeneratorControls
          questionType={questionType}
          difficulty={difficulty}
          count={count}
          includeWorkedSolution={includeWorkedSolution}
          includeHints={includeHints}
          onQuestionTypeChange={setQuestionType}
          onDifficultyChange={setDifficulty}
          onCountChange={setCount}
          onWorkedSolutionChange={setIncludeWorkedSolution}
          onHintsChange={setIncludeHints}
          onGenerate={generate}
        />

        <div className="mt-6 flex flex-col gap-3.5">
          {generated.length === 0 ? (
            <div className="border border-dashed border-gray-200 bg-gray-50 rounded-[10px] px-5 py-8 text-center">
              <p className="m-0 text-[15px] font-medium text-gray-800">Generate exam-style questions</p>
              <p className="m-0 mt-1.5 text-[13.5px] text-gray-500">
                Based on your selected subject, level, and topic. Real generation will be wired in later.
              </p>
            </div>
          ) : (
            generated.map((question) => (
              <GeneratedQuestionCard
                key={question.id}
                question={question}
                includeWorkedSolution={includeWorkedSolution}
                includeHints={includeHints}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionGeneratorControls({
  questionType,
  difficulty,
  count,
  includeWorkedSolution,
  includeHints,
  onQuestionTypeChange,
  onDifficultyChange,
  onCountChange,
  onWorkedSolutionChange,
  onHintsChange,
  onGenerate,
}: {
  questionType: QuestionType;
  difficulty: Difficulty;
  count: number;
  includeWorkedSolution: boolean;
  includeHints: boolean;
  onQuestionTypeChange: (type: QuestionType) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onCountChange: (count: number) => void;
  onWorkedSolutionChange: (checked: boolean) => void;
  onHintsChange: (checked: boolean) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="border border-gray-200 bg-white rounded-[10px] p-4 max-sm:p-3.5 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="grid grid-cols-[1.25fr_1fr_150px] max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
        <fieldset className="min-w-0">
          <ControlLabel>Question type</ControlLabel>
          <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
            {QUESTION_TYPES.map((option) => (
              <OptionButton
                key={option.id}
                selected={questionType === option.id}
                onClick={() => onQuestionTypeChange(option.id)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <ControlLabel>Difficulty</ControlLabel>
          <div className="flex flex-col gap-2">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onDifficultyChange(option.id)}
                className={[
                  "text-left rounded-[8px] border px-3 py-2.5 transition-all",
                  difficulty === option.id
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="block text-[13.5px] font-medium">{option.label}</span>
                <span className="block text-[11.5px] text-gray-500 mt-0.5">{option.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="min-w-0">
          <ControlLabel>Number</ControlLabel>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={5}
              value={count}
              onChange={(event) => onCountChange(Math.min(5, Math.max(1, Number(event.target.value) || 1)))}
              className="h-10 w-20 rounded-[8px] border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]"
            />
            <span className="text-[12.5px] text-gray-500">1 to 5</span>
          </div>

          <div className="mt-4">
            <ControlLabel>Include</ControlLabel>
            <div className="flex flex-col gap-2">
              <CheckRow checked={includeWorkedSolution} onChange={onWorkedSolutionChange} label="Worked solution" />
              <CheckRow checked={includeHints} onChange={onHintsChange} label="Hints" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end max-sm:justify-stretch">
        <button
          type="button"
          onClick={onGenerate}
          className="h-10 px-4 rounded-[9px] bg-emerald-500 text-white text-[14px] font-medium hover:bg-emerald-600 transition-colors max-sm:w-full"
        >
          Generate Questions
        </button>
      </div>
    </div>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-gray-400 uppercase tracking-[0.08em] font-mono mb-2">{children}</div>;
}

function OptionButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-10 rounded-[8px] border px-3 py-2 text-left text-[13px] font-medium transition-all",
        selected
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-[13.5px] text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-500"
      />
      {label}
    </label>
  );
}

function GeneratedQuestionCard({
  question,
  includeWorkedSolution,
  includeHints,
}: {
  question: GeneratedQuestion;
  includeWorkedSolution: boolean;
  includeHints: boolean;
}) {
  return (
    <article className="border border-gray-200 bg-white rounded-[10px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-3 max-sm:flex-col">
        <div className="min-w-0">
          <h3 className="m-0 text-[16px] font-semibold text-gray-900">
            Question {question.index}: {questionTypeLabel(question.type)}
          </h3>
          <p className="m-0 mt-1 text-[12.5px] text-gray-500">
            {question.subject} / {question.level} / {question.topic}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-[12px] text-gray-600">
          Approx. {question.marks} marks
        </span>
      </div>

      <p className="mt-4 mb-0 text-[14.5px] leading-relaxed text-gray-800">
        Generated placeholder question for {question.subject} / {question.level} / {question.topic}. Real exam-style
        generation, syllabus retrieval, and marking-scheme alignment will be added later.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CardAction disabled={!includeHints}>Show hint</CardAction>
        <CardAction disabled={!includeWorkedSolution}>Show worked solution</CardAction>
        <CardAction>Save</CardAction>
      </div>
    </article>
  );
}

function CardAction({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "h-8 px-3 rounded-[8px] border text-[12.5px] font-medium transition-colors",
        disabled
          ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
          : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
