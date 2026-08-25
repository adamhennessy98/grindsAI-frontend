import type { SupabaseClient } from "@supabase/supabase-js";

export type ExamScheduleEntry = {
  id: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  paperLabel: string | null;
  level: "HL" | "OL" | null;
  daysUntil: number | null;
};

export type ExamScheduleInput = {
  subjectId: string;
  examDate: string;
  paperLabel?: string | null;
  level?: "HL" | "OL" | null;
};

function daysUntilDate(isoDate: string, now = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const exam = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.round((exam.getTime() - today.getTime()) / 86_400_000);
}

export function examUrgencyLabel(daysUntil: number | null): string | null {
  if (daysUntil === null) return null;
  if (daysUntil < 0) return "Exam date passed";
  if (daysUntil === 0) return "Exam today";
  if (daysUntil === 1) return "Exam tomorrow";
  return `Exam in ${daysUntil} days`;
}

/** Compact data label for UI pills — e.g. `280d`, `1d`, `today`. */
export function examCountdownShort(daysUntil: number | null): string | null {
  if (daysUntil === null) return null;
  if (daysUntil < 0) return "passed";
  if (daysUntil === 0) return "today";
  return `${daysUntil}d`;
}

/** Soft boost for recommendation scoring (0–40). Past / missing = 0. */
export function examUrgencyScore(daysUntil: number | null): number {
  if (daysUntil === null || daysUntil < 0) return 0;
  if (daysUntil <= 7) return 40;
  if (daysUntil <= 14) return 30;
  if (daysUntil <= 30) return 20;
  if (daysUntil <= 60) return 10;
  return 5;
}

export async function listExamSchedule(
  supabase: SupabaseClient,
  userId: string,
): Promise<ExamScheduleEntry[]> {
  const { data, error } = await supabase
    .from("student_exam_schedule")
    .select("id, subject_id, exam_date, paper_label, level")
    .eq("user_id", userId)
    .order("exam_date", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => {
    const examDate = String(row.exam_date).slice(0, 10);
    return {
      id: row.id as string,
      subjectId: row.subject_id as string,
      examDate,
      paperLabel: (row.paper_label as string | null) ?? null,
      level: (row.level as "HL" | "OL" | null) ?? null,
      daysUntil: daysUntilDate(examDate),
    };
  });
}

/** Replace schedule for the given subjects (upsert + delete cleared ones). */
export async function saveExamSchedule(
  supabase: SupabaseClient,
  userId: string,
  entries: ExamScheduleInput[],
): Promise<ExamScheduleEntry[]> {
  const cleaned = entries
    .map((entry) => ({
      subjectId: entry.subjectId.trim(),
      examDate: entry.examDate.trim(),
      paperLabel: entry.paperLabel?.trim() || null,
      level: entry.level === "OL" || entry.level === "HL" ? entry.level : null,
    }))
    .filter((entry) => entry.subjectId && /^\d{4}-\d{2}-\d{2}$/.test(entry.examDate));

  const keepSubjects = new Set(cleaned.map((e) => e.subjectId));

  const { data: existing, error: existingError } = await supabase
    .from("student_exam_schedule")
    .select("id, subject_id")
    .eq("user_id", userId);
  if (existingError) throw existingError;

  const toDelete = (existing ?? [])
    .filter((row) => !keepSubjects.has(row.subject_id as string))
    .map((row) => row.id as string);
  if (toDelete.length) {
    const { error: deleteError } = await supabase.from("student_exam_schedule").delete().in("id", toDelete);
    if (deleteError) throw deleteError;
  }

  if (cleaned.length) {
    const { error: upsertError } = await supabase.from("student_exam_schedule").upsert(
      cleaned.map((entry) => ({
        user_id: userId,
        subject_id: entry.subjectId,
        exam_date: entry.examDate,
        paper_label: entry.paperLabel,
        level: entry.level,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,subject_id" },
    );
    if (upsertError) throw upsertError;
  }

  return listExamSchedule(supabase, userId);
}

/** Upsert or clear one subject’s exam date without touching other subjects. */
export async function upsertSubjectExamDate(
  supabase: SupabaseClient,
  userId: string,
  input: {
    subjectId: string;
    examDate: string | null;
    paperLabel?: string | null;
    level?: "HL" | "OL" | null;
  },
): Promise<ExamScheduleEntry | null> {
  const subjectId = input.subjectId.trim();
  if (!subjectId) throw new Error("subjectId required");

  const examDate = input.examDate?.trim() || null;
  if (!examDate) {
    const { error } = await supabase
      .from("student_exam_schedule")
      .delete()
      .eq("user_id", userId)
      .eq("subject_id", subjectId);
    if (error) throw error;
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(examDate)) {
    throw new Error("Invalid exam date");
  }

  const level = input.level === "OL" || input.level === "HL" ? input.level : null;
  const paperLabel = input.paperLabel?.trim() || null;

  const { error } = await supabase.from("student_exam_schedule").upsert(
    {
      user_id: userId,
      subject_id: subjectId,
      exam_date: examDate,
      paper_label: paperLabel,
      level,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,subject_id" },
  );
  if (error) throw error;

  return {
    id: "",
    subjectId,
    examDate,
    paperLabel,
    level,
    daysUntil: daysUntilDate(examDate),
  };
}

export function scheduleBySubject(entries: ExamScheduleEntry[]): Map<string, ExamScheduleEntry> {
  return new Map(entries.map((entry) => [entry.subjectId, entry]));
}
