"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { SUBJECTS } from "@/lib/constants";
import { subjectThemeStyle } from "@/components/app/subjects";
import {
  CHALLENGE_OPTIONS,
  GRADE_BAND_OPTIONS,
  YEAR_OPTIONS,
  defaultExamTarget,
  defaultSubjectLevels,
  examOptionsForYear,
  readStudentProfile,
  loadStudentProfile,
  saveStudentProfileRemote,
  type StudyChallenge,
  type SubjectLevel,
  type TargetGradeBand,
  type YearGroup,
  type StudentProfile,
} from "@/lib/onboarding";

type PublicQuestion = {
  id: string;
  subjectId: string;
  kcId: string;
  strandLabel: string;
  prompt: string;
  choices: { id: string; label: string }[];
};

/** UI steps: 1–4 Stage1, 5–7 Stage2, 8 Stage3 diagnostic. */
const STAGE1_LAST = 4;
const STAGE2_LAST = 7;
const DIAGNOSTIC_STEP = 8;

const choiceCls =
  "w-full text-left px-4 py-3.5 rounded-xl border transition-all disabled:opacity-50";
const choiceActiveCls = "border-emerald-500 bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]";
const choiceIdleCls = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";

export function OnboardingFlow({ editMode = false }: { editMode?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [yearGroup, setYearGroup] = useState<YearGroup | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectLevels, setSubjectLevels] = useState<Record<string, SubjectLevel>>({});
  const [examTarget, setExamTarget] = useState<string>("");
  const [challenge, setChallenge] = useState<StudyChallenge | null>(null);
  const [gradeBand, setGradeBand] = useState<TargetGradeBand | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");

  useEffect(() => {
    if (!editMode) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        const profile = (await loadStudentProfile()) ?? readStudentProfile();
        if (!profile) return;
        setYearGroup(profile.yearGroup);
        setSubjects(profile.subjects);
        setSubjectLevels(profile.subjectLevels);
        setExamTarget(profile.examTarget);
        setChallenge(profile.challenge);
        setGradeBand(profile.targetGradeBand ?? null);
        setReason(profile.reasonForUsing ?? "");
      })();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editMode]);

  const examOptions = useMemo(() => (yearGroup ? examOptionsForYear(yearGroup) : []), [yearGroup]);

  const stageLabel = step <= STAGE1_LAST ? "1 of 3" : step <= STAGE2_LAST ? "2 of 3" : "3 of 3";

  const selectYear = (value: YearGroup) => {
    setYearGroup(value);
    setExamTarget(defaultExamTarget(value));
  };

  const toggleSubject = (id: string) => {
    setSubjects((current) => {
      if (current.includes(id)) {
        const next = current.filter((subjectId) => subjectId !== id);
        setSubjectLevels((levels) => {
          const copy = { ...levels };
          delete copy[id];
          return copy;
        });
        return next;
      }
      setSubjectLevels((levels) => ({ ...levels, [id]: levels[id] ?? "HL" }));
      return [...current, id];
    });
  };

  const setLevel = (id: string, level: SubjectLevel) => {
    setSubjectLevels((levels) => ({ ...levels, [id]: level }));
  };

  const buildPartialProfile = (opts?: { withChallenge?: boolean }): StudentProfile | null => {
    if (!yearGroup || subjects.length === 0) return null;
    const levels = { ...defaultSubjectLevels(subjects), ...subjectLevels };
    return {
      yearGroup,
      subjects,
      subjectLevels: levels,
      examTarget,
      challenge: (opts?.withChallenge ? challenge : challenge) ?? "concepts",
      targetGradeBand: gradeBand,
      reasonForUsing: reason.trim() || null,
      completedAt: null,
    };
  };

  const canContinue = () => {
    if (step === 1) return yearGroup !== null;
    if (step === 2) return subjects.length > 0;
    if (step === 3) return subjects.length > 0;
    if (step === 4) return Boolean(examTarget);
    if (step === 5) return challenge !== null;
    if (step === 6) return gradeBand !== null;
    if (step === 7) return true;
    if (step === DIAGNOSTIC_STEP) {
      return questions.length > 0 && Object.keys(answers).length === questions.length;
    }
    return false;
  };

  const saveStagePrefs = async (markComplete = false) => {
    const profile = buildPartialProfile({ withChallenge: true });
    if (!profile) return;
    if (markComplete) {
      profile.completedAt = new Date().toISOString();
    }
    await saveStudentProfileRemote(profile, { markComplete });
  };

  const goNext = async () => {
    if (step === STAGE1_LAST) {
      setSubmitting(true);
      await saveStagePrefs(false);
      setSubmitting(false);
      setStep(5);
      return;
    }
    if (step === STAGE2_LAST) {
      setSubmitting(true);
      await saveStagePrefs(false);
      try {
        const res = await fetch(
          `/api/learning/diagnostic?subjects=${encodeURIComponent(subjects.join(","))}`,
        );
        if (!res.ok) throw new Error("Could not load diagnostic");
        const body = (await res.json()) as { questions: PublicQuestion[] };
        setQuestions(body.questions);
        setAnswers({});
        setQIndex(0);
        setStep(DIAGNOSTIC_STEP);
      } catch {
        setDiagError("Could not load the quick check. Try again.");
      }
      setSubmitting(false);
      return;
    }
    setStep((current) => current + 1);
  };

  const finishDiagnostic = async () => {
    const profile = buildPartialProfile({ withChallenge: true });
    if (!profile || !challenge) return;
    setSubmitting(true);
    setDiagError(null);
    try {
      const res = await fetch("/api/learning/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { ...profile, challenge },
          answers: questions.map((q) => ({
            questionId: q.id,
            choiceId: answers[q.id],
            subjectId: q.subjectId,
            kcId: q.kcId,
            correctChoiceId: "",
          })),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Diagnostic failed");
      }
      const body = (await res.json()) as { completedAt: string };
      const complete: StudentProfile = {
        ...profile,
        challenge,
        completedAt: body.completedAt,
      };
      // Cookie + local cache
      await saveStudentProfileRemote(complete, { markComplete: true });

      if (freeText.trim()) {
        void fetch("/api/learning/free-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: freeText.trim() }),
        });
      }

      router.push("/chat");
      router.refresh();
    } catch (err) {
      setDiagError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  const finishEdit = async () => {
    if (!yearGroup || !challenge) return;
    setSubmitting(true);
    const profile = buildPartialProfile({ withChallenge: true });
    if (!profile) return;
    profile.completedAt = new Date().toISOString();
    await saveStudentProfileRemote(profile, { markComplete: true });
    router.push("/chat");
    router.refresh();
  };

  const currentQ = questions[qIndex];
  const totalUiSteps = editMode ? STAGE2_LAST : DIAGNOSTIC_STEP;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-5 pt-8 pb-8">
      <Link href="/" className="flex items-center gap-2.5 mb-6">
        <LogoIcon size={32} />
        <span className="text-[18px] font-semibold tracking-[-0.01em]">GrindsAI</span>
      </Link>

      <div
        className="animate-fade-up w-full max-w-[520px] bg-white border border-gray-200 rounded-2xl p-6 sm:p-7"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.08)" }}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-mono text-gray-400 m-0">
            {editMode ? "Edit profile" : `Stage ${stageLabel}`}
          </p>
          {editMode && (
            <button
              type="button"
              onClick={() => router.push("/chat")}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: editMode ? STAGE2_LAST : 3 }, (_, index) => {
            const stageNum = index + 1;
            const active =
              editMode
                ? index + 1 <= step
                : (stageNum === 1 && step <= STAGE1_LAST) ||
                  (stageNum === 2 && step > STAGE1_LAST && step <= STAGE2_LAST) ||
                  (stageNum === 3 && step === DIAGNOSTIC_STEP) ||
                  (stageNum < (step <= STAGE1_LAST ? 1 : step <= STAGE2_LAST ? 2 : 3));
            const filled =
              editMode
                ? index + 1 < step || (index + 1 === step)
                : stageNum < (step <= STAGE1_LAST ? 1 : step <= STAGE2_LAST ? 2 : 3) ||
                  (stageNum === (step <= STAGE1_LAST ? 1 : step <= STAGE2_LAST ? 2 : 3));
            return (
              <span
                key={index}
                className={[
                  "h-1 flex-1 rounded-full transition-colors",
                  filled || active ? "bg-emerald-500" : "bg-gray-200",
                ].join(" ")}
              />
            );
          })}
        </div>

        {step === 1 && (
          <StepShell title="What year are you in?" subtitle="Sets the pace — not a judgement of ability.">
            <div className="flex flex-col gap-2.5">
              {YEAR_OPTIONS.map((option) => {
                const active = yearGroup === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectYear(option.id)}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="block text-[15px] font-semibold text-gray-900">{option.label}</span>
                    <span className="block mt-0.5 text-[13px] text-gray-500">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title="Which subjects do you take?"
            subtitle="Pick all that apply — we'll only show these on your home screen."
          >
            <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-auto pr-0.5">
              {SUBJECTS.map((subject) => {
                const active = subjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    style={subjectThemeStyle(subject.id, active ? subjects : [...subjects, subject.id])}
                    data-selected={active}
                    className={[
                      "subject-selection px-3 py-2.5 rounded-lg border text-[13px] font-medium text-left transition-all",
                      active
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                    ].join(" ")}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[12.5px] text-gray-500">
              {subjects.length === 0 ? "Select at least one subject" : `${subjects.length} selected`}
            </p>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="What level for each subject?"
            subtitle="Higher or Ordinary — this sets which papers and marking schemes we use."
          >
            <div className="flex flex-col gap-2 max-h-[340px] overflow-auto">
              {subjects.map((id) => {
                const subject = SUBJECTS.find((item) => item.id === id);
                const level = subjectLevels[id] ?? "HL";
                return (
                  <div
                    key={id}
                    style={subjectThemeStyle(id, subjects)}
                    className="subject-selection-level flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50"
                  >
                    <span className="text-[13.5px] font-medium text-gray-900 truncate">{subject?.name ?? id}</span>
                    <div className="grid grid-cols-2 gap-1 p-0.5 bg-white border border-gray-200 rounded-lg shrink-0">
                      {(["HL", "OL"] as const).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setLevel(id, key)}
                          className={[
                            "px-3 py-1.5 text-[12px] rounded-md transition-all",
                            level === key
                              ? "bg-emerald-500 text-white font-medium"
                              : "text-gray-500 hover:bg-gray-50",
                          ].join(" ")}
                        >
                          {key === "HL" ? "Higher" : "Ordinary"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="When are your exams?" subtitle="Sets how urgent your revision plan should feel.">
            <div className="flex flex-col gap-2.5">
              {examOptions.map((option) => {
                const active = examTarget === option.label;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setExamTarget(option.label)}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="block text-[15px] font-semibold text-gray-900">{option.label}</span>
                    <span className="block mt-0.5 text-[13px] text-gray-500">Leaving Certificate written exams</span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell
            title="What's your biggest challenge right now?"
            subtitle="Self-report only — this shapes tone, not your mastery scores."
          >
            <div className="flex flex-col gap-2.5">
              {CHALLENGE_OPTIONS.map((option) => {
                const active = challenge === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setChallenge(option.id)}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="block text-[14.5px] font-semibold text-gray-900">{option.label}</span>
                    <span className="block mt-0.5 text-[12.5px] text-gray-500">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell
            title="What grade band are you aiming for?"
            subtitle="A goal, not a prediction — never used as proof of what you know."
          >
            <div className="flex flex-col gap-2.5">
              {GRADE_BAND_OPTIONS.map((option) => {
                const active = gradeBand === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setGradeBand(option.id)}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="block text-[14.5px] font-semibold text-gray-900">{option.label}</span>
                    <span className="block mt-0.5 text-[12.5px] text-gray-500">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 7 && (
          <StepShell
            title="Anything else we should know?"
            subtitle="Optional. You can also add notes anytime later — they never change mastery scores directly."
          >
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="e.g. I'm repeating because I froze in June…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            {!editMode && (
              <div className="mt-4">
                <p className="text-[12.5px] text-gray-500 mb-1.5">
                  Optional free note (anxiety, gaps in teaching, etc.)
                </p>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  rows={2}
                  maxLength={1000}
                  placeholder='e.g. "I get anxious before tests" or "nobody explained fractions properly"'
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            )}
          </StepShell>
        )}

        {step === DIAGNOSTIC_STEP && currentQ && (
          <StepShell
            title="Quick check — no hints"
            subtitle={`Question ${qIndex + 1} of ${questions.length} · ${SUBJECTS.find((s) => s.id === currentQ.subjectId)?.name ?? currentQ.subjectId} · ${currentQ.strandLabel}`}
          >
            <p className="text-[15px] text-gray-900 font-medium mb-4">{currentQ.prompt}</p>
            <div className="flex flex-col gap-2.5">
              {currentQ.choices.map((choice) => {
                const active = answers[currentQ.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: choice.id }));
                      if (qIndex < questions.length - 1) {
                        window.setTimeout(() => setQIndex((i) => i + 1), 180);
                      }
                    }}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="text-[14px] text-gray-900">{choice.label}</span>
                  </button>
                );
              })}
            </div>
            {diagError && <p className="mt-3 text-sm text-red-600">{diagError}</p>}
            <div className="mt-4 flex gap-2">
              {qIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setQIndex((i) => i - 1)}
                  className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>
          </StepShell>
        )}

        {step < DIAGNOSTIC_STEP && (
          <div className="mt-6 flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {editMode && step === STAGE2_LAST ? (
              <button
                type="button"
                disabled={!canContinue() || submitting}
                onClick={() => void finishEdit()}
                className="ml-auto h-10 px-5 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinue() || submitting}
                onClick={() => void goNext()}
                className="ml-auto h-10 px-5 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)] disabled:shadow-none"
              >
                {submitting ? "…" : step === STAGE2_LAST ? "Start quick check" : "Continue"}
              </button>
            )}
          </div>
        )}

        {step === DIAGNOSTIC_STEP && (
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(STAGE2_LAST)}
              className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!canContinue() || submitting}
              onClick={() => void finishDiagnostic()}
              className="ml-auto h-10 px-5 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Finishing…" : "Finish & go to chat"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-gray-400 text-center max-w-[360px]">
        {editMode
          ? "Update your study prefs anytime."
          : step === DIAGNOSTIC_STEP
            ? "Answer honestly — no hints. This is only a light baseline."
            : "A few minutes — Stage 3 is a short check across your subjects."}
      </p>
      {/* silence unused */}
      <span className="hidden">{totalUiSteps}</span>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-[-0.015em] m-0">{title}</h1>
      <p className="mt-1.5 mb-5 text-gray-500 text-sm">{subtitle}</p>
      {children}
    </div>
  );
}
