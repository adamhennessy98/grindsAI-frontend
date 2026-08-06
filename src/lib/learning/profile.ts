import type { SupabaseClient } from "@supabase/supabase-js";
import { decayMastery } from "@/lib/learning/bkt";
import { fetchStudentToneContext, type StudentToneContext } from "@/lib/learning/student-context";
import type { StudentProfile, StudyChallenge, SubjectLevel, YearGroup } from "@/lib/onboarding";
import type { TargetGradeBand } from "@/lib/learning/diagnostic-bank";

export type KcMasterySummary = {
  kcId: string;
  label: string;
  subjectId: string;
  strandTopicId: string;
  masteryP: number;
  masteryPDecayed: number;
  evidenceN: number;
  lastOutcome: string | null;
  lastEventAt: string | null;
};

export type LearningProfile = {
  prefs: StudentProfile | null;
  strugglingKcs: KcMasterySummary[];
  tone: StudentToneContext | null;
};

type ProfileRow = {
  year_group: string | null;
  exam_target: string | null;
  challenge: string | null;
  subjects: string[] | null;
  subject_levels: Record<string, string> | null;
  target_grade_band: string | null;
  reason_for_using: string | null;
  onboarding_completed_at: string | null;
};

function rowToPrefs(row: ProfileRow): StudentProfile | null {
  if (!row.year_group || !row.subjects?.length) return null;
  // Incomplete onboarding (pre Stage 3) still returns prefs for resume — challenge may be null.
  return {
    yearGroup: row.year_group as YearGroup,
    subjects: row.subjects,
    subjectLevels: (row.subject_levels ?? {}) as Record<string, SubjectLevel>,
    examTarget: row.exam_target ?? "",
    challenge: (row.challenge as StudyChallenge) || ("concepts" as StudyChallenge),
    targetGradeBand: (row.target_grade_band as TargetGradeBand) || null,
    reasonForUsing: row.reason_for_using,
    completedAt: row.onboarding_completed_at,
  };
}

export async function fetchStudentPrefs(
  supabase: SupabaseClient,
  userId: string,
): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "year_group, exam_target, challenge, subjects, subject_levels, target_grade_band, reason_for_using, onboarding_completed_at",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToPrefs(data as ProfileRow);
}

export async function upsertStudentPrefs(
  supabase: SupabaseClient,
  profile: StudentProfile,
  opts?: { markComplete?: boolean },
): Promise<void> {
  const { error } = await supabase.rpc("upsert_student_prefs", {
    p_year_group: profile.yearGroup,
    p_exam_target: profile.examTarget,
    p_challenge: profile.challenge,
    p_subjects: profile.subjects,
    p_subject_levels: profile.subjectLevels,
    p_completed_at: profile.completedAt,
    p_target_grade_band: profile.targetGradeBand ?? null,
    p_reason_for_using: profile.reasonForUsing ?? null,
    p_mark_complete: Boolean(opts?.markComplete),
  });
  if (error) throw error;
}

const STRUGGLING_THRESHOLD = 0.55;
const TOP_N = 8;

export async function getLearningProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<LearningProfile> {
  const prefs = await fetchStudentPrefs(supabase, userId);
  const tone = await fetchStudentToneContext(supabase, userId);

  const { data: states, error } = await supabase
    .from("student_kc_state")
    .select("kc_id, mastery_p, evidence_n, last_outcome, last_event_at")
    .eq("user_id", userId)
    .gt("evidence_n", 0)
    .order("mastery_p", { ascending: true })
    .limit(40);

  if (error) throw error;

  const kcIds = [...new Set((states ?? []).map((row) => row.kc_id as string))];
  const labelByKc = new Map<string, { label: string; subject_id: string; strand_topic_id: string }>();
  if (kcIds.length) {
    const { data: kcs, error: kcErr } = await supabase
      .from("knowledge_components")
      .select("kc_id, label, subject_id, strand_topic_id")
      .in("kc_id", kcIds);
    if (kcErr) throw kcErr;
    for (const kc of kcs ?? []) {
      labelByKc.set(kc.kc_id as string, {
        label: kc.label as string,
        subject_id: kc.subject_id as string,
        strand_topic_id: kc.strand_topic_id as string,
      });
    }
  }

  const strugglingKcs: KcMasterySummary[] = [];
  for (const row of states ?? []) {
    const meta = labelByKc.get(row.kc_id as string);
    if (!meta) continue;
    const masteryP = Number(row.mastery_p);
    const lastEventAt = row.last_event_at ? new Date(row.last_event_at as string) : null;
    const masteryPDecayed = decayMastery(masteryP, lastEventAt);
    if (masteryPDecayed >= STRUGGLING_THRESHOLD) continue;
    strugglingKcs.push({
      kcId: row.kc_id as string,
      label: meta.label,
      subjectId: meta.subject_id,
      strandTopicId: meta.strand_topic_id,
      masteryP,
      masteryPDecayed,
      evidenceN: Number(row.evidence_n),
      lastOutcome: (row.last_outcome as string) ?? null,
      lastEventAt: (row.last_event_at as string) ?? null,
    });
    if (strugglingKcs.length >= TOP_N) break;
  }

  strugglingKcs.sort((a, b) => a.masteryPDecayed - b.masteryPDecayed);
  return { prefs, strugglingKcs, tone };
}
