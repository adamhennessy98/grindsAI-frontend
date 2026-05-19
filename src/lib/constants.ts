import type { Message, Subject, SubjectTopic } from "./types";

export const SUBJECTS: Subject[] = [
  { id: "accounting",     name: "Accounting",     icon: "Book",     enabled: true },
  { id: "applied-maths",  name: "Applied Maths",  icon: "Triangle", enabled: true },
  { id: "biology",        name: "Biology",        icon: "Leaf",     enabled: true },
  { id: "business",       name: "Business",       icon: "Book",     enabled: true },
  { id: "chemistry",      name: "Chemistry",      icon: "Flask",    enabled: true },
  { id: "economics",      name: "Economics",      icon: "Book",     enabled: true },
  { id: "english",        name: "English",        icon: "Book",     enabled: true },
  { id: "french",         name: "French",         icon: "Book",     enabled: true },
  { id: "geography",      name: "Geography",      icon: "Target",   enabled: true },
  { id: "german",         name: "German",         icon: "Book",     enabled: true },
  { id: "history",        name: "History",        icon: "Book",     enabled: true },
  { id: "irish",          name: "Irish",          icon: "Book",     enabled: true },
  { id: "maths",          name: "Maths",          icon: "Triangle", enabled: true },
  { id: "physics",        name: "Physics",        icon: "Target",   enabled: true },
  { id: "spanish",        name: "Spanish",        icon: "Book",     enabled: true },
  { id: "technology",     name: "Technology",     icon: "Target",   enabled: true },
];

export const SUBJECT_TOPICS: Record<string, SubjectTopic[]> = {
  accounting: [
    { id: "general", name: "General Accounting" },
    { id: "financial-statements", name: "Financial Statements" },
    { id: "cash-flow", name: "Cash Flow" },
    { id: "club-accounts", name: "Club Accounts" },
    { id: "incomplete-records", name: "Incomplete Records" },
    { id: "budgeting", name: "Budgeting" },
    { id: "ratios", name: "Ratios" },
  ],
  "applied-maths": [
    { id: "general", name: "General Applied Maths" },
    { id: "kinematics", name: "Kinematics" },
    { id: "newtonian-mechanics", name: "Newtonian Mechanics" },
    { id: "relative-velocity", name: "Relative Velocity" },
    { id: "circular-motion", name: "Circular Motion" },
    { id: "harmonic-motion", name: "Harmonic Motion" },
    { id: "differential-equations", name: "Differential Equations" },
    { id: "projectiles", name: "Projectiles" },
  ],
  biology: [
    { id: "general", name: "General Biology" },
    { id: "cell-biology", name: "Cell Biology" },
    { id: "genetics", name: "Genetics" },
    { id: "ecology", name: "Ecology" },
    { id: "human-systems", name: "Human Systems" },
    { id: "photosynthesis-respiration", name: "Photosynthesis & Respiration" },
    { id: "experiments", name: "Experiments" },
    { id: "evolution", name: "Evolution" },
  ],
  business: [
    { id: "general", name: "General Business" },
    { id: "people-in-business", name: "People in Business" },
    { id: "enterprise", name: "Enterprise" },
    { id: "management", name: "Management" },
    { id: "marketing", name: "Marketing" },
    { id: "finance", name: "Finance" },
    { id: "business-documents", name: "Business Documents" },
  ],
  chemistry: [
    { id: "general", name: "General Chemistry" },
    { id: "atomic-theory", name: "Atomic Theory" },
    { id: "bonding", name: "Bonding" },
    { id: "stoichiometry", name: "Stoichiometry" },
    { id: "organic-chemistry", name: "Organic Chemistry" },
    { id: "acids-bases", name: "Acids & Bases" },
    { id: "equilibrium", name: "Equilibrium" },
    { id: "experiments", name: "Experiments" },
  ],
  economics: [
    { id: "general", name: "General Economics" },
    { id: "supply-demand", name: "Supply & Demand" },
    { id: "market-structures", name: "Market Structures" },
    { id: "inflation", name: "Inflation" },
    { id: "banking", name: "Banking" },
    { id: "fiscal-policy", name: "Fiscal Policy" },
    { id: "international-trade", name: "International Trade" },
  ],
  english: [
    { id: "general", name: "General English" },
    { id: "poetry", name: "Poetry" },
    { id: "comparative", name: "Comparative" },
    { id: "single-text", name: "Single Text" },
    { id: "unseen-poetry", name: "Unseen Poetry" },
    { id: "composition", name: "Composition" },
    { id: "shakespeare", name: "Shakespeare" },
    { id: "language-analysis", name: "Language Analysis" },
  ],
  french: [
    { id: "general", name: "General French" },
    { id: "oral", name: "Oral" },
    { id: "listening", name: "Listening" },
    { id: "written-production", name: "Written Production" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "grammar", name: "Grammar" },
    { id: "vocabulary", name: "Vocabulary" },
  ],
  geography: [
    { id: "general", name: "General Geography" },
    { id: "physical-geography", name: "Physical Geography" },
    { id: "regional-geography", name: "Regional Geography" },
    { id: "elective", name: "Elective" },
    { id: "geoecology", name: "Geoecology" },
    { id: "map-skills", name: "Map Skills" },
  ],
  german: [
    { id: "general", name: "General German" },
    { id: "oral", name: "Oral" },
    { id: "listening", name: "Listening" },
    { id: "written-production", name: "Written Production" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "grammar", name: "Grammar" },
    { id: "vocabulary", name: "Vocabulary" },
  ],
  history: [
    { id: "general", name: "General History" },
    { id: "ireland-topics", name: "Ireland Topics" },
    { id: "europe-topics", name: "Europe Topics" },
    { id: "dictatorship-democracy", name: "Dictatorship & Democracy" },
    { id: "usa-topics", name: "USA Topics" },
    { id: "research-study-report", name: "Research Study Report" },
  ],
  irish: [
    { id: "general", name: "General Irish" },
    { id: "pros", name: "Pros" },
    { id: "filiocht", name: "Filiocht" },
    { id: "an-triail", name: "An Triail" },
    { id: "leamhthuiscint", name: "Leamhthuiscint" },
    { id: "cluastuiscint", name: "Cluastuiscint" },
    { id: "aisti-scribhneoireacht", name: "Aisti & Scribhneoireacht" },
    { id: "grammar", name: "Grammar" },
  ],
  maths: [
    { id: "general", name: "General Maths", description: "Exam strategy, study planning, and mixed-topic help." },
    { id: "algebra", name: "Algebra" },
    { id: "functions-graphs", name: "Functions & Graphs" },
    { id: "calculus", name: "Calculus" },
    { id: "sequences-series", name: "Sequences & Series" },
    { id: "complex-numbers", name: "Complex Numbers" },
    { id: "financial-maths", name: "Financial Maths" },
    { id: "coordinate-geometry", name: "Coordinate Geometry" },
    { id: "geometry-proofs", name: "Geometry & Proofs" },
    { id: "trigonometry", name: "Trigonometry" },
    { id: "probability", name: "Probability" },
    { id: "statistics", name: "Statistics" },
    { id: "area-volume-measurement", name: "Area, Volume & Measurement" },
  ],
  physics: [
    { id: "general", name: "General Physics" },
    { id: "mechanics", name: "Mechanics" },
    { id: "electricity", name: "Electricity" },
    { id: "light-sound", name: "Light & Sound" },
    { id: "heat", name: "Heat" },
    { id: "waves", name: "Waves" },
    { id: "modern-physics", name: "Modern Physics" },
    { id: "experiments", name: "Experiments" },
  ],
  spanish: [
    { id: "general", name: "General Spanish" },
    { id: "oral", name: "Oral" },
    { id: "listening", name: "Listening" },
    { id: "written-production", name: "Written Production" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "grammar", name: "Grammar" },
    { id: "vocabulary", name: "Vocabulary" },
  ],
  technology: [
    { id: "general", name: "General Technology" },
    { id: "design-process", name: "Design Process" },
    { id: "electronics", name: "Electronics" },
    { id: "systems-control", name: "Systems & Control" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "materials", name: "Materials" },
    { id: "mechanisms", name: "Mechanisms" },
    { id: "project-work", name: "Project Work" },
  ],
};

export const GENERAL_TOPIC: SubjectTopic = {
  id: "general",
  name: "General",
};

export const LEVEL_OPTIONS = [
  { id: "HL", key: "higher", label: "Higher" },
  { id: "OL", key: "ordinary", label: "Ordinary" },
] as const;

export function getSubjectTopics(subjectId: string): SubjectTopic[] {
  const configured = SUBJECT_TOPICS[subjectId];
  if (configured?.length) return configured;
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  return [{ ...GENERAL_TOPIC, name: `General ${subject?.name ?? "Subject"}` }];
}

export function getTopic(subjectId: string, topicId: string): SubjectTopic {
  return getSubjectTopics(subjectId).find((topic) => topic.id === topicId) ?? getSubjectTopics(subjectId)[0] ?? GENERAL_TOPIC;
}

export function levelKey(level: string): string {
  return level === "OL" ? "ordinary" : "higher";
}

export function conversationKey(subjectId: string, level: string, topicId: string): string {
  return `${subjectId}:${levelKey(level)}:${topicId || GENERAL_TOPIC.id}`;
}

export const STARTERS: Record<string, string[]> = {
  "maths:general": ["Help me make a revision plan", "How should I approach proofs?", "What topics are most important?"],
  "maths:algebra": ["Explain factorising quadratics", "Help me solve simultaneous equations", "When do I use the quadratic formula?"],
  "maths:functions-graphs": ["How do I sketch a function?", "Explain transformations of graphs", "What does the domain mean?"],
  "maths:calculus": ["Help me with differentiation", "Explain turning points", "How do I use integration for area?"],
  "maths:sequences-series": ["Explain arithmetic sequences", "How do geometric series work?", "Help me with sigma notation"],
  "maths:complex-numbers": ["Explain complex roots", "How do I use Argand diagrams?", "What is modulus and argument?"],
  "maths:financial-maths": ["Explain compound interest", "How do annuities work?", "Help me with depreciation questions"],
  "maths:coordinate-geometry": ["Explain the equation of a line", "Help me find a circle equation", "How do slopes show perpendicular lines?"],
  "maths:geometry-proofs": ["How do I structure a geometry proof?", "Explain similar triangles", "Help me with circle theorems"],
  "maths:trigonometry": ["Explain the sine rule", "When do I use radians?", "Help me solve trig equations"],
  "maths:probability": ["Explain conditional probability", "Help me with expected value", "How do probability trees work?"],
  "maths:statistics": ["Explain standard deviation", "How do I read a box plot?", "Help me compare data sets"],
  "maths:area-volume-measurement": ["Explain area under a curve", "Help me with volume questions", "How do I handle units?"],
  accounting: ["Help me revise Accounting", "Explain an exam question", "What should I practise first?"],
  "applied-maths": ["Help me revise Applied Maths", "Explain an exam question", "What should I practise first?"],
  business: ["Help me revise Business", "Explain an exam question", "What should I practise first?"],
  economics: ["Help me revise Economics", "Explain an exam question", "What should I practise first?"],
  english: ["Help me plan an essay", "Explain how to structure an answer", "What should I revise first?"],
  french: ["Help me prepare for the oral", "Explain a grammar point", "Help me improve written production"],
  geography: ["Help me revise Geography", "Explain an exam question", "What should I practise first?"],
  german: ["Help me prepare for the oral", "Explain a grammar point", "Help me improve written production"],
  history: ["Help me plan an essay", "Explain a topic", "How should I approach the RSR?"],
  irish: ["Help me prepare for the oral", "Explain a grammar point", "Help me plan an essay"],
  maths:     ["Help me make a revision plan", "Explain the quadratic formula", "What's on the Strand 2 syllabus?"],
  biology:   ["How does photosynthesis actually work?", "Explain the structure of DNA", "Difference between mitosis and meiosis?"],
  chemistry: ["Explain the mole concept", "How do I balance redox equations?", "Why does atomic radius change across a period?"],
  physics: ["Explain a mechanics question", "Help me with electricity", "What experiments should I know?"],
  spanish: ["Help me prepare for the oral", "Explain a grammar point", "Help me improve written production"],
  technology: ["Help me revise Technology", "Explain project work", "What should I practise first?"],
};

export const SAMPLE_CONVO: Message[] = [
  { role: "user", text: "Can you explain Pythagoras' theorem to me?" },
  { role: "ai",   text: "Great topic! Before I explain it, let me ask you something - if you have a right-angled triangle, what's special about the longest side? Do you know what it's called?" },
  { role: "user", text: "Is it called the hypotenuse?" },
  { role: "ai",   text: "Exactly right. The hypotenuse is always the side opposite the right angle, and it's always the longest side.\n\nNow, Pythagoras noticed a relationship between the lengths of all three sides. If the hypotenuse is c, and the other two sides are a and b - what do you think that relationship might look like? Take a guess, even if you're not sure." },
  { role: "user", text: "Is it a^2 + b^2 = c^2?" },
  { role: "ai",   text: "Perfect - that's it exactly. **a^2 + b^2 = c^2**.\n\nNow let's make sure you can *use* it, not just recall it. If a = 3 and b = 4, what is c? Show me your working." },
];

export function socraticReply(subjectId: string, userText: string): string {
  const lower = userText.toLowerCase();
  if ((lower.includes("answer") && (lower.includes("just") || lower.includes("give"))) || lower.includes("tell me")) {
    return "I hear you - but if I just hand you the answer, you'll forget it by Friday. Let's try a smaller version of the problem together. What's the very first thing you'd write down to start it?";
  }
  if (/^\s*c\s*=?\s*5/.test(lower) || lower.includes("=5") || lower.includes("= 5")) {
    return "Spot on - c = 5. You worked through 3^2 + 4^2 = 9 + 16 = 25, and sqrt(25) = 5.\n\nNow here's the deeper question: *why* does squaring the sides work? What is a^2 actually measuring, geometrically?";
  }
  if (subjectId === "biology") return "Good question. Before we dive in - what do *you* already know about it from class? Even a half-remembered detail gives us a starting point we can build from.";
  if (subjectId === "chemistry") return "Let's think about it from first principles. What does the question actually want you to find - and what information does it hand you for free?";
  return "Nice question. Let me ask you one back: what part of this feels unclear to you right now? Pinpointing that is half the battle.";
}
