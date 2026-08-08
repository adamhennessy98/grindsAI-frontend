import type { SupabaseClient } from "@supabase/supabase-js";
import { isLearnerStyle, type LearnerStyle } from "@/lib/learning/learner-style";

export type StudentToneContext = {
  anxietyFlag: boolean;
  notes: string[];
  rawFreeText: string | null;
  learnerStyle: LearnerStyle | null;
};

type ContextRow = {
  anxiety_flag: boolean;
  notes: unknown;
  raw_free_text: string | null;
  learner_style?: string | null;
};

function notesFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((n): n is string => typeof n === "string").slice(0, 20);
}

function rowToTone(row: ContextRow): StudentToneContext {
  return {
    anxietyFlag: Boolean(row.anxiety_flag),
    notes: notesFromJson(row.notes),
    rawFreeText: row.raw_free_text,
    learnerStyle: isLearnerStyle(row.learner_style) ? row.learner_style : null,
  };
}

export async function fetchStudentToneContext(
  supabase: SupabaseClient,
  userId: string,
): Promise<StudentToneContext | null> {
  const { data, error } = await supabase
    .from("student_context")
    .select("anxiety_flag, notes, raw_free_text, learner_style")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    // Column may not exist until migration is applied — fall back without learner_style.
    const legacy = await supabase
      .from("student_context")
      .select("anxiety_flag, notes, raw_free_text")
      .eq("user_id", userId)
      .maybeSingle();
    if (legacy.error) throw legacy.error;
    if (!legacy.data) return null;
    return rowToTone(legacy.data as ContextRow);
  }

  if (!data) return null;
  return rowToTone(data as ContextRow);
}

function mergeToneNotes(existing: string[], incoming: string[]): string[] {
  const out = [...existing];
  for (const note of incoming) {
    if (!out.includes(note)) out.push(note);
  }
  return out.slice(-20);
}

export async function upsertStudentToneContext(
  supabase: SupabaseClient,
  userId: string,
  patch: {
    anxietyFlag?: boolean;
    notes?: string[];
    rawFreeText?: string | null;
    learnerStyle?: LearnerStyle | null;
  },
): Promise<StudentToneContext> {
  const existing = await fetchStudentToneContext(supabase, userId);
  const next = {
    anxiety_flag: patch.anxietyFlag ?? existing?.anxietyFlag ?? false,
    notes: patch.notes?.length
      ? mergeToneNotes(existing?.notes ?? [], patch.notes)
      : (existing?.notes ?? []),
    raw_free_text: patch.rawFreeText !== undefined ? patch.rawFreeText : (existing?.rawFreeText ?? null),
    learner_style:
      patch.learnerStyle !== undefined ? patch.learnerStyle : (existing?.learnerStyle ?? null),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("student_context").upsert(
    {
      user_id: userId,
      ...next,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;

  return rowToTone(next);
}

/** Heuristic extract — never writes mastery. Returns tone flags + topic labels for check queue. */
export function extractFreeTextSignals(text: string): {
  anxietyFlag: boolean;
  toneNotes: string[];
  topicHints: { subjectId: string; kcId: string; reason: string }[];
} {
  const lower = text.toLowerCase();
  const anxietyFlag =
    /anxi|nervous|panic|freeze|scared of (the )?exam|stress(ed)? before/.test(lower);

  const toneNotes: string[] = [];
  if (anxietyFlag) toneNotes.push("Mentions exam anxiety or freezing under pressure.");
  if (/nobody explained|never (really )?taught|teacher (skipped|rushed)/.test(lower)) {
    toneNotes.push("Feels a topic was never properly explained.");
  }

  const topicHints: { subjectId: string; kcId: string; reason: string }[] = [];
  const topicMap: { re: RegExp; subjectId: string; kcId: string; label: string }[] = [
    { re: /fraction/, subjectId: "maths", kcId: "maths.hl.algebra", label: "fractions" },
    { re: /algebra/, subjectId: "maths", kcId: "maths.hl.algebra", label: "algebra" },
    { re: /calculus|differentiat|integrat/, subjectId: "maths", kcId: "maths.hl.calculus", label: "calculus" },
    { re: /trigonometr|sin |cos |tan /, subjectId: "maths", kcId: "maths.hl.trigonometry", label: "trigonometry" },
    { re: /probability/, subjectId: "maths", kcId: "maths.hl.probability", label: "probability" },
    { re: /physics/, subjectId: "physics", kcId: "physics.hl.general", label: "physics" },
    { re: /chemistry/, subjectId: "chemistry", kcId: "chemistry.hl.general", label: "chemistry" },
    { re: /biology/, subjectId: "biology", kcId: "biology.hl.general", label: "biology" },
  ];
  for (const item of topicMap) {
    if (item.re.test(lower)) {
      topicHints.push({
        subjectId: item.subjectId,
        kcId: item.kcId,
        reason: `Free-text mentioned ${item.label}`,
      });
    }
  }

  return { anxietyFlag, toneNotes, topicHints };
}
