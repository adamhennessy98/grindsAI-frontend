import { SUBJECTS } from "@/lib/constants";
import { GRADE_BAND_OPTIONS, type TargetGradeBand } from "@/lib/learning/diagnostic-bank";

export type YearGroup = "5th-year" | "6th-year" | "repeat-year";
export type SubjectLevel = "HL" | "OL";
export type StudyChallenge = "concepts" | "exam-freeze" | "time-management" | "practice";
export type { TargetGradeBand };

export type StudentProfile = {
  yearGroup: YearGroup;
  subjects: string[];
  subjectLevels: Record<string, SubjectLevel>;
  examTarget: string;
  challenge: StudyChallenge;
  targetGradeBand?: TargetGradeBand | null;
  reasonForUsing?: string | null;
  /** Set only after Stage 3 diagnostic completes. */
  completedAt: string | null;
};

const STORAGE_KEY = "grindsai-student-profile";
export const ONBOARDING_COOKIE = "grindsai_onboarding";

export const YEAR_OPTIONS: { id: YearGroup; label: string; description: string }[] = [
  { id: "5th-year", label: "5th Year", description: "Building foundations for next year" },
  { id: "6th-year", label: "6th Year", description: "Leaving Cert this June" },
  { id: "repeat-year", label: "Repeat Year", description: "Sitting the exams again" },
];

export const CHALLENGE_OPTIONS: { id: StudyChallenge; label: string; description: string }[] = [
  {
    id: "concepts",
    label: "I don't understand the material",
    description: "Focus on clear explanations and building from basics",
  },
  {
    id: "exam-freeze",
    label: "I understand it but freeze in exams",
    description: "Focus on exam technique and staying calm under pressure",
  },
  {
    id: "time-management",
    label: "I struggle with time management in papers",
    description: "Focus on paper strategy and pacing",
  },
  {
    id: "practice",
    label: "I need to practice more questions",
    description: "Focus on past papers and active practice",
  },
];

export { GRADE_BAND_OPTIONS };

export function defaultExamTarget(yearGroup: YearGroup): string {
  const year = new Date().getFullYear();
  if (yearGroup === "5th-year") return `June ${year + 1}`;
  return `June ${year}`;
}

export function examOptionsForYear(yearGroup: YearGroup): { id: string; label: string }[] {
  const year = new Date().getFullYear();
  if (yearGroup === "5th-year") {
    return [{ id: `june-${year + 1}`, label: `June ${year + 1}` }];
  }
  return [{ id: `june-${year}`, label: `June ${year}` }];
}

export function defaultSubjectLevels(subjectIds: string[]): Record<string, SubjectLevel> {
  return Object.fromEntries(subjectIds.map((id) => [id, "HL" as SubjectLevel]));
}

function isCompleteProfile(parsed: StudentProfile): boolean {
  return Boolean(parsed?.yearGroup && Array.isArray(parsed.subjects) && parsed.challenge && parsed.completedAt);
}

export function readStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentProfile;
    if (!parsed?.yearGroup || !Array.isArray(parsed.subjects)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Local cache only — cookie is set only when onboarding is fully complete (Stage 3). */
export function saveStudentProfileLocal(profile: StudentProfile, opts?: { markGateComplete?: boolean }) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  if (opts?.markGateComplete && profile.completedAt) {
    document.cookie = `${ONBOARDING_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
}

/** @deprecated use saveStudentProfileLocal — kept for call sites that mean “cache + cookie”. */
export function saveStudentProfile(profile: StudentProfile) {
  saveStudentProfileLocal(profile, { markGateComplete: Boolean(profile.completedAt) });
}

export type SavePrefsOptions = {
  /** Only true after Stage 3 diagnostic. */
  markComplete?: boolean;
};

/** Persist prefs to Supabase; cookie only when markComplete. */
export async function saveStudentProfileRemote(
  profile: StudentProfile,
  opts?: SavePrefsOptions,
): Promise<{ ok: boolean; error?: string }> {
  const markComplete = Boolean(opts?.markComplete && profile.completedAt);
  saveStudentProfileLocal(profile, { markGateComplete: markComplete });
  try {
    const response = await fetch("/api/learning/prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, markComplete }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error ?? `Prefs sync failed (${response.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Prefs sync failed" };
  }
}

/** Load prefs: prefer server, fall back to localStorage; one-shot migrate local → DB when DB empty. */
export async function loadStudentProfile(): Promise<StudentProfile | null> {
  const local = readStudentProfile();

  try {
    const response = await fetch("/api/learning/prefs", { method: "GET" });
    if (response.ok) {
      const body = (await response.json()) as { profile: StudentProfile | null };
      if (body.profile) {
        // Incomplete server row must not wipe a finished local profile (mid-onboarding sync race).
        if (!body.profile.completedAt && local && isCompleteProfile(local)) {
          void saveStudentProfileRemote(local, { markComplete: true });
          return local;
        }
        saveStudentProfileLocal(body.profile, { markGateComplete: Boolean(body.profile.completedAt) });
        return body.profile;
      }
    }
  } catch {
    /* fall through to local */
  }

  if (!local) return null;

  if (isCompleteProfile(local)) {
    void saveStudentProfileRemote(local, { markComplete: true });
  }
  return local;
}

export function clearOnboardingCookie() {
  document.cookie = `${ONBOARDING_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasCompletedOnboarding(): boolean {
  const profile = readStudentProfile();
  return Boolean(profile?.completedAt);
}

export function getSubjectLevel(profile: StudentProfile | null, subjectId: string): SubjectLevel {
  return profile?.subjectLevels[subjectId] ?? "HL";
}

export function filterSubjects(subjectIds: string[] | null | undefined) {
  if (!subjectIds?.length) return SUBJECTS;
  const allowed = new Set(subjectIds);
  return SUBJECTS.filter((subject) => allowed.has(subject.id));
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
    `Student prefs (not mastery evidence): ${yearLabel} student sitting the Leaving Cert in ${profile.examTarget}.`,
    urgency,
    subjectSummary ? `They study: ${subjectSummary}.` : "",
    challenge ? `Biggest challenge right now: ${challenge.label}. ${challengeGuidance[profile.challenge]}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
