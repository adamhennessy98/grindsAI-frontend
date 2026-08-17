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

export function emptySubjectStudyState(): SubjectStudyState {
  return { focusAreas: [], results: [], activities: [], topicChecks: [] };
}

const STORAGE_PREFIX = "grindsai-study-state:v1:";

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function dateValue(value: unknown) {
  const candidate = stringValue(value);
  return Number.isNaN(Date.parse(candidate)) ? new Date().toISOString() : candidate;
}

function subjectState(value: unknown): SubjectStudyState {
  if (!value || typeof value !== "object") return emptySubjectStudyState();
  const item = value as Record<string, unknown>;
  const focusAreas = Array.isArray(item.focusAreas) ? item.focusAreas.flatMap((area) => {
    if (!area || typeof area !== "object") return [];
    const entry = area as Record<string, unknown>;
    const label = stringValue(entry.label).trim();
    if (!label) return [];
    const timestamp = dateValue(entry.createdAt ?? entry.updatedAt);
    return [{ id: stringValue(entry.id) || `focus-${timestamp}`, label, status: entry.status === "improved" ? "improved" as const : "current" as const, createdAt: timestamp, updatedAt: dateValue(entry.updatedAt ?? timestamp) }];
  }) : [];
  const results = Array.isArray(item.results) ? item.results.flatMap((result) => {
    if (!result || typeof result !== "object") return [];
    const entry = result as Record<string, unknown>;
    const topic = stringValue(entry.topic).trim();
    if (!topic) return [];
    const createdAt = dateValue(entry.createdAt);
    return [{ id: stringValue(entry.id) || `result-${createdAt}`, topic, type: stringValue(entry.type) || "Other", score: stringValue(entry.score), wentWell: stringValue(entry.wentWell), difficult: stringValue(entry.difficult), teacherNote: stringValue(entry.teacherNote), createdAt }];
  }) : [];
  const activities = Array.isArray(item.activities) ? item.activities.flatMap((activity) => {
    if (!activity || typeof activity !== "object") return [];
    const entry = activity as Record<string, unknown>;
    const type = entry.type;
    if (type !== "tutor" && type !== "question" && type !== "reflection" && type !== "result" && type !== "focus" && type !== "improved" && type !== "topic-check") return [];
    const label = stringValue(entry.label).trim();
    if (!label) return [];
    return [{ id: stringValue(entry.id) || `${type}-${dateValue(entry.createdAt)}`, type: type as StudyActivity["type"], label, topicId: stringValue(entry.topicId) || undefined, createdAt: dateValue(entry.createdAt) }];
  }) : [];
  const topicChecks = Array.isArray(item.topicChecks) ? item.topicChecks.flatMap((check) => {
    if (!check || typeof check !== "object") return [];
    const entry = check as Record<string, unknown>;
    const topicId = stringValue(entry.topicId);
    const topicName = stringValue(entry.topicName);
    if (!topicId || !topicName) return [];
    return [{ id: stringValue(entry.id) || `topic-check-${dateValue(entry.completedAt)}`, topicId, topicName, completedAt: dateValue(entry.completedAt), status: entry.status === "assisted" ? "assisted" as const : "independent" as const, assistedCount: typeof entry.assistedCount === "number" ? entry.assistedCount : 0, questionCount: typeof entry.questionCount === "number" ? entry.questionCount : 0 }];
  }) : [];
  return { lastTopicId: stringValue(item.lastTopicId) || undefined, focusAreas, results, activities, topicChecks };
}

export function loadStudyState(ownerId: string): StudyStateBySubject {
  if (typeof window === "undefined" || !ownerId) return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${ownerId}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(parsed).map(([subjectId, state]) => [subjectId, subjectState(state)]));
  } catch {
    return {};
  }
}

export function saveStudyState(ownerId: string, state: StudyStateBySubject) {
  if (typeof window === "undefined" || !ownerId) return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${ownerId}`, JSON.stringify(state));
  } catch {
    // Browser privacy settings can disable local storage; the in-memory experience still works.
  }
}
