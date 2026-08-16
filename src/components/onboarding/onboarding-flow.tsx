"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/icons";
import { SUBJECTS } from "@/lib/constants";
import { subjectThemeStyle } from "@/components/app/subjects";
import { LEARNER_STYLE_OPTIONS, type LearnerStyle } from "@/lib/learning/learner-style";
import {
  YEAR_OPTIONS,
  defaultExamTarget,
  defaultSubjectLevels,
  examOptionsForYear,
  readStudentProfile,
  loadStudentProfile,
  saveStudentProfileLocal,
  saveStudentProfileRemote,
  type SubjectLevel,
  type YearGroup,
  type StudentProfile,
} from "@/lib/onboarding";

/** UI steps: 1–4 Stage 1, 5 Stage 2 (learner style + free text). No Stage 3. */
const STAGE1_LAST = 4;
const STAGE2_STEP = 5;

const choiceCls =
  "w-full text-left px-4 py-3.5 rounded-xl border transition-all disabled:opacity-50";
const choiceActiveCls = "border-emerald-500 bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]";
const choiceIdleCls = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";

export function OnboardingFlow({ editMode = false, nextPath = "/chat" }: { editMode?: boolean; nextPath?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [yearGroup, setYearGroup] = useState<YearGroup | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectLevels, setSubjectLevels] = useState<Record<string, SubjectLevel>>({});
  const [examTarget, setExamTarget] = useState<string>("");
  const [learnerStyle, setLearnerStyle] = useState<LearnerStyle | null>(null);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        try {
          const res = await fetch("/api/learning/learner-style");
          if (res.ok) {
            const body = (await res.json()) as { learnerStyle: LearnerStyle | null };
            if (body.learnerStyle) setLearnerStyle(body.learnerStyle);
          }
        } catch {
          /* ignore */
        }
      })();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editMode]);

  const examOptions = useMemo(() => (yearGroup ? examOptionsForYear(yearGroup) : []), [yearGroup]);
  const stageLabel = step <= STAGE1_LAST ? "1 of 2" : "2 of 2";

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

  const buildProfile = (): StudentProfile | null => {
    if (!yearGroup || subjects.length === 0) return null;
    const levels = { ...defaultSubjectLevels(subjects), ...subjectLevels };
    return {
      yearGroup,
      subjects,
      subjectLevels: levels,
      examTarget,
      // Prefs schema still expects a challenge; default until a later prefs edit collects it.
      challenge: "concepts",
      targetGradeBand: null,
      reasonForUsing: null,
      completedAt: null,
    };
  };

  const canContinue = () => {
    if (step === 1) return yearGroup !== null;
    if (step === 2) return subjects.length > 0;
    if (step === 3) return subjects.length > 0;
    if (step === 4) return Boolean(examTarget);
    if (step === STAGE2_STEP) return learnerStyle !== null;
    return false;
  };

  const finishOnboarding = async () => {
    const profile = buildProfile();
    if (!profile || !learnerStyle) return;
    setSubmitting(true);
    setError(null);
    try {
      const completedAt = new Date().toISOString();
      const complete: StudentProfile = { ...profile, completedAt };

      const prefs = await saveStudentProfileRemote(complete, { markComplete: true });
      if (!prefs.ok) {
        // Still set local cookie so the gate can advance if the server prefs write partially worked.
        saveStudentProfileLocal(complete, { markGateComplete: true });
      }

      const styleRes = await fetch("/api/learning/learner-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerStyle, freeText: freeText.trim() || undefined }),
      });
      if (!styleRes.ok) {
        const payload = (await styleRes.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not save your learner preferences.");
      }

      if (!prefs.ok) {
        // Retry prefs once — style saved; do not leave the account unmarked if possible.
        const retry = await saveStudentProfileRemote(complete, { markComplete: true });
        if (!retry.ok) {
          throw new Error(retry.error ?? prefs.error ?? "Could not finish onboarding. Please try again.");
        }
      }

      window.location.assign(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    if (step === STAGE1_LAST) {
      setSubmitting(true);
      setError(null);
      const profile = buildProfile();
      if (profile) await saveStudentProfileRemote(profile, { markComplete: false });
      setSubmitting(false);
      setStep(STAGE2_STEP);
      return;
    }
    if (step === STAGE2_STEP) {
      await finishOnboarding();
      return;
    }
    setStep((current) => current + 1);
  };

  const finishEdit = async () => {
    const profile = buildProfile();
    if (!profile || !learnerStyle) return;
    setSubmitting(true);
    setError(null);
    try {
      profile.completedAt = new Date().toISOString();
      await saveStudentProfileRemote(profile, { markComplete: true });
      await fetch("/api/learning/learner-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerStyle, freeText: freeText.trim() || undefined }),
      });
      router.push("/chat");
      router.refresh();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-5 pt-8 pb-8">
      <Link href="/" className="mb-6 inline-flex items-center" aria-label="GrindsAI home">
        <BrandLogo height={42} />
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
          {Array.from({ length: 2 }, (_, index) => {
            const stageNum = index + 1;
            const filled =
              (stageNum === 1 && step <= STAGE1_LAST) ||
              (stageNum === 2 && step === STAGE2_STEP) ||
              stageNum < (step <= STAGE1_LAST ? 1 : 2);
            return (
              <span
                key={index}
                className={[
                  "h-1 flex-1 rounded-full transition-colors",
                  filled ? "bg-emerald-500" : "bg-gray-200",
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

        {step === STAGE2_STEP && (
          <StepShell
            title="How do you learn best?"
            subtitle="Self-report only — shapes how your tutor talks to you, never used as proof of ability."
          >
            <div className="flex flex-col gap-2.5">
              {LEARNER_STYLE_OPTIONS.map((option) => {
                const active = learnerStyle === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLearnerStyle(option.id)}
                    className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
                  >
                    <span className="block text-[14.5px] font-semibold text-gray-900">{option.label}</span>
                    <span className="block mt-0.5 text-[12.5px] text-gray-500">{option.description}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <p className="text-[12.5px] text-gray-500 mb-1.5">
                Anything else we should know? (optional)
              </p>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder='e.g. "I get anxious before tests" or "fractions were never explained properly"'
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </StepShell>
        )}

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
          {editMode && step === STAGE2_STEP ? (
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
              {submitting
                ? "…"
                : step === STAGE2_STEP
                  ? "Finish & go to chat"
                  : step === STAGE1_LAST
                    ? "Continue"
                    : "Continue"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-gray-400 text-center max-w-[360px]">
        {editMode
          ? "Update your study prefs anytime."
          : step === STAGE2_STEP
            ? "Almost done — then you're into the app."
            : "A couple of minutes to set up your subjects."}
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
