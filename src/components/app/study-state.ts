import { normaliseSubjectStudyState } from "@/lib/study-state";
import type { StudyStateBySubject } from "@/lib/study-state";

export type { FocusArea, ResultEntry, StudyActivity, SubjectStudyState, StudyStateBySubject, TopicCheckEntry } from "@/lib/study-state";
export { emptySubjectStudyState } from "@/lib/study-state";

const STORAGE_PREFIX = "grindsai-study-state:v1:";


export function loadStudyState(ownerId: string): StudyStateBySubject {
  if (typeof window === "undefined" || !ownerId) return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${ownerId}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(parsed).map(([subjectId, state]) => [subjectId, normaliseSubjectStudyState(state)]));
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
