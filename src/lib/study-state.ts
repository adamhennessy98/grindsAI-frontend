import { SUBJECTS } from "@/lib/constants";

export type FocusArea = {
  id: string;
  label: string;
  status: "current" | "improved";
  createdAt: string;
  updatedAt: string;
};

export type ResultEntry = {
  id: string;
  topic: string;
  type: string;
  score: string;
  wentWell: string;
  difficult: string;
  teacherNote: string;
  createdAt: string;
};

export type StudyActivity = {
  id: string;
  type: "tutor" | "question" | "reflection" | "result" | "focus" | "improved" | "topic-check";
  label: string;
  topicId?: string;
  createdAt: string;
};

export type TopicCheckEntry = {
  id: string;
  topicId: string;
  topicName: string;
  completedAt: string;
  status: "independent" | "assisted";
  assistedCount: number;
  questionCount: number;
};

export type SubjectStudyState = {
  lastTopicId?: string;
  focusAreas: FocusArea[];
  results: ResultEntry[];
  activities: StudyActivity[];
  topicChecks: TopicCheckEntry[];
};

export type StudyStateBySubject = Record<string, SubjectStudyState>;

const ACTIVITY_TYPES = new Set<StudyActivity["type"]>([
  "tutor",
  "question",
  "reflection",
  "result",
  "focus",
  "improved",
  "topic-check",
]);
const SUBJECT_IDS = new Set(SUBJECTS.map((subject) => subject.id));

function stringValue(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function dateValue(value: unknown) {
  const candidate = stringValue(value, 80);
  return Number.isNaN(Date.parse(candidate)) ? new Date().toISOString() : candidate;
}

function numberValue(value: unknown, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(max, Math.floor(value)))
    : 0;
}

export function emptySubjectStudyState(): SubjectStudyState {
  return { focusAreas: [], results: [], activities: [], topicChecks: [] };
}

export function normaliseSubjectStudyState(value: unknown): SubjectStudyState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptySubjectStudyState();
  const item = value as Record<string, unknown>;
  const focusAreas = Array.isArray(item.focusAreas) ? item.focusAreas.flatMap((area) => {
    if (!area || typeof area !== "object") return [];
    const entry = area as Record<string, unknown>;
    const label = stringValue(entry.label, 180);
    if (!label) return [];
    const createdAt = dateValue(entry.createdAt ?? entry.updatedAt);
    return [{
      id: stringValue(entry.id, 120) || `focus-${createdAt}`,
      label,
      status: entry.status === "improved" ? "improved" as const : "current" as const,
      createdAt,
      updatedAt: dateValue(entry.updatedAt ?? createdAt),
    }];
  }).slice(0, 30) : [];
  const results = Array.isArray(item.results) ? item.results.flatMap((result) => {
    if (!result || typeof result !== "object") return [];
    const entry = result as Record<string, unknown>;
    const topic = stringValue(entry.topic, 180);
    if (!topic) return [];
    const createdAt = dateValue(entry.createdAt);
    return [{
      id: stringValue(entry.id, 120) || `result-${createdAt}`,
      topic,
      type: stringValue(entry.type, 80) || "Other",
      score: stringValue(entry.score, 60),
      wentWell: stringValue(entry.wentWell, 2_000),
      difficult: stringValue(entry.difficult, 2_000),
      teacherNote: stringValue(entry.teacherNote, 2_000),
      createdAt,
    }];
  }).slice(0, 60) : [];
  const activities = Array.isArray(item.activities) ? item.activities.flatMap((activity) => {
    if (!activity || typeof activity !== "object") return [];
    const entry = activity as Record<string, unknown>;
    if (!ACTIVITY_TYPES.has(entry.type as StudyActivity["type"])) return [];
    const label = stringValue(entry.label, 240);
    if (!label) return [];
    return [{
      id: stringValue(entry.id, 120) || `${entry.type}-${dateValue(entry.createdAt)}`,
      type: entry.type as StudyActivity["type"],
      label,
      topicId: stringValue(entry.topicId, 120) || undefined,
      createdAt: dateValue(entry.createdAt),
    }];
  }).slice(0, 100) : [];
  const topicChecks = Array.isArray(item.topicChecks) ? item.topicChecks.flatMap((check) => {
    if (!check || typeof check !== "object") return [];
    const entry = check as Record<string, unknown>;
    const topicId = stringValue(entry.topicId, 120);
    const topicName = stringValue(entry.topicName, 180);
    if (!topicId || !topicName) return [];
    const completedAt = dateValue(entry.completedAt);
    return [{
      id: stringValue(entry.id, 120) || `topic-check-${completedAt}`,
      topicId,
      topicName,
      completedAt,
      status: entry.status === "assisted" ? "assisted" as const : "independent" as const,
      assistedCount: numberValue(entry.assistedCount, 20),
      questionCount: numberValue(entry.questionCount, 20),
    }];
  }).slice(0, 40) : [];

  return {
    lastTopicId: stringValue(item.lastTopicId, 120) || undefined,
    focusAreas,
    results,
    activities,
    topicChecks,
  };
}

/** Validates the user-owned, small progress record before it reaches storage. */
export function normaliseStudyStateBySubject(value: unknown): StudyStateBySubject {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([subjectId]) => SUBJECT_IDS.has(subjectId))
      .slice(0, SUBJECT_IDS.size)
      .map(([subjectId, state]) => [subjectId, normaliseSubjectStudyState(state)]),
  );
}
