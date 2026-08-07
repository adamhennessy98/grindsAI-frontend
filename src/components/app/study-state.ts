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
  type: "tutor" | "question" | "reflection" | "result" | "focus" | "improved" | "topic-check";
  label: string;
  topicId?: string;
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
