"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { SUBJECTS } from "@/lib/constants";
import {
  CHALLENGE_OPTIONS,
  YEAR_OPTIONS,
  defaultExamTarget,
  defaultSubjectLevels,
  examOptionsForYear,
  readStudentProfile,
  saveStudentProfile,
  type StudyChallenge,
  type SubjectLevel,
  type YearGroup,
} from "@/lib/onboarding";

const TOTAL_STEPS = 5;

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editMode) return;
    const timer = window.setTimeout(() => {
      const profile = readStudentProfile();
      if (!profile) return;
      setYearGroup(profile.yearGroup);
      setSubjects(profile.subjects);
      setSubjectLevels(profile.subjectLevels);
      setExamTarget(profile.examTarget);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editMode]);

  const examOptions = useMemo(() => (yearGroup ? examOptionsForYear(yearGroup) : []), [yearGroup]);

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

  const canContinue = () => {
    if (step === 1) return yearGroup !== null;
    if (step === 2) return subjects.length > 0;
    if (step === 3) return subjects.length > 0;
    if (step === 4) return Boolean(examTarget);
    return false;
  };

  const finish = (challenge: StudyChallenge) => {
    if (!yearGroup || subjects.length === 0) return;
    setSubmitting(true);
    const levels = { ...defaultSubjectLevels(subjects), ...subjectLevels };
    saveStudentProfile({
      yearGroup,
      subjects,
      subjectLevels: levels,
      examTarget,
      challenge,
      completedAt: new Date().toISOString(),
    });
    router.push("/chat");
    router.refresh();
  };

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
            Step {step} of {TOTAL_STEPS}
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
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <span
              key={index}
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                index + 1 <= step ? "bg-emerald-500" : "bg-gray-200",
              ].join(" ")}
            />
          ))}
        </div>

        {step === 1 && (
          <StepShell
            title="What year are you in?"
            subtitle="This helps us match the pace and depth of your tutor."
          >
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
            subtitle="Pick all that apply — we'll only show these in your sidebar."
          >
            <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-auto pr-0.5">
              {SUBJECTS.map((subject) => {
                const active = subjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={[
                      "px-3 py-2.5 rounded-lg border text-[13px] font-medium text-left transition-all",
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
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50"
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
          <StepShell
            title="When are your exams?"
            subtitle="Sets how urgent your revision plan should feel."
          >
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
            subtitle="This shapes how your tutor helps — tap one to start."
          >
            <div className="flex flex-col gap-2.5">
              {CHALLENGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={submitting}
                  onClick={() => finish(option.id)}
                  className={[choiceCls, choiceIdleCls, "hover:border-emerald-400"].join(" ")}
                >
                  <span className="block text-[14.5px] font-semibold text-gray-900">{option.label}</span>
                  <span className="block mt-0.5 text-[12.5px] text-gray-500">{option.description}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step < 5 && (
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
            <button
              type="button"
              disabled={!canContinue()}
              onClick={() => setStep((current) => current + 1)}
              className="ml-auto h-10 px-5 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)] disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-gray-400 text-center max-w-[360px]">
        {editMode ? "Update your study profile anytime." : "About 60 seconds — no typing required."}
      </p>
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
