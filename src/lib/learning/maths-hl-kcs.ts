/** Maths HL strand KC seed + topic name maps. Mirror of docs/learning/kc/maths_hl_kcs.json */

export const MATHS_HL_TOPIC_NAME_TO_STRAND: Record<string, string> = {
  Algebra: "algebra",
  "Functions & Graphs": "functions-graphs",
  "Functions and Graphs": "functions-graphs",
  Calculus: "calculus",
  "Sequences & Series": "sequences-series",
  "Sequences and Series": "sequences-series",
  "Complex Numbers": "complex-numbers",
  "Financial Maths": "financial-maths",
  "Coordinate Geometry": "coordinate-geometry",
  "Geometry & Proofs": "geometry-proofs",
  "Geometry and Proofs": "geometry-proofs",
  Trigonometry: "trigonometry",
  Probability: "probability",
  Statistics: "statistics",
  "Area, Volume & Measurement": "area-volume-measurement",
  "Area, Volume and Measurement": "area-volume-measurement",
  Mixed: "general",
  "General Maths": "general",
};

export const MATHS_HL_KC_IDS = [
  "maths.hl.algebra",
  "maths.hl.functions-graphs",
  "maths.hl.calculus",
  "maths.hl.sequences-series",
  "maths.hl.complex-numbers",
  "maths.hl.financial-maths",
  "maths.hl.coordinate-geometry",
  "maths.hl.geometry-proofs",
  "maths.hl.trigonometry",
  "maths.hl.probability",
  "maths.hl.statistics",
  "maths.hl.area-volume-measurement",
  "maths.hl.general",
] as const;
