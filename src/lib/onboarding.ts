import { SUBJECTS } from "@/lib/constants";

export type YearGroup = "5th-year" | "6th-year" | "repeat-year";
export type SubjectLevel = "HL" | "OL";
export type StudyChallenge = "concepts" | "exam-freeze" | "time-management" | "practice";

export type StudentProfile = {
  yearGroup: YearGroup;
  subjects: string[];
  subjectLevels: Record<string, SubjectLevel>;
  examTarget: string;
  challenge: StudyChallenge;
  completedAt: string;
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

export function readStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentProfile;
    if (!parsed?.yearGroup || !Array.isArray(parsed.subjects) || !parsed.challenge) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  document.cookie = `${ONBOARDING_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function clearOnboardingCookie() {
  document.cookie = `${ONBOARDING_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasCompletedOnboarding(): boolean {
  return readStudentProfile() !== null;
}

export function getSubjectLevel(profile: StudentProfile | null, subjectId: string): SubjectLevel {
  return profile?.subjectLevels[subjectId] ?? "HL";
}

export function filterSubjects(subjectIds: string[] | null | undefined) {
  if (!subjectIds?.length) return SUBJECTS;
  const allowed = new Set(subjectIds);
  return SUBJECTS.filter((subject) => allowed.has(subject.id));
}
