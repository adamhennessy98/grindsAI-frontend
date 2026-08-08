export type LearnerStyle =
  | "numerical-logical"
  | "language-writing"
  | "content-memory"
  | "none-natural";

export const LEARNER_STYLE_OPTIONS: {
  id: LearnerStyle;
  label: string;
  description: string;
  toneNote: string;
}[] = [
  {
    id: "numerical-logical",
    label: "Numerical / logical subjects come more naturally",
    description: "Maths, sciences, and structured problem-solving feel easier.",
    toneNote:
      "Student self-reports that numerical/logical subjects feel more natural — lean on clear structure; be extra patient with open writing tasks.",
  },
  {
    id: "language-writing",
    label: "Language / writing subjects come more naturally",
    description: "Essays, languages, and expressing ideas in words feel easier.",
    toneNote:
      "Student self-reports that language/writing subjects feel more natural — use plain language for formulae and step-by-step scaffolds for numerical work.",
  },
  {
    id: "content-memory",
    label: "Content / memory-heavy subjects come more naturally",
    description: "Learning facts, definitions, and large bodies of material feels easier.",
    toneNote:
      "Student self-reports that content/memory-heavy subjects feel more natural — use retrieval practice; break multi-step problem solving into smaller chunks.",
  },
  {
    id: "none-natural",
    label: "None come particularly naturally",
    description: "No clear preference — everything takes similar effort.",
    toneNote:
      "Student self-reports no subject type feels particularly natural — keep explanations concrete and check understanding often without assuming a strength area.",
  },
];

export function learnerStyleToneNote(style: LearnerStyle | null | undefined): string | null {
  if (!style) return null;
  return LEARNER_STYLE_OPTIONS.find((o) => o.id === style)?.toneNote ?? null;
}

export function isLearnerStyle(value: unknown): value is LearnerStyle {
  return (
    value === "numerical-logical" ||
    value === "language-writing" ||
    value === "content-memory" ||
    value === "none-natural"
  );
}
