"use client";

import { getTopic } from "@/lib/constants";
import type { Subject } from "@/lib/types";
import type { SubjectLevel } from "@/lib/onboarding";
import { ExamCountdownPill } from "./exam-countdown-pill";
import { FreeTextNote } from "./free-text-note";
import type { StudyStateBySubject } from "./study-state";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";
import { useExamScheduleBadges } from "./use-exam-schedule-badges";
import { useRecommendedNextStep } from "./use-recommended-next-step";

interface HomeFeedProps {
  hasProfile: boolean;
  subjects: Subject[];
  subjectLevels?: Record<string, SubjectLevel>;
  studyState: StudyStateBySubject;
  onSelectSubject: (id: string) => void;
  onContinueSubject: (id: string, topicId?: string) => void;
  onOpenSettings: () => void;
}

export function HomeFeed({
  hasProfile,
  subjects,
  subjectLevels,
  studyState,
  onSelectSubject,
  onContinueSubject,
  onOpenSettings,
}: HomeFeedProps) {
  if (!hasProfile) return <ProfileEmptyState onOpenSettings={onOpenSettings} />;
  return (
    <HomeFeedReady
      subjects={subjects}
      subjectLevels={subjectLevels}
      studyState={studyState}
      onSelectSubject={onSelectSubject}
      onContinueSubject={onContinueSubject}
      onOpenSettings={onOpenSettings}
    />
  );
}

function HomeFeedReady({
  subjects,
  subjectLevels,
  studyState,
  onSelectSubject,
  onContinueSubject,
  onOpenSettings,
}: Omit<HomeFeedProps, "hasProfile">) {
  const { nextStep } = useRecommendedNextStep(null);
  const examBadges = useExamScheduleBadges();
  const continuation = subjects
    .map((subject) => ({ subject, state: studyState[subject.id] }))
    .find(({ state }) => state?.activities.length || state?.lastTopicId);

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-7 sm:px-6 lg:pt-10">
      <section className="mb-6 border-b border-gray-200 pb-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[12px] font-semibold text-cyan-700 dark:text-cyan-300">MY SUBJECTS</p>
            <h1 className="font-heading m-0 text-[30px] font-semibold leading-tight tracking-[-.025em] text-gray-900 dark:text-white sm:text-[36px]">
              What are you studying today?
            </h1>
            <p className="m-0 mt-2 max-w-[580px] text-[14.5px] leading-relaxed text-gray-500">
              Pick a subject to continue your revision, practise a question, or check what needs work.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-gray-300 bg-white/85 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Edit subjects
          </button>
        </div>
      </section>
      {nextStep ? (
        <StructuredContinuationCard
          subjectId={nextStep.subjectId}
          title={nextStep.title}
          reason={nextStep.reason}
          examBadge={nextStep.examBadge}
          onContinue={() => onContinueSubject(nextStep.subjectId, nextStep.topicId)}
        />
      ) : continuation ? (
        <ContinuationCard
          subject={continuation.subject}
          state={continuation.state!}
          onContinue={() => onContinueSubject(continuation.subject.id)}
        />
      ) : (
        <NewContinuationCard subject={subjects[0]} onStart={() => subjects[0] && onContinueSubject(subjects[0].id)} />
      )}
      <div className="mb-4 mt-8 flex items-center gap-3">
        <h2 className="font-heading m-0 text-[18px] font-semibold text-gray-900 dark:text-white">Your subjects</h2>
        <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            level={subjectLevels?.[subject.id] ?? "HL"}
            state={studyState[subject.id]}
            examBadge={examBadges[subject.id]}
            onView={() => onSelectSubject(subject.id)}
          />
        ))}
      </div>
      <div className="mt-8 border-t border-gray-200 pt-5 dark:border-slate-800">
        <FreeTextNote />
      </div>
    </div>
  );
}

function ProfileEmptyState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[680px] items-center px-4 py-10 sm:px-6">
      <section className="w-full border border-gray-200 bg-white/88 px-6 py-8 text-center shadow-[0_18px_42px_-38px_rgba(15,23,42,.45)] dark:border-slate-700 dark:bg-slate-900 sm:px-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600 text-lg font-semibold text-white">G</span>
        <h1 className="font-heading m-0 mt-4 text-[28px] font-semibold text-gray-900 dark:text-white">Set up your subjects first</h1>
        <p className="mx-auto mt-2 max-w-[430px] text-[14.5px] leading-relaxed text-gray-500">
          Choose your Leaving Cert subjects so your study workspace is ready for you.
        </p>
        <button type="button" onClick={onOpenSettings} className="mt-6 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
          Set up study profile
        </button>
      </section>
    </div>
  );
}

function StructuredContinuationCard({
  subjectId,
  title,
  reason,
  examBadge,
  onContinue,
}: {
  subjectId: string;
  title: string;
  reason: string;
  examBadge?: string | null;
  onContinue: () => void;
}) {
  return (
    <section
      style={subjectThemeStyle(subjectId)}
      className="subject-continuation border border-gray-200 border-l-4 bg-white/88 px-4 py-4 dark:border-slate-700 dark:bg-slate-900 sm:px-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="subject-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold">
            {subjectInitial(subjectId)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="subject-context-label text-[12px] font-semibold">RECOMMENDED NEXT STEP</div>
              {examBadge && <ExamCountdownPill label={examBadge} />}
            </div>
            <div className="mt-1 truncate font-heading text-[17px] font-semibold text-gray-900 dark:text-white">
              {subjectLabel(subjectId)}: {title}
            </div>
            <p className="m-0 mt-1 text-[13px] text-gray-500">{reason}</p>
          </div>
        </div>
        <button type="button" onClick={onContinue} className="shrink-0 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
          Continue
        </button>
      </div>
    </section>
  );
}

function ContinuationCard({
  subject,
  state,
  onContinue,
}: {
  subject: Subject;
  state: NonNullable<StudyStateBySubject[string]>;
  onContinue: () => void;
}) {
  const topic = state.lastTopicId ? getTopic(subject.id, state.lastTopicId) : null;
  const focus = state.focusAreas.find((area) => area.status === "current");
  const detail = topic
    ? `Continue: ${topic.name}`
    : focus
      ? `Focus area: ${focus.label}`
      : state.activities[0]?.label ?? "Continue your study session";
  return (
    <section
      style={subjectThemeStyle(subject.id)}
      className="subject-continuation border border-gray-200 border-l-4 bg-white/88 px-4 py-4 dark:border-slate-700 dark:bg-slate-900 sm:px-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="subject-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold">
            {subjectInitial(subject.id)}
          </span>
          <div className="min-w-0">
            <div className="subject-context-label text-[12px] font-semibold">CONTINUE STUDYING</div>
            <div className="mt-1 truncate font-heading text-[17px] font-semibold text-gray-900 dark:text-white">
              {subjectLabel(subject.id)}: {detail}
            </div>
            <p className="m-0 mt-1 text-[13px] text-gray-500">Pick up where you last left off.</p>
          </div>
        </div>
        <button type="button" onClick={onContinue} className="shrink-0 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
          Continue
        </button>
      </div>
    </section>
  );
}

function NewContinuationCard({ subject, onStart }: { subject?: Subject; onStart: () => void }) {
  return (
    <section className="border border-cyan-200 border-l-4 border-l-cyan-500 bg-white/88 px-4 py-4 dark:border-cyan-900 dark:bg-slate-900 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[12px] font-semibold text-cyan-700 dark:text-cyan-300">START HERE</div>
          <div className="mt-1 font-heading text-[17px] font-semibold text-gray-900 dark:text-white">Begin with a Tutor question</div>
          <p className="m-0 mt-1 text-[13px] text-gray-500">
            Ask about a topic, paste an exam question, or say exactly where you&apos;re stuck.
          </p>
        </div>
        <button
          type="button"
          disabled={!subject}
          onClick={onStart}
          className="shrink-0 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:bg-gray-300"
        >
          Start
        </button>
      </div>
    </section>
  );
}

function SubjectCard({
  subject,
  level,
  state,
  examBadge,
  onView,
}: {
  subject: Subject;
  level: SubjectLevel;
  state?: StudyStateBySubject[string];
  examBadge?: string;
  onView: () => void;
}) {
  const topic = state?.lastTopicId ? getTopic(subject.id, state.lastTopicId) : null;
  const focus = state?.focusAreas.find((area) => area.status === "current");
  const summary = topic ? `Continue: ${topic.name}` : focus ? `Focus area: ${focus.label}` : "No activity yet";
  return (
    <article
      style={subjectThemeStyle(subject.id)}
      className="subject-card flex min-h-[148px] flex-col rounded-xl border border-gray-200 bg-white/88 p-4 shadow-[0_12px_24px_-26px_rgba(15,23,42,.5)] transition-[background-color,border-color,box-shadow] dark:border-slate-700 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="subject-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold">
          {subjectInitial(subject.id)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-heading text-[19px] font-semibold text-gray-900 dark:text-white">{subject.name}</span>
          <span className="text-[12.5px] text-gray-400">{level === "OL" ? "Ordinary Level" : "Higher Level"}</span>
          {examBadge && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] text-gray-500">
              Exam <ExamCountdownPill label={examBadge} />
            </span>
          )}
        </span>
      </div>
      <p className="m-0 mt-4 text-[13.5px] leading-relaxed text-gray-500">{summary}</p>
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3.5 dark:border-slate-700">
        <span className="subject-context-label text-[12.5px] font-medium">View subject</span>
        <button
          type="button"
          onClick={onView}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Open
        </button>
      </div>
    </article>
  );
}
