"use client";

import { useEffect, useRef, useState } from "react";
import { SUBJECTS } from "@/lib/constants";

type PublicQuestion = {
  id: string;
  subjectId: string;
  kcId: string;
  strandLabel: string;
  prompt: string;
  choices: { id: string; label: string }[];
};

const choiceCls =
  "w-full text-left px-4 py-3 rounded-xl border transition-all disabled:opacity-50";
const choiceActiveCls = "border-emerald-500 bg-emerald-50/80";
const choiceIdleCls = "border-gray-200 bg-white hover:border-gray-300";

/**
 * Optional first-open quick check for a subject (2 content questions).
 * Skippable. Writes subject_diagnostic events — never blocks the workspace.
 */
export function SubjectQuickCheck({
  subjectId,
  onDone,
}: {
  subjectId: string;
  onDone: () => void;
}) {
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setOpen(false);
      setQuestions([]);
      setAnswers({});
      setQIndex(0);
      setError(null);
      try {
        const res = await fetch(
          `/api/learning/subject-diagnostic?subjectId=${encodeURIComponent(subjectId)}`,
        );
        if (!res.ok || cancelled) return;
        const body = (await res.json()) as {
          questions: PublicQuestion[];
          alreadyDone: boolean;
        };
        if (cancelled) return;
        if (body.alreadyDone || body.questions.length < 2) {
          onDoneRef.current();
          return;
        }
        setQuestions(body.questions);
        setOpen(true);
      } catch {
        if (!cancelled) onDoneRef.current();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
  const current = questions[qIndex];
  const allAnswered =
    questions.length > 0 && questions.every((q) => Boolean(answers[q.id]));

  const skip = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await fetch("/api/learning/subject-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, action: "skip" }),
      });
    } catch {
      /* still dismiss */
    }
    setOpen(false);
    setSubmitting(false);
    onDoneRef.current();
  };

  const finish = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/learning/subject-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          action: "complete",
          answers: questions.map((q) => ({
            questionId: q.id,
            choiceId: answers[q.id],
          })),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not save quick check.");
      }
      setOpen(false);
      onDoneRef.current();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !current) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-quick-check-title"
        className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)] sm:p-6"
      >
        <p className="m-0 text-[11px] font-mono uppercase tracking-[0.08em] text-gray-400">
          Optional · {subjectName}
        </p>
        <h2 id="subject-quick-check-title" className="mt-1 mb-1 text-[18px] font-semibold text-gray-900">
          Quick check
        </h2>
        <p className="m-0 mb-4 text-[13px] text-gray-500">
          Two short questions — no hints. Skip anytime; this only helps calibrate what to practise.
        </p>

        <p className="mb-2 text-[12px] font-medium text-gray-400">
          Question {qIndex + 1} of {questions.length} · {current.strandLabel}
        </p>
        <p className="mb-3 text-[15px] font-medium text-gray-900">{current.prompt}</p>
        <div className="flex flex-col gap-2">
          {current.choices.map((choice) => {
            const active = answers[current.id] === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                disabled={submitting}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [current.id]: choice.id }));
                  if (qIndex < questions.length - 1) {
                    window.setTimeout(() => setQIndex((i) => i + 1), 160);
                  }
                }}
                className={[choiceCls, active ? choiceActiveCls : choiceIdleCls].join(" ")}
              >
                <span className="text-[14px] text-gray-900">{choice.label}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void skip()}
            className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Skip for now
          </button>
          {qIndex > 0 && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => setQIndex((i) => i - 1)}
              className="h-10 px-3 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            disabled={!allAnswered || submitting}
            onClick={() => void finish()}
            className="ml-auto h-10 px-4 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
