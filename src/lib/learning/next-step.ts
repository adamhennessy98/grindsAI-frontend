import type { SupabaseClient } from "@supabase/supabase-js";
import { getTopic } from "@/lib/constants";
import {
  examCountdownShort,
  examUrgencyScore,
  listExamSchedule,
  scheduleBySubject,
  type ExamScheduleEntry,
} from "@/lib/learning/exam-schedule";
import { getLearningProfile } from "@/lib/learning/profile";

export type NextStepFeature = "tutor" | "questions" | "progress" | "topic-check";

export type NextStep = {
  subjectId: string;
  topicId: string;
  title: string;
  reason: string;
  cta: string;
  feature: "tutor" | "questions" | "progress";
  /** What the UI should open. */
  action: "tutor" | "topic-check" | "questions" | "progress";
  lastSummary: string | null;
  source: "check_queue" | "weak_kc" | "last_session" | "fallback";
  /** Soft urgency from student exam calendar; null if no date. */
  examInDays: number | null;
  examBadge: string | null;
};

type QueueRow = {
  kc_id: string;
  subject_id: string;
  reason: string | null;
};

type SessionRow = {
  subject_id: string;
  topic_id: string;
  summary_line: string | null;
  kc_ids: string[] | null;
  ended_at: string | null;
};

type Candidate = NextStep & { urgency: number };

function topicLabel(subjectId: string, topicId: string) {
  return getTopic(subjectId, topicId).name;
}

function withExamHint(
  step: Omit<NextStep, "examInDays" | "examBadge">,
  exam: ExamScheduleEntry | undefined,
): NextStep {
  const examInDays = exam?.daysUntil ?? null;
  // Keep reason clean — UI shows countdown as a pill, not repeated prose.
  return {
    ...step,
    examInDays,
    examBadge: examCountdownShort(examInDays),
  };
}

function pickMostUrgent(candidates: Candidate[]): NextStep | null {
  if (!candidates.length) return null;
  const sorted = [...candidates].sort((a, b) => b.urgency - a.urgency);
  const { urgency, ...step } = sorted[0];
  void urgency;
  return step;
}

/**
 * Pick a gentle next step from structured learning state only —
 * never from raw chat transcripts. Softly prefers nearer exams within each tier.
 */
export async function getRecommendedNextStep(
  supabase: SupabaseClient,
  userId: string,
  subjectId?: string | null,
): Promise<NextStep> {
  const profile = await getLearningProfile(supabase, userId);
  const subjects = subjectId
    ? [subjectId]
    : profile.prefs?.subjects?.length
      ? profile.prefs.subjects
      : [];

  let schedule: Awaited<ReturnType<typeof listExamSchedule>> = [];
  try {
    schedule = await listExamSchedule(supabase, userId);
  } catch (err) {
    console.warn("[next-step] exam schedule unavailable:", err);
  }
  const bySubject = scheduleBySubject(schedule);

  const { data: queueRows } = await supabase
    .from("kc_check_queue")
    .select("kc_id, subject_id, reason")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  const queue = ((queueRows ?? []) as QueueRow[]).filter((row) =>
    subjects.length ? subjects.includes(row.subject_id) : true,
  );

  const queuePick = pickMostUrgent(
    queue.map((row) => {
      const meta = profile.strugglingKcs.find((k) => k.kcId === row.kc_id);
      const topicId = meta?.strandTopicId ?? "general";
      const sid = row.subject_id;
      const label = meta?.label ?? topicLabel(sid, topicId);
      const exam = bySubject.get(sid);
      return {
        ...withExamHint(
          {
            subjectId: sid,
            topicId,
            title: `Check ${label}`,
            reason: row.reason?.trim() || "Something on your check queue needs a quick look.",
            cta: "Start Topic Check",
            feature: "tutor",
            action: "topic-check",
            lastSummary: null,
            source: "check_queue",
          },
          exam,
        ),
        urgency: examUrgencyScore(exam?.daysUntil ?? null),
      };
    }),
  );
  if (queuePick) return queuePick;

  const weakPool = profile.strugglingKcs.filter((k) =>
    subjects.length ? subjects.includes(k.subjectId) : true,
  );
  const weakPick = pickMostUrgent(
    weakPool.map((weak) => {
      const exam = bySubject.get(weak.subjectId);
      return {
        ...withExamHint(
          {
            subjectId: weak.subjectId,
            topicId: weak.strandTopicId || "general",
            title: `Revisit ${weak.label}`,
            reason: "Based on recent graded practice — this area still looks shaky.",
            cta: "Continue with Tutor",
            feature: "tutor",
            action: "tutor",
            lastSummary: null,
            source: "weak_kc",
          },
          exam,
        ),
        urgency: examUrgencyScore(exam?.daysUntil ?? null),
      };
    }),
  );
  if (weakPick) return weakPick;

  let sessionQuery = supabase
    .from("study_sessions")
    .select("subject_id, topic_id, summary_line, kc_ids, ended_at")
    .eq("user_id", userId)
    .eq("status", "ended")
    .order("ended_at", { ascending: false })
    .limit(8);
  if (subjectId) sessionQuery = sessionQuery.eq("subject_id", subjectId);

  const { data: sessions } = await sessionQuery;
  const sessionPick = pickMostUrgent(
    ((sessions ?? []) as SessionRow[])
      .filter((row) => (subjects.length ? subjects.includes(row.subject_id) : true))
      .map((last) => {
        const sid = last.subject_id;
        const topicId = last.topic_id || "general";
        const name = topicLabel(sid, topicId);
        const exam = bySubject.get(sid);
        return {
          ...withExamHint(
            {
              subjectId: sid,
              topicId,
              title: `Continue ${name}`,
              reason: last.summary_line?.trim() || "Pick up from your last short session.",
              cta: "Continue",
              feature: "tutor",
              action: "tutor",
              lastSummary: last.summary_line?.trim() || null,
              source: "last_session",
            },
            exam,
          ),
          urgency: examUrgencyScore(exam?.daysUntil ?? null),
        };
      }),
  );
  if (sessionPick) return sessionPick;

  const fallbackSubjects = subjects.length ? subjects : ["maths"];
  const fallbackSorted = [...fallbackSubjects].sort((a, b) => {
    const ua = examUrgencyScore(bySubject.get(a)?.daysUntil ?? null);
    const ub = examUrgencyScore(bySubject.get(b)?.daysUntil ?? null);
    return ub - ua;
  });
  const fallbackSubject = subjectId || fallbackSorted[0] || "maths";
  const exam = bySubject.get(fallbackSubject);
  return withExamHint(
    {
      subjectId: fallbackSubject,
      topicId: "general",
      title: "Start a short Tutor session",
      reason: "No mastery signals yet — a quick explain or paste-a-question sitting is a good start.",
      cta: "Ask your Tutor",
      feature: "tutor",
      action: "tutor",
      lastSummary: null,
      source: "fallback",
    },
    exam,
  );
}
