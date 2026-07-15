export type FocusArea = {
  id: string;
  label: string;
  status: "current" | "improved";
};

export type ResultEntry = {
  id: string;
  topic: string;
  type: string;
  score: string;
  wentWell: string;
  difficult: string;
  teacherNote: string;
};

export type StudyActivity = {
  id: string;
  type: "tutor" | "question" | "reflection" | "result" | "focus" | "improved";
  label: string;
  topicId?: string;
};

export type SubjectStudyState = {
  lastTopicId?: string;
  focusAreas: FocusArea[];
  results: ResultEntry[];
  activities: StudyActivity[];
};

export type StudyStateBySubject = Record<string, SubjectStudyState>;

export function emptySubjectStudyState(): SubjectStudyState {
  return { focusAreas: [], results: [], activities: [] };
}
