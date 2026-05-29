import { readFile } from "node:fs/promises";
import path from "node:path";

const FORMULA_BOOK_PATH = path.join(process.cwd(), "docs", "Misc", "formulae_and_tables_book_extraction.md");

const TOPIC_PAGES: Record<string, number[]> = {
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

const KEYWORD_PAGES: Array<{ pattern: RegExp; pages: number[] }> = [
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
  28: "65",
  29: "66",
  30: "67",
  31: "68",
  32: "69",
  33: "46-47",
};

let pageCache: Promise<Map<number, string>> | null = null;

function printedBookPage(extractedPageNumber: number) {
  return PRINTED_BOOK_PAGES[extractedPageNumber] ?? String(extractedPageNumber);
}

async function loadPages() {
  pageCache ??= readFile(FORMULA_BOOK_PATH, "utf8").then((content) => {
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
    return pages;
  });
  return pageCache;
}

function uniquePages(pages: number[]) {
  return Array.from(new Set(pages)).sort((a, b) => a - b);
}

function mathsFormulaPages(topicId: string, userMessage: string) {
  const pages = [...(TOPIC_PAGES[topicId] ?? [])];
  for (const rule of KEYWORD_PAGES) {
    if (rule.pattern.test(userMessage)) {
      pages.push(...rule.pages);
    }
  }
  return uniquePages(pages).slice(0, 6);
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

export async function getMathsFormulaBookContext(input: {
  subjectId: string;
  topicId?: string;
  userMessage: string;
}) {
  if (input.subjectId !== "maths") return "";

  const pageNumbers = mathsFormulaPages(input.topicId ?? "general", input.userMessage);
  if (!pageNumbers.length) return "";

  const pages = await loadPages();
  const excerpts = pageNumbers.flatMap((pageNumber) => {
    const page = pages.get(pageNumber);
    return page ? [formatExcerpt(pageNumber, page)] : [];
  });

  if (!excerpts.length) return "";

  return [
    "Formulae and Tables book excerpts for Maths. When a relevant formula appears below, lead with the Formulae and Tables citation and the formula before explaining or asking a guiding question. If multiple relevant formulae appear, list the relevant options first, then help the student choose. Cite the printed book page shown in the excerpt heading, e.g. \"Formulae and Tables, p. 20\" or \"Formulae and Tables, pp. 18-19\". Do not cite the source extraction page number. If a relevant formula is not in these excerpts, do not invent a page reference. Write mathematical expressions using LaTeX with inline maths $...$ and display maths $$...$$ where appropriate.",
    excerpts.join("\n\n---\n\n"),
  ].join("\n\n");
}
