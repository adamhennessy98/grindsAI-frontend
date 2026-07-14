import { SUBJECTS } from "@/lib/constants";
import { readStudentProfile } from "@/lib/onboarding";
import type { CSSProperties } from "react";

export type SubjectTheme = {
  accent: string;
  accentStrong: string;
  softBackground: string;
  border: string;
  hover: string;
  darkSoftBackground: string;
  darkBorder: string;
  darkText: string;
  textOnAccent: string;
};

// A student normally studies no more than nine subjects. Palette slots are assigned from their saved subject order.
export const SUBJECT_THEME_PALETTE: readonly SubjectTheme[] = [
  { accent: "#0f766e", accentStrong: "#115e59", softBackground: "#f0fdfa", border: "#99f6e4", hover: "#ccfbf1", darkSoftBackground: "rgba(20, 184, 166, 0.14)", darkBorder: "rgba(45, 212, 191, 0.38)", darkText: "#99f6e4", textOnAccent: "#ffffff" },
  { accent: "#c2410c", accentStrong: "#9a3412", softBackground: "#fff7ed", border: "#fed7aa", hover: "#ffedd5", darkSoftBackground: "rgba(249, 115, 22, 0.14)", darkBorder: "rgba(251, 146, 60, 0.4)", darkText: "#fdba74", textOnAccent: "#ffffff" },
  { accent: "#4d7c0f", accentStrong: "#3f6212", softBackground: "#f7fee7", border: "#d9f99d", hover: "#ecfccb", darkSoftBackground: "rgba(132, 204, 22, 0.13)", darkBorder: "rgba(163, 230, 53, 0.38)", darkText: "#bef264", textOnAccent: "#ffffff" },
  { accent: "#b45309", accentStrong: "#92400e", softBackground: "#fffbeb", border: "#fde68a", hover: "#fef3c7", darkSoftBackground: "rgba(245, 158, 11, 0.14)", darkBorder: "rgba(251, 191, 36, 0.38)", darkText: "#fcd34d", textOnAccent: "#ffffff" },
  { accent: "#be123c", accentStrong: "#9f1239", softBackground: "#fff1f2", border: "#fecdd3", hover: "#ffe4e6", darkSoftBackground: "rgba(244, 63, 94, 0.14)", darkBorder: "rgba(251, 113, 133, 0.4)", darkText: "#fda4af", textOnAccent: "#ffffff" },
  { accent: "#2563eb", accentStrong: "#1d4ed8", softBackground: "#eff6ff", border: "#bfdbfe", hover: "#dbeafe", darkSoftBackground: "rgba(59, 130, 246, 0.14)", darkBorder: "rgba(96, 165, 250, 0.42)", darkText: "#93c5fd", textOnAccent: "#ffffff" },
  { accent: "#7c3aed", accentStrong: "#6d28d9", softBackground: "#f5f3ff", border: "#ddd6fe", hover: "#ede9fe", darkSoftBackground: "rgba(139, 92, 246, 0.14)", darkBorder: "rgba(167, 139, 250, 0.4)", darkText: "#c4b5fd", textOnAccent: "#ffffff" },
  { accent: "#be185d", accentStrong: "#9d174d", softBackground: "#fdf2f8", border: "#fbcfe8", hover: "#fce7f3", darkSoftBackground: "rgba(236, 72, 153, 0.14)", darkBorder: "rgba(244, 114, 182, 0.4)", darkText: "#f9a8d4", textOnAccent: "#ffffff" },
  { accent: "#15803d", accentStrong: "#166534", softBackground: "#f0fdf4", border: "#bbf7d0", hover: "#dcfce7", darkSoftBackground: "rgba(34, 197, 94, 0.13)", darkBorder: "rgba(74, 222, 128, 0.38)", darkText: "#86efac", textOnAccent: "#ffffff" },
] as const;

function themeSubjectIds(subjectIds?: string[]): string[] {
  if (subjectIds?.length) return [...new Set(subjectIds)];
  const profileSubjects = readStudentProfile()?.subjects;
  if (profileSubjects?.length) return [...new Set(profileSubjects)];
  return SUBJECTS.map((subject) => subject.id);
}

export function getSubjectTheme(subjectId: string, subjectIds?: string[]): SubjectTheme {
  const ids = themeSubjectIds(subjectIds);
  const subjectIndex = ids.indexOf(subjectId);
  const fallbackIndex = SUBJECTS.findIndex((subject) => subject.id === subjectId);
  const index = subjectIndex >= 0 ? subjectIndex : Math.max(fallbackIndex, 0);
  return SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length] ?? SUBJECT_THEME_PALETTE[0];
}

export function subjectThemeStyle(subjectId: string, subjectIds?: string[]): CSSProperties {
  const theme = getSubjectTheme(subjectId, subjectIds);
  return {
    "--subject-accent": theme.accent,
    "--subject-accent-strong": theme.accentStrong,
    "--subject-surface": theme.softBackground,
    "--subject-border": theme.border,
    "--subject-hover": theme.hover,
    "--subject-dark-surface": theme.darkSoftBackground,
    "--subject-dark-border": theme.darkBorder,
    "--subject-dark-text": theme.darkText,
    "--subject-on-accent": theme.textOnAccent,
  } as CSSProperties;
}

const INITIALS: Record<string, string> = {
  accounting: "Ac", "applied-maths": "AM", biology: "Bi", business: "Bu", chemistry: "Ch", "computer-science": "CS", economics: "Ec", english: "E", french: "Fr", geography: "Gg", german: "Gr", history: "Hi", irish: "G", maths: "M", physics: "Ph", spanish: "Sp", technology: "Te",
};

export function subjectInitial(subjectId: string): string { return INITIALS[subjectId] ?? subjectId.slice(0, 2).toUpperCase(); }
export function subjectLabel(subjectId: string): string { return subjectId === "all" ? "All subjects" : SUBJECTS.find((subject) => subject.id === subjectId)?.name ?? "Subject"; }

const PAPER_TOPICS: Record<string, [string, string]> = {
  maths: ["Algebra / Functions / Calculus", "Geometry / Trig / Probability"], chemistry: ["Atomic theory / Bonding / Stoichiometry", "Organic / Rates / Equilibria"], physics: ["Mechanics / Heat / Waves", "Electricity / Modern physics"], english: ["Comprehending / Composing", "Single text / Comparative / Poetry"], irish: ["Cluastuiscint / Leamhthuiscint", "Pros / Filiocht / Aiste"], "computer-science": ["Computational thinking / Logic", "Algorithms / Data representation"],
};

export interface PaperEntry { key: string; year: number; paper: string; topics: string; qCount: number; }

export function buildPapers(subjectId: string): PaperEntry[] {
  const topics = PAPER_TOPICS[subjectId] ?? ["Paper 1 topics", "Paper 2 topics"];
  const out: PaperEntry[] = [];
  for (const year of [2024, 2023, 2022, 2021]) {
    out.push({ key: `${year}-1`, year, paper: "Paper 1", topics: topics[0], qCount: 9 });
    out.push({ key: `${year}-2`, year, paper: "Paper 2", topics: topics[1] ?? topics[0], qCount: 8 });
  }
  return out;
}
