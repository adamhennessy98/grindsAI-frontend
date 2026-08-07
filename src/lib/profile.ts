import type { SupabaseClient } from "@supabase/supabase-js";
import { SUBJECTS } from "@/lib/constants";
import {
  CHALLENGE_OPTIONS,
  YEAR_OPTIONS,
  type StudentProfile,
  type StudyChallenge,
  type SubjectLevel,
  type YearGroup,
} from "@/lib/onboarding";

export type ProfileRow = {
  id: string;
  email: string | null;
  subscription_status: string;
  display_name: string | null;
  year_group: string | null;
  exam_target: string | null;
  challenge: string | null;
  subjects: unknown;
  subject_levels: unknown;
  onboarding_completed_at: string | null;
};

const PROFILE_SELECT =
  "id, email, subscription_status, display_name, year_group, exam_target, challenge, subjects, subject_levels, onboarding_completed_at";

const YEAR_GROUPS = new Set<YearGroup>(["5th-year", "6th-year", "repeat-year"]);
const CHALLENGES = new Set<StudyChallenge>(["concepts", "exam-freeze", "time-management", "practice"]);

function isYearGroup(value: unknown): value is YearGroup {
  return typeof value === "string" && YEAR_GROUPS.has(value as YearGroup);
}

function isChallenge(value: unknown): value is StudyChallenge {
  return typeof value === "string" && CHALLENGES.has(value as StudyChallenge);
}

function isSubjectLevel(value: unknown): value is SubjectLevel {
  return value === "HL" || value === "OL";
}

function parseSubjects(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parseSubjectLevels(value: unknown): Record<string, SubjectLevel> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const levels: Record<string, SubjectLevel> = {};
  for (const [subjectId, level] of Object.entries(value as Record<string, unknown>)) {
    if (isSubjectLevel(level)) levels[subjectId] = level;
  }
  return levels;
}

/** Convert a DB row into the app's StudentProfile. Returns null if onboarding is incomplete. */
export function profileRowToStudentProfile(row: ProfileRow): StudentProfile | null {
  if (!isYearGroup(row.year_group)) return null;
  if (!isChallenge(row.challenge)) return null;
  if (typeof row.exam_target !== "string" || !row.exam_target.trim()) return null;
  if (!row.onboarding_completed_at) return null;

  const subjects = parseSubjects(row.subjects);
  if (!subjects.length) return null;

  return {
    yearGroup: row.year_group,
    examTarget: row.exam_target.trim(),
    challenge: row.challenge,
    subjects,
    subjectLevels: parseSubjectLevels(row.subject_levels),
    completedAt: row.onboarding_completed_at,
  };
}

export function studentProfileToRowFields(profile: StudentProfile, displayName?: string | null) {
  return {
    year_group: profile.yearGroup,
    exam_target: profile.examTarget,
    challenge: profile.challenge,
    subjects: profile.subjects,
    subject_levels: profile.subjectLevels,
    onboarding_completed_at: profile.completedAt,
    display_name: displayName?.trim() || null,
    updated_at: new Date().toISOString(),
  };
}

export function hasCompletedStudentProfile(
  profile: ProfileRow | StudentProfile | null | undefined,
): boolean {
  if (!profile) return false;
  if ("yearGroup" in profile) return Boolean(profile.completedAt);
  return profileRowToStudentProfile(profile) !== null;
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select(PROFILE_SELECT).eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as ProfileRow;
}

export async function getStudentProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<StudentProfile | null> {
  const row = await getProfile(supabase, userId);
  return row ? profileRowToStudentProfile(row) : null;
}

export async function upsertStudentProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: StudentProfile,
  options?: { displayName?: string | null; email?: string | null },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const fields = studentProfileToRowFields(profile, options?.displayName);
  const payload = {
    id: userId,
    ...fields,
    ...(typeof options?.email === "string" ? { email: options.email } : {}),
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    return { ok: false, message: error.message || "Could not save student profile." };
  }
  return { ok: true };
}

/** Validate a client/API payload into StudentProfile. */
export function parseStudentProfileInput(body: unknown): StudentProfile | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  if (!isYearGroup(data.yearGroup)) return null;
  if (!isChallenge(data.challenge)) return null;
  if (typeof data.examTarget !== "string" || !data.examTarget.trim()) return null;

  const subjects = parseSubjects(data.subjects);
  if (!subjects.length) return null;

  const subjectLevels = parseSubjectLevels(data.subjectLevels);
  const completedAt =
    typeof data.completedAt === "string" && data.completedAt.trim()
      ? data.completedAt.trim()
      : new Date().toISOString();

  return {
    yearGroup: data.yearGroup,
    examTarget: data.examTarget.trim(),
    challenge: data.challenge,
    subjects,
    subjectLevels,
    completedAt,
  };
}

export function buildStudentContextPrompt(profile: StudentProfile): string {
  const yearLabel = YEAR_OPTIONS.find((option) => option.id === profile.yearGroup)?.label ?? profile.yearGroup;
  const challenge = CHALLENGE_OPTIONS.find((option) => option.id === profile.challenge);
  const subjectSummary = profile.subjects
    .map((id) => {
      const name = SUBJECTS.find((subject) => subject.id === id)?.name ?? id;
      const lvl = profile.subjectLevels[id] === "OL" ? "Ordinary Level" : "Higher Level";
      return `${name} (${lvl})`;
    })
    .join(", ");

  const urgency =
    profile.yearGroup === "5th-year"
      ? "The student is in 5th year — prioritise building solid foundations over cramming. Use a patient, long-term tone."
      : profile.yearGroup === "repeat-year"
        ? "The student is repeating the Leaving Cert — they know the syllabus but need targeted improvement. Be direct and efficient."
        : "The student is in 6th year with exams approaching — be focused, high-yield, and revision-oriented.";

  const challengeGuidance: Record<StudyChallenge, string> = {
    concepts:
      "Their main struggle is understanding the material. Prioritise clear explanations, analogies, and step-by-step concept building before jumping to exam questions.",
    "exam-freeze":
      "They understand the content but freeze under exam pressure. Include exam technique, confidence-building, and practice framing questions as they would appear on the paper.",
    "time-management":
      "They struggle with time in exams. Emphasise paper strategy, which questions to attempt first, marking scheme awareness, and when to move on.",
    practice:
      "They need more question practice. Lean toward past-paper style questions, worked examples, and active recall rather than long theory lectures.",
  };

  return [
    `Student context: ${yearLabel} student sitting the Leaving Cert in ${profile.examTarget}.`,
    urgency,
    subjectSummary ? `They study: ${subjectSummary}.` : "",
    challenge ? `Biggest challenge right now: ${challenge.label}. ${challengeGuidance[profile.challenge]}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
