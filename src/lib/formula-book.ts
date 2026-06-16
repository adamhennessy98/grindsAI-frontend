import { readFile } from "node:fs/promises";
import path from "node:path";

const FORMULA_BOOK_PATH = path.join(process.cwd(), "docs", "Misc", "formulae_and_tables_book_extraction.md");
const MAX_FORMULA_BOOK_PAGES = 6;

const FORMULA_BOOK_SUBJECTS = new Set([
  "maths",
  "applied-maths",
  "physics",
  "chemistry",
  "technology",
  "economics",
]);

const SUBJECT_LABELS: Record<string, string> = {
  "applied-maths": "Applied Maths",
  chemistry: "Chemistry",
  economics: "Economics",
  maths: "Maths",
  physics: "Physics",
  technology: "Technology",
};

const MATHS_TOPIC_PAGES: Record<string, number[]> = {
  algebra: [120, 121, 13],
  "functions-graphs": [10, 120, 14, 15],
  calculus: [14, 15],
  "sequences-series": [122],
  "complex-numbers": [120],
  "financial-maths": [16, 17],
  "coordinate-geometry": [10, 11],
  "geometry-proofs": [11],
  trigonometry: [7, 8, 9],
  probability: [18, 19],
  statistics: [18, 19],
  "area-volume-measurement": [4, 109, 5, 6, 26, 27],
};

const SUBJECT_TOPIC_PAGES: Record<string, Record<string, number[]>> = {
  maths: MATHS_TOPIC_PAGES,
  "applied-maths": {
    "mathematical-modelling": [26, 27, 28, 29, 30, 31],
    kinematics: [36, 28, 29, 30, 31],
    "forces-newtonian-mechanics": [36, 37, 39, 40, 28, 29],
    "projectiles-connected-particles": [36, 37, 7, 8, 9],
    "collisions-impacts": [36, 40],
    "circular-motion": [37, 39],
    "differential-equations-rates-change": [14, 15, 39],
    "discrete-dynamical-systems": [122],
    "modelling-data-technology": [18, 19, 20, 21],
  },
  chemistry: {
    "atomic-structure-periodic-table": [51, 52, 53, 54],
    "chemical-bonding": [51, 53],
    "stoichiometry-chemical-calculations": [640, 26, 27, 29, 30, 33, 51],
    "acids-bases-ph": [640, 121, 26, 27, 29, 33],
    "volumetric-analysis": [640, 26, 27, 29, 30, 33],
    "organic-chemistry": [51, 52, 53],
    "fuels-heats-reaction": [640, 33, 41],
    "rates-reaction-equilibrium": [640, 121, 33],
    "oxidation-reduction": [33, 43, 44, 51, 52, 53],
    "water-environmental-chemistry": [26, 27, 29, 51],
    electrochemistry: [33, 43, 44],
    "industrial-applied-chemistry": [640, 26, 27, 29, 33, 51],
    "laboratory-experiments-practical-skills": [26, 27, 28, 29, 30, 31],
  },
  economics: {
    "economic-decision-making": [16, 17],
    "markets-demand-supply": [18, 19],
    "national-income-economic-growth": [16, 17, 18, 19],
    "money-banking-inflation": [16, 17],
    "employment-unemployment": [18, 19],
    "international-trade-globalisation": [16, 17],
    "public-finances-taxation": [16, 17],
    "economic-inequality-sustainability": [18, 19],
    "research-study-economic-data": [18, 19, 20, 21, 24, 25],
  },
  physics: {
    mechanics: [36, 37, 38, 39, 40, 41],
    "temperature-heat": [580, 31, 33, 41],
    waves: [590, 41, 42, 31],
    sound: [590, 41, 31],
    "light-optics": [42],
    electricity: [43, 44, 46, 47, 48, 49],
    "magnetism-electromagnetism": [33, 43, 44],
    "modern-physics": [33, 34, 35, 45],
    "nuclear-particle-physics": [33, 34, 35, 45],
    "applied-electricity": [43, 44, 46, 47, 48, 49],
    "mathematical-skills-formulae": [26, 27, 28, 29, 30, 31],
    "laboratory-experiments-practical-skills": [26, 27, 28, 29, 30, 31],
  },
  technology: {
    "project-portfolio-work": [26, 27, 28, 29, 30, 31],
    "materials-manufacturing": [31, 39, 40],
    "mechanisms-structures": [36, 37, 39, 40],
    "electronics-control-systems": [43, 44, 720, 730, 740, 750, 760, 770],
    "energy-power": [40, 41, 43, 44],
    "information-communications-technology": [240, 720, 730, 740, 750, 760, 770],
    "graphics-communication": [10, 11],
    "systems-problem-solving": [43, 44, 720, 730, 740, 750, 760, 770],
    "safety-standards-quality": [26, 27, 28],
  },
};

const MATHS_KEYWORD_PAGES: Array<{ pattern: RegExp; pages: number[] }> = [
  { pattern: /\b(sector|arc)\b/i, pages: [109] },
  { pattern: /\b(area|perimeter|circle|triangle|parallelogram)\b/i, pages: [4] },
  { pattern: /\b(volume|surface area|cylinder|cone|sphere|frustum|pyramid|prism)\b/i, pages: [5] },
  { pattern: /\b(trapezoidal|simpson|approximation)\b/i, pages: [6] },
  { pattern: /\b(trig|sine|cosine|tan|radian|degree|unit circle)\b/i, pages: [7, 8, 9] },
  { pattern: /\b(slope|line|midpoint|distance|coordinate|co-ordinate|circle equation|tangent)\b/i, pages: [10, 11] },
  { pattern: /\b(algebra|quadratic|matrix|matrices)\b/i, pages: [120] },
  { pattern: /\b(logs?|logarithm|indices|index)\b/i, pages: [121] },
  { pattern: /\b(sequence|series|arithmetic|geometric)\b/i, pages: [122] },
  { pattern: /\b(calculus|differentiat|derivative|integrat|newton-raphson|maclaurin|taylor)\b/i, pages: [14, 15] },
  { pattern: /\b(apr|annuit|amortis|mortgage|loan|depreciation|compound interest|financial)\b/i, pages: [16, 17] },
  { pattern: /\b(mean|standard deviation|sampling|hypothesis|binomial|poisson|normal distribution|probability)\b/i, pages: [18, 19] },
  { pattern: /\b(z-score|standard normal|normal table|area under the standard normal)\b/i, pages: [20, 21] },
  { pattern: /(chi|chi-squared|chi squared|\u03c7)/i, pages: [22, 23] },
  { pattern: /\b(t-distribution|student'?s t|t-test|two-tailed)\b/i, pages: [24, 25] },
  { pattern: /\b(unit|units|si prefix|measurement)\b/i, pages: [26, 27, 28] },
  { pattern: /\b(constant|gravity|speed of light|planck|avogadro)\b/i, pages: [33] },
];

const SHARED_KEYWORD_PAGES: Array<{ pattern: RegExp; pages: number[] }> = [
  { pattern: /\b(logic symbols?|logic gate symbols?|logic gates?|boolean symbols?|de morgan|quantifiers?|there exists|for all)\b/i, pages: [240] },
  { pattern: /\b(and|or|not|nand|nor)\s+(symbol|symbols|logic)\b/i, pages: [240] },
  { pattern: /\b(switch symbols?|switch diagrams?)\b/i, pages: [720] },
  { pattern: /\b(conductor symbols?|power supply symbols?|battery symbol|cell symbol|fuse symbol|earth symbol)\b/i, pages: [730] },
  { pattern: /\b(resistor symbols?|resistor diagrams?|rheostat|thermistor|light-dependent resistor|ldr|potential divider)\b/i, pages: [740] },
  { pattern: /\b(capacitor symbols?|diode symbols?|led symbol|meter symbols?|voltmeter|ammeter|ohmmeter|oscilloscope)\b/i, pages: [750] },
  { pattern: /\b(transistor symbols?|amplifier symbol|microphone symbol|loudspeaker|buzzer|aerial|antenna)\b/i, pages: [760] },
  { pattern: /\b(lamp symbols?|motor symbol|heater symbol|inductor symbol|other devices?)\b/i, pages: [770] },
  { pattern: /\b(common physical quantities|symbols and units|symbol for|si unit for|unit symbol)\b/i, pages: [650] },
  { pattern: /\b(unit|units|si unit|si units|prefix|prefixes|measurement)\b/i, pages: [26, 27, 28, 29, 30, 31] },
  { pattern: /\b(constant|constants|gravity|speed of light|planck|avogadro|gas constant|faraday)\b/i, pages: [33] },
  { pattern: /\b(logs?|logarithm|exponent|exponents|indices|index)\b/i, pages: [121] },
  { pattern: /\b(mean|standard deviation|correlation|normal distribution|z-score|statistics|statistical)\b/i, pages: [18, 19, 20, 21] },
  { pattern: /\b(t-test|student'?s t|chi-squared|chi squared|\u03c7)\b/i, pages: [22, 23, 24, 25] },
  { pattern: /\b(compound interest|present value|future value|amortis|annuit|apr|aer|depreciation|percentage change|index number)\b/i, pages: [16, 17] },
  { pattern: /\b(trig|sine|cosine|tan|radian|projectile|angle|vector|vectors)\b/i, pages: [7, 8, 9, 11] },
  { pattern: /\b(coordinate|co-ordinate|slope|line|circle equation|calculus|differentiat|integrat)\b/i, pages: [10, 11, 14, 15] },
  { pattern: /\b(circular motion|centripetal)\b/i, pages: [510] },
  { pattern: /\b(gravitation|satellite|gravitational field)\b/i, pages: [560] },
  { pattern: /\b(simple harmonic|shm|pendulum|hooke)\b/i, pages: [540] },
  { pattern: /\b(energy|work|power|efficiency)\b/i, pages: [550] },
  { pattern: /\b(force|acceleration|velocity|momentum|impulse|energy|power|work|torque|moment|stress|strain|young'?s modulus)\b/i, pages: [36, 37, 39, 40] },
  { pattern: /\b(heat|temperature|specific heat|latent heat)\b/i, pages: [580] },
  { pattern: /\b(pressure|fluid|boyle)\b/i, pages: [41] },
  { pattern: /\b(wave|frequency|wavelength|sound|doppler|string)\b/i, pages: [590] },
  { pattern: /\b(light|lens|mirror|refraction|diffraction|optics)\b/i, pages: [42] },
  { pattern: /\b(circuit|electricity|current|voltage|resistance|resistor|ohm|capacitor|capacitance|transformer|diode|transistor|led)\b/i, pages: [43, 44, 46, 47, 48, 49] },
  { pattern: /\b(radioactivity|half-life|nuclear|particle|photon|photoelectric|quark|lepton|baryon|meson)\b/i, pages: [33, 34, 35, 45] },
  { pattern: /\b(Fe|Na|Cl|Mg|Ca|Cu|Zn|Al|Ag|Au|Pb|Sn|K)\b/, pages: [51] },
  { pattern: /\b(iron|sodium|chlorine|magnesium|calcium|copper|zinc|aluminium|aluminum|silver|gold|lead|tin|potassium)\b/i, pages: [51] },
  { pattern: /\b(periodic table|element|atomic mass|relative atomic mass|mole|molar mass|ionisation|electronegativity)\b/i, pages: [51, 52, 53, 54] },
  { pattern: /\b(table of nuclides?|nuclide|nuclides|isotope|isotopes)\b/i, pages: [830] },
  { pattern: /\b(ph|ionic product of water|standard temperature|standard pressure|molar volume|universal gas equation|atomic mass unit)\b/i, pages: [640] },
  { pattern: /\b(acid|base|gas|pressure|volume|temperature|equilibrium|electrochemistry|redox|oxidation|reduction)\b/i, pages: [640, 33, 41, 43, 44, 51, 121] },
];

const SUBJECT_KEYWORD_PAGES: Record<string, Array<{ pattern: RegExp; pages: number[] }>> = {
  maths: MATHS_KEYWORD_PAGES,
  "applied-maths": SHARED_KEYWORD_PAGES,
  chemistry: SHARED_KEYWORD_PAGES,
  economics: SHARED_KEYWORD_PAGES,
  physics: SHARED_KEYWORD_PAGES,
  technology: SHARED_KEYWORD_PAGES,
};

const PRINTED_BOOK_PAGES: Record<number, string> = {
  4: "8",
  109: "9",
  5: "10-11",
  6: "12",
  7: "13",
  8: "14",
  9: "15-16",
  10: "18-19",
  11: "17-19",
  12: "20-22",
  120: "20",
  121: "21",
  122: "22",
  13: "23-24",
  14: "25-27",
  15: "26-27",
  16: "30-31",
  17: "32",
  18: "33-35",
  19: "34",
  20: "36",
  21: "37",
  22: "38",
  23: "39",
  24: "40",
  25: "41",
  26: "44",
  27: "45",
  28: "65-66",
  29: "66-67",
  30: "67-68",
  31: "68-69",
  32: "69-70",
  33: "46-47",
  34: "48",
  35: "49",
  36: "50-51",
  37: "51-56",
  38: "52-53",
  39: "53-54",
  40: "55-57",
  41: "58-59",
  42: "60",
  43: "61",
  44: "62",
  45: "63",
  46: "72-73",
  47: "73-74",
  48: "74-75",
  49: "76-77",
  50: "77",
  51: "79",
  52: "80",
  53: "81",
  54: "82",
};

const MANUAL_FORMULA_BOOK_EXCERPTS: Record<number, string> = {
  240: [
    "## Formulae and Tables printed page 24 - Logic symbols",
    "",
    "- Logic symbols: AND, OR, NOT, NAND, NOR",
    "- Also includes symbols for implies, is equivalent to, for all, there exists, yields/therefore",
    "- Includes De Morgan's laws and negation/quantifier identities",
  ].join("\n"),
  510: [
    "## Formulae and Tables printed page 51 - Mechanics: Collisions and motion in a circle",
    "",
    "- Includes momentum of a particle, Newton's experimental law, conservation of momentum, and impulse",
    "- Includes circular motion formulae: $\\theta = \\frac{s}{r}$, $\\omega = \\frac{\\theta}{t}$, $v = r\\omega$, $a = r\\omega^2 = \\frac{v^2}{r}$, $F = mr\\omega^2 = \\frac{mv^2}{r}$",
  ].join("\n"),
  540: [
    "## Formulae and Tables printed page 54 - Mechanics: Rotating bodies and simple harmonic motion",
    "",
    "- Includes angular momentum, moment of force, torque of a couple, and Newton's second law for rotation",
    "- Includes simple harmonic motion formulae including $a = -\\omega^2s$, $T = \\frac{2\\pi}{\\omega}$, $s = A\\sin(\\omega t + \\alpha)$, and $v^2 = \\omega^2(A^2 - s^2)$",
    "- Includes simple and compound pendulum formulae",
  ].join("\n"),
  550: [
    "## Formulae and Tables printed page 55 - Mechanics: Energy and work",
    "",
    "- Includes work, power, percentage efficiency, gravitational potential energy, kinetic energy, conservation of mechanical energy, and $E = mc^2$",
  ].join("\n"),
  560: [
    "## Formulae and Tables printed page 56 - Mechanics: Gravitation",
    "",
    "- Includes Newton's law of gravitation, weight, acceleration due to gravity, gravitational field strength, and period of a satellite",
  ].join("\n"),
  720: [
    "## Formulae and Tables printed page 72 - Electrical circuit symbols: Switches",
    "",
    "This page shows standard switch symbols.",
  ].join("\n"),
  730: [
    "## Formulae and Tables printed page 73 - Electrical circuit symbols: Conductors and power supply",
    "",
    "This page shows conductor, cell, battery, d.c. supply, a.c. supply, transformer, fuse, and earth symbols.",
  ].join("\n"),
  740: [
    "## Formulae and Tables printed page 74 - Electrical circuit symbols: Resistors and capacitors",
    "",
    "This page shows fixed resistor, variable resistor/rheostat, preset variable resistor, potential divider, thermistor, light-dependent resistor (LDR), and capacitor symbols.",
  ].join("\n"),
  750: [
    "## Formulae and Tables printed page 75 - Electrical circuit symbols: Diodes and meters",
    "",
    "This page shows diode, Zener diode, photodiode, light-emitting diode (LED), voltmeter, galvanometer, ammeter, ohmmeter, and oscilloscope symbols.",
  ].join("\n"),
  760: [
    "## Formulae and Tables printed page 76 - Electrical circuit symbols: Transistors, amplification, and audio",
    "",
    "This page shows transistor, JFET, phototransistor, amplifier, microphone, earphone, loudspeaker, bell, buzzer, piezoelectric transducer, and aerial/antenna symbols.",
  ].join("\n"),
  770: [
    "## Formulae and Tables printed page 77 - Electrical circuit symbols: Lamps and other devices",
    "",
    "This page shows filament lamp, signal lamp, neon lamp, motor, heater, inductor, and inductor with ferromagnetic core symbols.",
  ].join("\n"),
  50: [
    "## Formulae and Tables printed page 77 - Electrical circuit symbols: Lamps and other devices",
    "",
    "This page shows filament lamp, signal lamp, neon lamp, motor, heater, inductor, and inductor with ferromagnetic core symbols. Logic symbols such as AND, OR, NOT, NAND, and NOR are on Formulae and Tables printed page 24.",
  ].join("\n"),
  640: [
    "## Formulae and Tables printed page 64 - Chemistry",
    "",
    "- Includes standard temperature $273.15\\ K$, triple point of water $273.16\\ K$, standard pressure $1.01325 \\times 10^5\\ Pa$, molar volume $22.4\\ L$ at standard pressure and temperature",
    "- Includes $pH = -\\log_{10}[H^+] = -\\log_{10}[H_3O^+]$",
    "- Includes ionic product of water $K_w = [H^+][OH^-] = [H_3O^+][OH^-]$",
    "- Includes universal gas equation $pV = nRT = NkT$ and atomic mass unit data",
  ].join("\n"),
  650: [
    "## Formulae and Tables printed pages 65-70 - Symbols and units of measurement of common physical quantities",
    "",
    "These pages contain the alphabetical table of common physical quantities, their symbols, and SI units. Use this reference for questions asking what symbol or SI unit is used for a physical quantity.",
  ].join("\n"),
  580: [
    "## Formulae and Tables printed page 58 - Heat and Temperature",
    "",
    "- Celsius temperature: $t / ^\\circ C = T / K - 273.15$",
    "- Energy needed to change temperature: $\\Delta E = mc\\Delta\\theta = C\\Delta\\theta$",
    "- Energy needed to change state: $\\Delta E = ml = L$",
  ].join("\n"),
  590: [
    "## Formulae and Tables printed page 59 - Light and Sound",
    "",
    "- Velocity of a wave: $c = f\\lambda$",
    "- Doppler effect: $f' = \\frac{cf}{c \\pm u}$",
    "- Fundamental frequency of a stretched string: $f = \\frac{1}{2l}\\sqrt{\\frac{T}{\\mu}}$",
  ].join("\n"),
  830: [
    "## Formulae and Tables printed page 83 - Table of Nuclides",
    "",
    "This printed page contains the Table of Nuclides, including mass of stable nuclides, percentage natural abundance for stable nuclides, and half-life for long-lived isotopes. The current markdown extraction does not include the full table body, so cite this page only when directing students to the reference book and do not invent nuclide values from the extraction.",
  ].join("\n"),
};

let pageCache: Promise<Map<number, string>> | null = null;
let warnedMissingFormulaBook = false;

function printedBookPage(extractedPageNumber: number) {
  return PRINTED_BOOK_PAGES[extractedPageNumber] ?? String(extractedPageNumber);
}

async function loadPages() {
  pageCache ??= readFile(FORMULA_BOOK_PATH, "utf8")
    .then((content) => {
      const pages = new Map<number, string>();
      const normalized = content.replace(/\r\n/g, "\n");
      for (const section of normalized.split(/\n---\n\n/)) {
        const printedPageMatch = section.match(/^## Formulae and Tables printed page\s+(\d+)\b/);
        const extractionPageMatch = section.match(/^## Page\s+(\d+)\b/);
        if (printedPageMatch) {
          pages.set(Number(`1${printedPageMatch[1]}`), section.trim());
        } else if (extractionPageMatch) {
          pages.set(Number(extractionPageMatch[1]), section.trim());
        }
      }
      for (const [manualPageNumber, excerpt] of Object.entries(MANUAL_FORMULA_BOOK_EXCERPTS)) {
        pages.set(Number(manualPageNumber), excerpt);
      }
      return pages;
    })
    .catch((error) => {
      if (!warnedMissingFormulaBook) {
        console.warn(`[Formulae and Tables] Context file is unavailable at ${FORMULA_BOOK_PATH}.`, error);
        warnedMissingFormulaBook = true;
      }
      return new Map<number, string>();
    });
  return pageCache;
}

function uniquePages(pages: number[]) {
  return Array.from(new Set(pages)).sort((a, b) => a - b);
}

function uniquePagesInOrder(pages: number[]) {
  return Array.from(new Set(pages));
}

function formulaBookPages(subjectId: string, topicId: string, userMessage: string) {
  const topicPages = SUBJECT_TOPIC_PAGES[subjectId]?.[topicId] ?? [];
  const keywordPages: number[] = [];
  for (const rule of SUBJECT_KEYWORD_PAGES[subjectId] ?? []) {
    if (rule.pattern.test(userMessage)) {
      keywordPages.push(...rule.pages);
    }
  }
  if (subjectId === "maths") {
    return uniquePages([...topicPages, ...keywordPages]).slice(0, MAX_FORMULA_BOOK_PAGES);
  }
  return uniquePagesInOrder([...keywordPages, ...topicPages]).slice(0, MAX_FORMULA_BOOK_PAGES);
}

function formatExcerpt(pageNumber: number, excerpt: string) {
  if (/^## Formulae and Tables printed page\s+\d+\b/m.test(excerpt)) {
    return excerpt;
  }

  const displayPage = printedBookPage(pageNumber);
  return excerpt.replace(
    /^## Page\s+(\d+)\s+[\u002d\u2013\u2014]\s+(.+)$/m,
    `## Formulae and Tables printed page ${displayPage} - $2 (source extraction page $1)`,
  );
}

export async function getFormulaBookContext(input: {
  subjectId: string;
  level?: string;
  topicId?: string;
  userMessage: string;
}) {
  if (!FORMULA_BOOK_SUBJECTS.has(input.subjectId)) return "";

  const pageNumbers = formulaBookPages(input.subjectId, input.topicId ?? "general", input.userMessage);
  if (!pageNumbers.length) return "";

  const pages = await loadPages();
  const excerpts = pageNumbers.flatMap((pageNumber) => {
    const page = pages.get(pageNumber);
    return page ? [formatExcerpt(pageNumber, page)] : [];
  });

  if (!excerpts.length) return "";

  const subjectName = SUBJECT_LABELS[input.subjectId] ?? input.subjectId;
  return [
    `Formulae and Tables book excerpts for ${subjectName}. These are supporting references only; prioritise processed past-paper and marking-scheme context first, then syllabus scope, then these excerpts where relevant. When a relevant formula or table appears below, lead with the Formulae and Tables citation and the formula/table before explaining or asking a guiding question. If multiple relevant formulae appear, list the relevant options first, then help the student choose. Cite the student-visible page number shown in the excerpt heading, which is the page number printed at the bottom centre of the Formulae and Tables book, e.g. "Formulae and Tables, p. 20" or "Formulae and Tables, pp. 18-19". Do not cite the source extraction page number. If a relevant formula is not in these excerpts, do not invent a page reference. Prefer Formulae and Tables notation when available. Write mathematical expressions using LaTeX with inline maths $...$ and display maths $$...$$ where appropriate.`,
    excerpts.join("\n\n---\n\n"),
  ].join("\n\n");
}

export async function getMathsFormulaBookContext(input: {
  subjectId: string;
  topicId?: string;
  userMessage: string;
}) {
  if (input.subjectId !== "maths") return "";
  return getFormulaBookContext(input);
}
