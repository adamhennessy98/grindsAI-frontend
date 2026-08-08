export type TargetGradeBand = "H1-H2" | "H3-H4" | "H5-H7" | "pass" | "unsure";

export const GRADE_BAND_OPTIONS: { id: TargetGradeBand; label: string; description: string }[] = [
  { id: "H1-H2", label: "H1–H2", description: "Aiming for the top grades" },
  { id: "H3-H4", label: "H3–H4", description: "Solid higher-level grades" },
  { id: "H5-H7", label: "H5–H7", description: "Secure a Higher Level pass band" },
  { id: "pass", label: "Pass / Ordinary focus", description: "Get over the line confidently" },
  { id: "unsure", label: "Not sure yet", description: "Figure out a realistic target as we go" },
];

export type DiagnosticChoice = {
  id: string;
  label: string;
};

export type DiagnosticQuestion = {
  id: string;
  subjectId: string;
  kcId: string;
  strandLabel: string;
  prompt: string;
  choices: DiagnosticChoice[];
  correctChoiceId: string;
};

/** Light MC diagnostic: 2–3 Qs per subject, different strands where possible. No hints. */
const BANK: DiagnosticQuestion[] = [
  // Maths — three strands
  {
    id: "maths-alg-1",
    subjectId: "maths",
    kcId: "maths.hl.algebra",
    strandLabel: "Algebra",
    prompt: "If 2(x − 3) = 10, what is x?",
    choices: [
      { id: "a", label: "2" },
      { id: "b", label: "5" },
      { id: "c", label: "8" },
      { id: "d", label: "13" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "maths-calc-1",
    subjectId: "maths",
    kcId: "maths.hl.calculus",
    strandLabel: "Calculus",
    prompt: "What is the derivative of x² with respect to x?",
    choices: [
      { id: "a", label: "x" },
      { id: "b", label: "2x" },
      { id: "c", label: "x²" },
      { id: "d", label: "2" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "maths-trig-1",
    subjectId: "maths",
    kcId: "maths.hl.trigonometry",
    strandLabel: "Trigonometry",
    prompt: "In a right-angled triangle, sin θ = opposite / ?",
    choices: [
      { id: "a", label: "Adjacent" },
      { id: "b", label: "Hypotenuse" },
      { id: "c", label: "Opposite" },
      { id: "d", label: "Area" },
    ],
    correctChoiceId: "b",
  },
  // Physics
  {
    id: "physics-1",
    subjectId: "physics",
    kcId: "physics.hl.general",
    strandLabel: "Mechanics",
    prompt: "Acceleration is the rate of change of:",
    choices: [
      { id: "a", label: "Distance" },
      { id: "b", label: "Velocity" },
      { id: "c", label: "Mass" },
      { id: "d", label: "Force" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "physics-2",
    subjectId: "physics",
    kcId: "physics.hl.general",
    strandLabel: "Energy",
    prompt: "The SI unit of energy is the:",
    choices: [
      { id: "a", label: "Newton" },
      { id: "b", label: "Watt" },
      { id: "c", label: "Joule" },
      { id: "d", label: "Pascal" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "physics-3",
    subjectId: "physics",
    kcId: "physics.hl.general",
    strandLabel: "Waves",
    prompt: "Frequency × wavelength equals:",
    choices: [
      { id: "a", label: "Amplitude" },
      { id: "b", label: "Speed of the wave" },
      { id: "c", label: "Period" },
      { id: "d", label: "Intensity" },
    ],
    correctChoiceId: "b",
  },
  // Chemistry
  {
    id: "chem-1",
    subjectId: "chemistry",
    kcId: "chemistry.hl.general",
    strandLabel: "Atomic structure",
    prompt: "The atomic number of an element equals the number of:",
    choices: [
      { id: "a", label: "Neutrons" },
      { id: "b", label: "Protons" },
      { id: "c", label: "Electrons + neutrons" },
      { id: "d", label: "Nucleons only" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "chem-2",
    subjectId: "chemistry",
    kcId: "chemistry.hl.general",
    strandLabel: "Bonding",
    prompt: "A covalent bond involves:",
    choices: [
      { id: "a", label: "Transfer of electrons" },
      { id: "b", label: "Sharing of electrons" },
      { id: "c", label: "Only proton transfer" },
      { id: "d", label: "Nuclear fusion" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "chem-3",
    subjectId: "chemistry",
    kcId: "chemistry.hl.general",
    strandLabel: "Stoichiometry",
    prompt: "One mole of any substance contains Avogadro’s number of:",
    choices: [
      { id: "a", label: "Grams" },
      { id: "b", label: "Particles (atoms/molecules/ions as defined)" },
      { id: "c", label: "Litres always" },
      { id: "d", label: "Protons only" },
    ],
    correctChoiceId: "b",
  },
  // Biology
  {
    id: "bio-1",
    subjectId: "biology",
    kcId: "biology.hl.general",
    strandLabel: "Cell",
    prompt: "Which organelle is the main site of aerobic respiration in eukaryotic cells?",
    choices: [
      { id: "a", label: "Nucleus" },
      { id: "b", label: "Mitochondrion" },
      { id: "c", label: "Ribosome" },
      { id: "d", label: "Golgi apparatus" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "bio-2",
    subjectId: "biology",
    kcId: "biology.hl.general",
    strandLabel: "Genetics",
    prompt: "DNA base pairing: adenine pairs with:",
    choices: [
      { id: "a", label: "Guanine" },
      { id: "b", label: "Cytosine" },
      { id: "c", label: "Thymine" },
      { id: "d", label: "Uracil in DNA" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "bio-3",
    subjectId: "biology",
    kcId: "biology.hl.general",
    strandLabel: "Ecology",
    prompt: "A food chain always starts with a:",
    choices: [
      { id: "a", label: "Consumer" },
      { id: "b", label: "Producer" },
      { id: "c", label: "Decomposer" },
      { id: "d", label: "Predator" },
    ],
    correctChoiceId: "b",
  },
  // English
  {
    id: "eng-1",
    subjectId: "english",
    kcId: "english.hl.general",
    strandLabel: "Poetry",
    prompt: "A metaphor is when:",
    choices: [
      { id: "a", label: "Two things are compared using like/as" },
      { id: "b", label: "One thing is described as if it were another" },
      { id: "c", label: "Words imitate sounds" },
      { id: "d", label: "Lines rhyme at the end" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "eng-2",
    subjectId: "english",
    kcId: "english.hl.general",
    strandLabel: "Essay",
    prompt: "A clear thesis statement usually appears:",
    choices: [
      { id: "a", label: "Only in the conclusion" },
      { id: "b", label: "In the introduction" },
      { id: "c", label: "Never in Leaving Cert essays" },
      { id: "d", label: "Only in poetry answers" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "eng-3",
    subjectId: "english",
    kcId: "english.hl.general",
    strandLabel: "Drama",
    prompt: "Stage directions in a play script mainly tell us:",
    choices: [
      { id: "a", label: "Exam marking notes" },
      { id: "b", label: "How characters move/speak and how the scene is set" },
      { id: "c", label: "Audience ticket prices" },
      { id: "d", label: "Publisher details" },
    ],
    correctChoiceId: "b",
  },
];

/** Generic 2-question fallback for subjects without a custom bank. */
function genericQuestions(subjectId: string, subjectName: string): DiagnosticQuestion[] {
  const kcId = `${subjectId}.hl.general`;
  return [
    {
      id: `${subjectId}-g1`,
      subjectId,
      kcId,
      strandLabel: "Foundations",
      prompt: `For ${subjectName}: which study habit usually helps most before timed papers?`,
      choices: [
        { id: "a", label: "Only re-reading notes the night before" },
        { id: "b", label: "Practising exam-style questions under time" },
        { id: "c", label: "Skipping marking schemes entirely" },
        { id: "d", label: "Avoiding weak topics forever" },
      ],
      correctChoiceId: "b",
    },
    {
      id: `${subjectId}-g2`,
      subjectId,
      kcId,
      strandLabel: "Exam technique",
      prompt: `In ${subjectName}, if you are stuck on a question in the exam you should usually:`,
      choices: [
        { id: "a", label: "Spend all remaining time on it" },
        { id: "b", label: "Move on and return if time allows" },
        { id: "c", label: "Leave the paper blank" },
        { id: "d", label: "Guess randomly without reading" },
      ],
      correctChoiceId: "b",
    },
  ];
}

const SUBJECT_NAMES: Record<string, string> = {
  maths: "Maths",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  english: "English",
  "applied-maths": "Applied Maths",
  accounting: "Accounting",
  business: "Business",
  economics: "Economics",
  geography: "Geography",
  history: "History",
  irish: "Irish",
  french: "French",
  german: "German",
  spanish: "Spanish",
  "computer-science": "Computer Science",
  technology: "Technology",
};

export function buildDiagnosticPaper(subjectIds: string[]): DiagnosticQuestion[] {
  const out: DiagnosticQuestion[] = [];
  for (const subjectId of subjectIds) {
    const custom = BANK.filter((q) => q.subjectId === subjectId);
    if (custom.length >= 2) {
      // Prefer up to 3, different strands
      const picked: DiagnosticQuestion[] = [];
      const seen = new Set<string>();
      for (const q of custom) {
        if (picked.length >= 3) break;
        if (seen.has(q.strandLabel) && picked.length >= 2) continue;
        seen.add(q.strandLabel);
        picked.push(q);
      }
      out.push(...picked.slice(0, 3));
    } else {
      out.push(...genericQuestions(subjectId, SUBJECT_NAMES[subjectId] ?? subjectId));
    }
  }
  return out;
}

/**
 * Per-subject first-open quick check: exactly 2 real content questions with KC tags.
 * Returns [] when the subject has no content bank (do not fall back to study-habit generics).
 */
export function buildSubjectQuickCheck(subjectId: string): DiagnosticQuestion[] {
  const custom = BANK.filter((q) => q.subjectId === subjectId);
  if (custom.length < 2) return [];
  const picked: DiagnosticQuestion[] = [];
  const seen = new Set<string>();
  for (const q of custom) {
    if (picked.length >= 2) break;
    if (seen.has(q.strandLabel) && picked.length >= 1) continue;
    seen.add(q.strandLabel);
    picked.push(q);
  }
  return picked.slice(0, 2);
}
