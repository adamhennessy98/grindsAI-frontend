import * as React from "react";
import { requestExamQuestions, type ExamQuestionDifficulty, type ExamQuestionType, type GeneratedExamQuestion } from "@/lib/exam-generator";
import type { Subject, SubjectTopic } from "@/lib/types";

interface ExamGeneratorPanelProps {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
}

const QUESTION_TYPES: Array<{ id: ExamQuestionType; label: string }> = [
  { id: "short", label: "Short Questions" },
  { id: "long", label: "Long Questions" },
  { id: "mixed", label: "Mixed Exam Questions" },
];

const DIFFICULTIES: Array<{ id: ExamQuestionDifficulty; label: string; description: string }> = [
  { id: "easy", label: "Easy", description: "For solidifying the basics" },
  { id: "exam", label: "Exam standard", description: "Exam level difficulty" },
];

const MAX_QUESTIONS = 3;

function levelLabel(level: string) {
  return level === "OL" ? "Ordinary Level" : "Higher Level";
}

export function ExamGeneratorPanel({ subject, level, topic }: ExamGeneratorPanelProps) {
  const contextKey = `${subject.id}:${level}:${topic.id}`;
  const [questionType, setQuestionType] = React.useState<ExamQuestionType>("mixed");
  const [difficulty, setDifficulty] = React.useState<ExamQuestionDifficulty>("exam");
  const [count, setCount] = React.useState(3);
  const [includeWorkedSolution, setIncludeWorkedSolution] = React.useState(true);
  const [includeHints, setIncludeHints] = React.useState(true);
  const [includeMarkingScheme, setIncludeMarkingScheme] = React.useState(false);
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
        count,
        includeHints,
        includeWorkedSolution,
        includeMarkingScheme,
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
          includeMarkingScheme={includeMarkingScheme}
          generating={generating}
          onQuestionTypeChange={setQuestionType}
          onDifficultyChange={setDifficulty}
          onCountChange={setCount}
          onWorkedSolutionChange={setIncludeWorkedSolution}
          onHintsChange={setIncludeHints}
          onMarkingSchemeChange={setIncludeMarkingScheme}
          onGenerate={() => void generate()}
        />

        <div className="mt-6 flex flex-col gap-3.5">
          {error && (
            <div className="border border-red-100 bg-red-50 rounded-[10px] px-4 py-3 text-[13.5px] text-red-800">
              {error}
            </div>
          )}

          {generated.length === 0 ? (
            <div className="border border-dashed border-gray-200 bg-gray-50 rounded-[10px] px-5 py-8 text-center">
              <p className="m-0 text-[15px] font-medium text-gray-800">Generate exam-style questions</p>
              <p className="m-0 mt-1.5 text-[13.5px] text-gray-500">
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
  count,
  includeWorkedSolution,
  includeHints,
  includeMarkingScheme,
  generating,
  onQuestionTypeChange,
  onDifficultyChange,
  onCountChange,
  onWorkedSolutionChange,
  onHintsChange,
  onMarkingSchemeChange,
  onGenerate,
}: {
  questionType: ExamQuestionType;
  difficulty: ExamQuestionDifficulty;
  count: number;
  includeWorkedSolution: boolean;
  includeHints: boolean;
  includeMarkingScheme: boolean;
  generating: boolean;
  onQuestionTypeChange: (type: ExamQuestionType) => void;
  onDifficultyChange: (difficulty: ExamQuestionDifficulty) => void;
  onCountChange: (count: number) => void;
  onWorkedSolutionChange: (checked: boolean) => void;
  onHintsChange: (checked: boolean) => void;
  onMarkingSchemeChange: (checked: boolean) => void;
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
              max={MAX_QUESTIONS}
              value={count}
              onChange={(event) => onCountChange(Math.min(MAX_QUESTIONS, Math.max(1, Number(event.target.value) || 1)))}
              className="h-10 w-20 rounded-[8px] border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]"
            />
            <span className="text-[12.5px] text-gray-500">1 to 3</span>
          </div>

          <div className="mt-4">
            <ControlLabel>Include</ControlLabel>
            <div className="flex flex-col gap-2">
              <CheckRow checked={includeWorkedSolution} onChange={onWorkedSolutionChange} label="Worked solution" />
              <CheckRow checked={includeHints} onChange={onHintsChange} label="Hints" />
              <CheckRow checked={includeMarkingScheme} onChange={onMarkingSchemeChange} label="Marking scheme" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end max-sm:justify-stretch">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="h-10 px-4 rounded-[9px] bg-emerald-500 text-white text-[14px] font-medium hover:bg-emerald-600 transition-colors max-sm:w-full"
        >
          {generating ? "Generating..." : "Generate Questions"}
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
}: {
  question: GeneratedExamQuestion;
}) {
  const [openSections, setOpenSections] = React.useState({
    hint: false,
    workedSolution: false,
    markingScheme: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  return (
    <article className="border border-gray-200 bg-white rounded-[10px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-3 max-sm:flex-col">
        <div className="min-w-0">
          <h3 className="m-0 text-[16px] font-semibold text-gray-900">
            {question.title}
          </h3>
          <p className="m-0 mt-1 text-[12.5px] text-gray-500">
            {question.subject} / {question.level} / {question.topic}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-[12px] text-gray-600">
          Approx. {question.marks} marks
        </span>
      </div>

      <p className="mt-4 mb-0 whitespace-pre-line text-[14.5px] leading-relaxed text-gray-800">
        {question.question}
      </p>

      <div className="mt-4 flex flex-col gap-3">
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
        {question.markingScheme && (
          <QuestionDetail
            title="Marking scheme"
            open={openSections.markingScheme}
            onToggle={() => toggleSection("markingScheme")}
          >
            {question.markingScheme}
          </QuestionDetail>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
  children: React.ReactNode;
}) {
  const lowerTitle = title.toLowerCase();
  return (
    <section className="rounded-[8px] border border-gray-200 bg-gray-50 px-3 py-2.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left text-[12.5px] font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>{open ? `Hide ${lowerTitle}` : `Show ${lowerTitle}`}</span>
        <span className="text-[14px] leading-none text-gray-400">{open ? "-" : "+"}</span>
      </button>
      {open && <p className="m-0 mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-gray-600">{children}</p>}
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
