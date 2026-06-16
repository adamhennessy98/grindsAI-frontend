import * as React from "react";
import { requestExamQuestions, type ExamQuestionDifficulty, type ExamQuestionType, type GeneratedExamQuestion } from "@/lib/exam-generator";
import { MathMarkdown } from "@/components/math-markdown";
import type { Subject, SubjectTopic } from "@/lib/types";

interface ExamGeneratorPanelProps {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
}

const QUESTION_TYPES: Array<{ id: ExamQuestionType; label: string }> = [
  { id: "short", label: "Short Question" },
  { id: "long", label: "Long Question" },
  { id: "mixed", label: "Mixed Exam Question" },
];

const DIFFICULTIES: Array<{ id: ExamQuestionDifficulty; label: string; description: string }> = [
  { id: "easy", label: "Easy", description: "For solidifying the basics" },
  { id: "exam", label: "Exam standard", description: "Exam level difficulty" },
];

function levelLabel(level: string) {
  return level === "OL" ? "Ordinary Level" : "Higher Level";
}

export function ExamGeneratorPanel({ subject, level, topic }: ExamGeneratorPanelProps) {
  const contextKey = `${subject.id}:${level}:${topic.id}`;
  const [questionType, setQuestionType] = React.useState<ExamQuestionType>("mixed");
  const [difficulty, setDifficulty] = React.useState<ExamQuestionDifficulty>("exam");
  const [includeWorkedSolution, setIncludeWorkedSolution] = React.useState(true);
  const [includeHints, setIncludeHints] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [generatedSet, setGeneratedSet] = React.useState<{ contextKey: string; questions: GeneratedExamQuestion[] } | null>(null);
  const generated = generatedSet?.contextKey === contextKey ? generatedSet.questions : [];

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await requestExamQuestions({
        subjectId: subject.id,
        level,
        topicId: topic.id,
        questionType,
        difficulty,
        count: 1,
        includeHints,
        includeWorkedSolution,
        includeMarkingScheme: false,
      });
      setGeneratedSet({ contextKey, questions: result.questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate questions. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-[960px] mx-auto px-6 max-sm:px-3 py-7 max-sm:py-4">
        <div className="flex flex-col gap-1.5 mb-5 max-sm:mb-4 min-w-0">
          <h2 className="m-0 text-[26px] max-sm:text-[22px] font-semibold tracking-[-0.02em]">
            Exam Question Generator
          </h2>
          <p className="m-0 text-[14px] max-sm:text-[12.5px] text-gray-500 truncate">
            {subject.name} / {levelLabel(level)} / {topic.name}
          </p>
        </div>

        <QuestionGeneratorControls
          questionType={questionType}
          difficulty={difficulty}
          includeWorkedSolution={includeWorkedSolution}
          includeHints={includeHints}
          generating={generating}
          onQuestionTypeChange={setQuestionType}
          onDifficultyChange={setDifficulty}
          onWorkedSolutionChange={setIncludeWorkedSolution}
          onHintsChange={setIncludeHints}
          onGenerate={() => void generate()}
        />

        <div className="mt-6 max-sm:mt-4 flex flex-col gap-3.5 max-sm:gap-3">
          {error && (
            <div className="border border-red-100 bg-red-50 rounded-[10px] px-4 py-3 text-[13.5px] text-red-800">
              {error}
            </div>
          )}

          {generated.length === 0 ? (
            <div className="border border-dashed border-gray-200 bg-gray-50 rounded-[10px] px-5 max-sm:px-4 py-8 max-sm:py-6 text-center">
              <p className="m-0 text-[15px] font-medium text-gray-800">Generate exam-style questions</p>
              <p className="m-0 mt-1.5 text-[13.5px] max-sm:text-[12.5px] text-gray-500">
                Based on your selected subject, level, and topic.
              </p>
            </div>
          ) : (
            generated.map((question, index) => (
              <GeneratedQuestionCard
                key={`${contextKey}:${question.title}:${index}`}
                question={question}
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
  includeWorkedSolution,
  includeHints,
  generating,
  onQuestionTypeChange,
  onDifficultyChange,
  onWorkedSolutionChange,
  onHintsChange,
  onGenerate,
}: {
  questionType: ExamQuestionType;
  difficulty: ExamQuestionDifficulty;
  includeWorkedSolution: boolean;
  includeHints: boolean;
  generating: boolean;
  onQuestionTypeChange: (type: ExamQuestionType) => void;
  onDifficultyChange: (difficulty: ExamQuestionDifficulty) => void;
  onWorkedSolutionChange: (checked: boolean) => void;
  onHintsChange: (checked: boolean) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="border border-gray-200 bg-white rounded-[10px] p-4 max-sm:p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="grid grid-cols-[1.2fr_1fr_170px] max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 max-sm:gap-3">
        <fieldset className="min-w-0">
          <ControlLabel>Question type</ControlLabel>
          <div className="grid grid-cols-2 gap-2 max-[380px]:grid-cols-1 max-sm:gap-1.5">
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
          <div className="flex flex-col gap-2 max-sm:gap-1.5">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onDifficultyChange(option.id)}
                className={[
                  "text-left rounded-[8px] border px-3 py-2.5 max-sm:py-2 transition-all",
                  difficulty === option.id
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="block text-[13.5px] max-sm:text-[13px] font-medium">{option.label}</span>
                <span className="block text-[11.5px] max-sm:text-[11px] text-gray-500 mt-0.5">{option.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="min-w-0">
          <ControlLabel>Include</ControlLabel>
          <div className="flex flex-col gap-2 max-sm:flex-row max-sm:flex-wrap max-sm:gap-x-4 max-sm:gap-y-2">
            <CheckRow checked={includeWorkedSolution} onChange={onWorkedSolutionChange} label="Worked solution" />
            <CheckRow checked={includeHints} onChange={onHintsChange} label="Hints" />
          </div>
        </div>
      </div>

      <div className="mt-4 max-sm:mt-3 flex justify-end max-sm:justify-stretch">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="h-10 px-4 rounded-[9px] bg-emerald-500 text-white text-[14px] font-medium hover:bg-emerald-600 transition-colors max-sm:w-full disabled:cursor-wait disabled:opacity-80 inline-flex items-center justify-center gap-2"
        >
          {generating && (
            <span
              className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin"
              aria-hidden="true"
            />
          )}
          {generating ? "Generating question..." : "Generate Question"}
        </button>
      </div>
    </div>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] max-sm:text-[10.5px] text-gray-400 uppercase tracking-[0.08em] font-mono mb-2 max-sm:mb-1.5">{children}</div>;
}

function OptionButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-10 max-sm:min-h-9 rounded-[8px] border px-3 py-2 max-sm:py-1.5 text-left text-[13px] max-sm:text-[12.5px] font-medium transition-all",
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
    <label className="flex items-center gap-2 text-[13.5px] max-sm:text-[13px] text-gray-700">
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
}: {
  question: GeneratedExamQuestion;
}) {
  const [openSections, setOpenSections] = React.useState({
    hint: false,
    workedSolution: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  return (
    <article className="border border-gray-200 bg-white rounded-[10px] p-4 max-sm:p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-3 max-sm:flex-col">
        <div className="min-w-0">
          <h3 className="m-0 text-[16px] max-sm:text-[15px] font-semibold text-gray-900">
            {question.title}
          </h3>
          <p className="m-0 mt-1 text-[12.5px] max-sm:text-[12px] text-gray-500 break-words">
            {question.subject} / {question.level} / {question.topic}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-[12px] max-sm:text-[11.5px] text-gray-600">
          Approx. {question.marks} marks
        </span>
      </div>

      <MathMarkdown className="mt-4 max-sm:mt-3 text-[14.5px] max-sm:text-[13.5px] leading-relaxed text-gray-800">{question.question}</MathMarkdown>

      <div className="mt-4 max-sm:mt-3 flex flex-col gap-3 max-sm:gap-2.5">
        {question.hint && (
          <QuestionDetail
            title="Hint"
            open={openSections.hint}
            onToggle={() => toggleSection("hint")}
          >
            {question.hint}
          </QuestionDetail>
        )}
        {question.workedSolution && (
          <QuestionDetail
            title="Worked solution"
            open={openSections.workedSolution}
            onToggle={() => toggleSection("workedSolution")}
          >
            {question.workedSolution}
          </QuestionDetail>
        )}
      </div>

      <div className="mt-4 max-sm:mt-3 flex flex-wrap gap-2">
        <CardAction>Save</CardAction>
      </div>
    </article>
  );
}

function QuestionDetail({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: string;
}) {
  const lowerTitle = title.toLowerCase();
  return (
    <section className="rounded-[8px] border border-gray-200 bg-gray-50 px-3 max-sm:px-2.5 py-2.5 max-sm:py-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left text-[12.5px] max-sm:text-[12px] font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>{open ? `Hide ${lowerTitle}` : `Show ${lowerTitle}`}</span>
        <span className="text-[14px] leading-none text-gray-400">{open ? "-" : "+"}</span>
      </button>
      {open && <MathMarkdown className="mt-2 text-[13.5px] max-sm:text-[13px] leading-relaxed text-gray-600">{children}</MathMarkdown>}
    </section>
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
