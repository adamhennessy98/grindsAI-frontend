import { SUBJECTS } from "@/lib/constants";

const INITIALS: Record<string, string> = {
  accounting: "Ac",
  "applied-maths": "AM",
  biology: "Bi",
  business: "Bu",
  chemistry: "Ch",
  "computer-science": "CS",
  economics: "Ec",
  english: "E",
  french: "Fr",
  geography: "Gg",
  german: "Gr",
  history: "Hi",
  irish: "G",
  maths: "M",
  physics: "Ph",
  spanish: "Sp",
  technology: "Te",
};

export function subjectInitial(subjectId: string): string {
  return INITIALS[subjectId] ?? subjectId.slice(0, 2).toUpperCase();
}

export function subjectLabel(subjectId: string): string {
  if (subjectId === "all") return "All subjects";
  return SUBJECTS.find((s) => s.id === subjectId)?.name ?? "Subject";
}

const PAPER_TOPICS: Record<string, [string, string]> = {
  maths: ["Algebra / Functions / Calculus", "Geometry / Trig / Probability"],
  chemistry: ["Atomic theory / Bonding / Stoichiometry", "Organic / Rates / Equilibria"],
  physics: ["Mechanics / Heat / Waves", "Electricity / Modern physics"],
  english: ["Comprehending / Composing", "Single text / Comparative / Poetry"],
  irish: ["Cluastuiscint / Leamhthuiscint", "Pros / Filiocht / Aiste"],
  "computer-science": ["Computational thinking / Logic", "Algorithms / Data representation"],
};

export interface PaperEntry {
  key: string;
  year: number;
  paper: string;
  topics: string;
  qCount: number;
}

export function buildPapers(subjectId: string): PaperEntry[] {
  const topics = PAPER_TOPICS[subjectId] ?? ["Paper 1 topics", "Paper 2 topics"];
  const out: PaperEntry[] = [];
  for (const year of [2024, 2023, 2022, 2021]) {
    out.push({ key: `${year}-1`, year, paper: "Paper 1", topics: topics[0], qCount: 9 });
    out.push({ key: `${year}-2`, year, paper: "Paper 2", topics: topics[1] ?? topics[0], qCount: 8 });
  }
  return out;
}
