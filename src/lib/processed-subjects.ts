import path from "node:path";
import { SUBJECTS } from "@/lib/constants";

const PROCESSED_SUBJECTS: Record<
  string,
  {
    folderName: string;
    chunksRoot: string;
    curriculumRoot: string;
  }
> = {
  accounting: {
    folderName: "accounting-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "accounting-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "accounting-rag-preprocessing", "curriculum"),
  },
  "applied-maths": {
    folderName: "applied-maths-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "applied-maths-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "applied-maths-rag-preprocessing", "curriculum"),
  },
  biology: {
    folderName: "biology-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "biology-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "biology-rag-preprocessing", "curriculum"),
  },
  business: {
    folderName: "business-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "business-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "business-rag-preprocessing", "curriculum"),
  },
  chemistry: {
    folderName: "chemistry-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "chemistry-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "chemistry-rag-preprocessing", "curriculum"),
  },
  "computer-science": {
    folderName: "computer-science-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "computer-science-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "computer-science-rag-preprocessing", "curriculum"),
  },
  economics: {
    folderName: "economics-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "economics-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "economics-rag-preprocessing", "curriculum"),
  },
  english: {
    folderName: "english-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "english-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "english-rag-preprocessing", "curriculum"),
  },
  french: {
    folderName: "french-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "french-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "french-rag-preprocessing", "curriculum"),
  },
  geography: {
    folderName: "geography-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "geography-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "geography-rag-preprocessing", "curriculum"),
  },
  german: {
    folderName: "german-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "german-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "german-rag-preprocessing", "curriculum"),
  },
  history: {
    folderName: "history-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "history-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "history-rag-preprocessing", "curriculum"),
  },
  irish: {
    folderName: "irish-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "irish-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "irish-rag-preprocessing", "curriculum"),
  },
  maths: {
    folderName: "maths-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "maths-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "maths-rag-preprocessing", "curriculum"),
  },
  physics: {
    folderName: "physics-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "physics-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "physics-rag-preprocessing", "curriculum"),
  },
  spanish: {
    folderName: "spanish-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "spanish-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "spanish-rag-preprocessing", "curriculum"),
  },
  technology: {
    folderName: "technology-rag-preprocessing",
    chunksRoot: path.join(process.cwd(), "docs", "processed", "technology-rag-preprocessing", "output_question_chunks"),
    curriculumRoot: path.join(process.cwd(), "docs", "processed", "technology-rag-preprocessing", "curriculum"),
  },
};

export function getProcessedSubjectConfig(subjectId: string) {
  const processed = PROCESSED_SUBJECTS[subjectId];
  if (!processed) return null;

  const subject = SUBJECTS.find((candidate) => candidate.id === subjectId);
  return {
    subjectId,
    displayName: subject?.name ?? subjectId,
    ...processed,
  };
}

export function getProcessedSubjectIds() {
  return Object.keys(PROCESSED_SUBJECTS);
}
