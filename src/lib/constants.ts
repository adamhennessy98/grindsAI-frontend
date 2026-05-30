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
    { id: "conceptual-framework-accounting-principles", name: "Conceptual Framework and Accounting Principles" },
    { id: "final-accounts-financial-statements", name: "Final Accounts and Financial Statements" },
    { id: "company-accounting", name: "Company Accounting" },
    { id: "published-accounts-interpretation", name: "Published Accounts and Interpretation" },
    { id: "cash-flow-statements", name: "Cash Flow Statements" },
    { id: "club-farm-service-non-profit-accounts", name: "Club, Farm, Service and Non-Profit Accounts" },
    { id: "incomplete-records-control-accounts", name: "Incomplete Records and Control Accounts" },
    { id: "cost-accounting", name: "Cost Accounting" },
    { id: "budgeting-forecasting", name: "Budgeting and Forecasting" },
    { id: "marginal-costing-decision-making", name: "Marginal Costing and Decision Making" },
    { id: "accounting-technology-computer-applications", name: "Accounting Technology and Computer Applications" },
  ],
  "applied-maths": [
    { id: "general", name: "General Applied Maths" },
    { id: "mathematical-modelling", name: "Mathematical Modelling" },
    { id: "networks-graphs", name: "Networks and Graphs" },
    { id: "algorithms-optimisation", name: "Algorithms and Optimisation" },
    { id: "kinematics", name: "Kinematics" },
    { id: "forces-newtonian-mechanics", name: "Forces and Newtonian Mechanics" },
    { id: "projectiles-connected-particles", name: "Projectiles and Connected Particles" },
    { id: "collisions-impacts", name: "Collisions and Impacts" },
    { id: "circular-motion", name: "Circular Motion" },
    { id: "differential-equations-rates-change", name: "Differential Equations and Rates of Change" },
    { id: "discrete-dynamical-systems", name: "Discrete Dynamical Systems" },
    { id: "modelling-data-technology", name: "Modelling with Data and Technology" },
  ],
  biology: [
    { id: "general", name: "General Biology" },
    { id: "scientific-method-investigation", name: "Scientific Method and Investigation" },
    { id: "ecology-ecosystems", name: "Ecology and Ecosystems" },
    { id: "food-nutrition-enzymes", name: "Food, Nutrition and Enzymes" },
    { id: "cell-structure-function", name: "Cell Structure and Cell Function" },
    { id: "photosynthesis-respiration", name: "Photosynthesis and Respiration" },
    { id: "genetics-dna-evolution", name: "Genetics, DNA and Evolution" },
    { id: "microbiology-biotechnology", name: "Microbiology and Biotechnology" },
    { id: "plant-biology", name: "Plant Biology" },
    { id: "human-biology", name: "Human Biology" },
    { id: "reproduction-growth", name: "Reproduction and Growth" },
    { id: "homeostasis-coordination", name: "Homeostasis and Coordination" },
  ],
  business: [
    { id: "general", name: "General Business" },
    { id: "people-in-business", name: "People in Business" },
    { id: "enterprise-entrepreneurship", name: "Enterprise and Entrepreneurship" },
    { id: "management-leadership", name: "Management and Leadership" },
    { id: "business-communication", name: "Business Communication" },
    { id: "marketing", name: "Marketing" },
    { id: "finance-accounting-business", name: "Finance and Accounting in Business" },
    { id: "human-resource-management", name: "Human Resource Management" },
    { id: "business-operations", name: "Business Operations" },
    { id: "domestic-business-environment", name: "Domestic Business Environment" },
    { id: "international-business-environment", name: "International Business Environment" },
    { id: "business-ethics-social-responsibility", name: "Business Ethics and Social Responsibility" },
  ],
  chemistry: [
    { id: "general", name: "General Chemistry" },
    { id: "atomic-structure-periodic-table", name: "Atomic Structure and Periodic Table" },
    { id: "chemical-bonding", name: "Chemical Bonding" },
    { id: "stoichiometry-chemical-calculations", name: "Stoichiometry and Chemical Calculations" },
    { id: "acids-bases-ph", name: "Acids, Bases and pH" },
    { id: "volumetric-analysis", name: "Volumetric Analysis" },
    { id: "organic-chemistry", name: "Organic Chemistry" },
    { id: "fuels-heats-reaction", name: "Fuels and Heats of Reaction" },
    { id: "rates-reaction-equilibrium", name: "Rates of Reaction and Equilibrium" },
    { id: "oxidation-reduction", name: "Oxidation and Reduction" },
    { id: "water-environmental-chemistry", name: "Water Chemistry and Environmental Chemistry" },
    { id: "electrochemistry", name: "Electrochemistry" },
    { id: "industrial-applied-chemistry", name: "Industrial and Applied Chemistry" },
    { id: "laboratory-experiments-practical-skills", name: "Laboratory Experiments and Practical Skills" },
  ],
  economics: [
    { id: "general", name: "General Economics" },
    { id: "what-economics-is-about", name: "What Economics Is About" },
    { id: "economic-decision-making", name: "Economic Decision Making" },
    { id: "markets-demand-supply", name: "Markets, Demand and Supply" },
    { id: "market-structures-competition", name: "Market Structures and Competition" },
    { id: "government-intervention-regulation", name: "Government Intervention and Regulation" },
    { id: "national-income-economic-growth", name: "National Income and Economic Growth" },
    { id: "money-banking-inflation", name: "Money, Banking and Inflation" },
    { id: "employment-unemployment", name: "Employment and Unemployment" },
    { id: "international-trade-globalisation", name: "International Trade and Globalisation" },
    { id: "public-finances-taxation", name: "Public Finances and Taxation" },
    { id: "economic-inequality-sustainability", name: "Economic Inequality and Sustainability" },
    { id: "research-study-economic-data", name: "Research Study and Economic Data" },
  ],
  english: [
    { id: "general", name: "General English" },
    { id: "comprehension-language-skills", name: "Comprehension and Language Skills" },
    { id: "writing-composition", name: "Writing and Composition" },
    { id: "functional-writing", name: "Functional Writing" },
    { id: "comparative-study", name: "Comparative Study" },
    { id: "single-text-study", name: "Single Text Study" },
    { id: "shakespearean-drama", name: "Shakespearean Drama" },
    { id: "poetry", name: "Poetry" },
    { id: "unseen-poetry", name: "Unseen Poetry" },
    { id: "media-visual-literacy", name: "Media and Visual Literacy" },
    { id: "critical-literacy-argument", name: "Critical Literacy and Argument" },
    { id: "oral-aural-language", name: "Oral and Aural Language" },
  ],
  french: [
    { id: "general", name: "General French" },
    { id: "oral-communication", name: "Oral Communication" },
    { id: "listening-comprehension", name: "Listening Comprehension" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "written-production", name: "Written Production" },
    { id: "grammar-language-accuracy", name: "Grammar and Language Accuracy" },
    { id: "vocabulary-idiom", name: "Vocabulary and Idiom" },
    { id: "personal-life-identity", name: "Personal Life and Identity" },
    { id: "school-work-future-plans", name: "School, Work and Future Plans" },
    { id: "travel-holidays-daily-life", name: "Travel, Holidays and Daily Life" },
    { id: "society-culture-current-issues", name: "Society, Culture and Current Issues" },
    { id: "french-speaking-culture", name: "French-Speaking Culture" },
  ],
  geography: [
    { id: "general", name: "General Geography" },
    { id: "geographical-skills", name: "Geographical Skills" },
    { id: "physical-geography", name: "Physical Geography" },
    { id: "regional-geography", name: "Regional Geography" },
    { id: "human-geography", name: "Human Geography" },
    { id: "economic-geography", name: "Economic Geography" },
    { id: "population-migration", name: "Population and Migration" },
    { id: "settlement-urban-geography", name: "Settlement and Urban Geography" },
    { id: "environmental-geography", name: "Environmental Geography" },
    { id: "climate-weather", name: "Climate and Weather" },
    { id: "geoecology", name: "Geoecology" },
    { id: "fieldwork-geographical-investigation", name: "Fieldwork and Geographical Investigation" },
    { id: "map-photograph-data-interpretation", name: "Map, Photograph and Data Interpretation" },
  ],
  german: [
    { id: "general", name: "General German" },
    { id: "oral-communication", name: "Oral Communication" },
    { id: "listening-comprehension", name: "Listening Comprehension" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "written-production", name: "Written Production" },
    { id: "grammar-language-accuracy", name: "Grammar and Language Accuracy" },
    { id: "vocabulary-idiom", name: "Vocabulary and Idiom" },
    { id: "personal-life-identity", name: "Personal Life and Identity" },
    { id: "school-work-future-plans", name: "School, Work and Future Plans" },
    { id: "travel-holidays-daily-life", name: "Travel, Holidays and Daily Life" },
    { id: "society-culture-current-issues", name: "Society, Culture and Current Issues" },
    { id: "german-speaking-culture", name: "German-Speaking Culture" },
  ],
  history: [
    { id: "general", name: "General History" },
    { id: "historical-skills-evidence", name: "Historical Skills and Evidence" },
    { id: "research-study-report", name: "Research Study Report" },
    { id: "early-modern-ireland", name: "Early Modern Ireland" },
    { id: "early-modern-europe-wider-world", name: "Early Modern Europe and the Wider World" },
    { id: "later-modern-ireland", name: "Later Modern Ireland" },
    { id: "later-modern-europe-wider-world", name: "Later Modern Europe and the Wider World" },
    { id: "politics-government", name: "Politics and Government" },
    { id: "society-economy", name: "Society and Economy" },
    { id: "religion-culture", name: "Religion and Culture" },
    { id: "war-conflict-diplomacy", name: "War, Conflict and Diplomacy" },
    { id: "nationalism-identity", name: "Nationalism and Identity" },
    { id: "documents-based-question", name: "Documents-Based Question" },
  ],
  irish: [
    { id: "general", name: "General Irish" },
    { id: "oral-communication", name: "Oral Communication" },
    { id: "listening-comprehension", name: "Listening Comprehension" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "written-production", name: "Written Production" },
    { id: "grammar-language-accuracy", name: "Grammar and Language Accuracy" },
    { id: "vocabulary-idiom", name: "Vocabulary and Idiom" },
    { id: "student-environment", name: "The Student and Their Environment" },
    { id: "school-working-life", name: "School and Working Life" },
    { id: "irish-language-around-us", name: "The Irish Language Around Us" },
    { id: "youth-life-contemporary-issues", name: "Youth Life and Contemporary Issues" },
    { id: "irish-culture", name: "Irish Culture" },
    { id: "literature-prose-poetry", name: "Literature, Prose and Poetry" },
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
    { id: "temperature-heat", name: "Temperature and Heat" },
    { id: "waves", name: "Waves" },
    { id: "sound", name: "Sound" },
    { id: "light-optics", name: "Light and Optics" },
    { id: "electricity", name: "Electricity" },
    { id: "magnetism-electromagnetism", name: "Magnetism and Electromagnetism" },
    { id: "modern-physics", name: "Modern Physics" },
    { id: "nuclear-particle-physics", name: "Nuclear and Particle Physics" },
    { id: "applied-electricity", name: "Applied Electricity" },
    { id: "mathematical-skills-formulae", name: "Mathematical Skills and Formulae" },
    { id: "laboratory-experiments-practical-skills", name: "Laboratory Experiments and Practical Skills" },
  ],
  spanish: [
    { id: "general", name: "General Spanish" },
    { id: "oral-communication", name: "Oral Communication" },
    { id: "listening-comprehension", name: "Listening Comprehension" },
    { id: "reading-comprehension", name: "Reading Comprehension" },
    { id: "written-production", name: "Written Production" },
    { id: "grammar-language-accuracy", name: "Grammar and Language Accuracy" },
    { id: "vocabulary-idiom", name: "Vocabulary and Idiom" },
    { id: "personal-life-identity", name: "Personal Life and Identity" },
    { id: "school-work-future-plans", name: "School, Work and Future Plans" },
    { id: "travel-holidays-daily-life", name: "Travel, Holidays and Daily Life" },
    { id: "society-culture-current-issues", name: "Society, Culture and Current Issues" },
    { id: "spanish-speaking-culture", name: "Spanish-Speaking Culture" },
  ],
  technology: [
    { id: "general", name: "General Technology" },
    { id: "design-process", name: "Design Process" },
    { id: "project-portfolio-work", name: "Project and Portfolio Work" },
    { id: "materials-manufacturing", name: "Materials and Manufacturing" },
    { id: "mechanisms-structures", name: "Mechanisms and Structures" },
    { id: "electronics-control-systems", name: "Electronics and Control Systems" },
    { id: "energy-power", name: "Energy and Power" },
    { id: "information-communications-technology", name: "Information and Communications Technology" },
    { id: "graphics-communication", name: "Graphics and Communication" },
    { id: "systems-problem-solving", name: "Systems and Problem Solving" },
    { id: "safety-standards-quality", name: "Safety, Standards and Quality" },
    { id: "technology-society-environment", name: "Technology, Society and the Environment" },
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
