"use client";

import { getSubjectTopics } from "@/lib/constants";

interface TutorTopicNavProps {
  subjectId: string;
  activeTopicId?: string;
  onSelectTopic: (topicId: string) => void;
}

export function TutorTopicSidebar({ subjectId, activeTopicId, onSelectTopic }: TutorTopicNavProps) {
  const topics = getSubjectTopics(subjectId);

  return (
    <aside className="hidden h-full overflow-y-auto border-r border-gray-200 bg-white/80 px-3 py-4 backdrop-blur-sm lg:block dark:border-slate-800/80 dark:bg-slate-950/58">
      <div className="mb-3 px-2">
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-cyan-200/70">
          Tutor topics
        </div>
        <div className="mt-1 text-[12.5px] text-gray-400 dark:text-slate-400">{topics.length} sections</div>
      </div>
      <div className="space-y-1">
        {topics.map((topic) => (
          <TopicButton
            key={topic.id}
            id={topic.id}
            label={topic.name}
            active={activeTopicId === topic.id}
            onClick={() => onSelectTopic(topic.id)}
          />
        ))}
      </div>
    </aside>
  );
}

export function TutorTopicChips({ subjectId, activeTopicId, onSelectTopic }: TutorTopicNavProps) {
  const topics = getSubjectTopics(subjectId);

  return (
    <div className="mb-4 overflow-x-auto lg:hidden">
      <div className="flex min-w-max gap-2 pb-1">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            className={[
              "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              activeTopicId === topic.id
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-400/70 dark:bg-cyan-400/14 dark:text-cyan-100"
                : "border-gray-200 bg-white text-gray-600 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-cyan-400/70 dark:hover:text-cyan-100",
            ].join(" ")}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileTutorTopicDrawer({
  subjectId,
  activeTopicId,
  open,
  onClose,
  onSelectTopic,
}: TutorTopicNavProps & { open: boolean; onClose: () => void }) {
  const topics = getSubjectTopics(subjectId);

  return (
    <div className={["fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")}>
      <button
        type="button"
        aria-label="Close topics"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-slate-950/45 backdrop-blur-[1.5px] transition-opacity dark:bg-black/55",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <aside
        aria-label="Tutor topics"
        className={[
          "absolute bottom-0 left-0 top-0 flex w-[84vw] max-w-[320px] flex-col border-r border-gray-200 bg-white/95 shadow-[20px_0_60px_-32px_rgba(15,23,42,.75)] backdrop-blur-xl transition-transform duration-200 dark:border-slate-800/80 dark:bg-slate-950/94",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-slate-800">
          <div>
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-cyan-200/70">
              Tutor topics
            </div>
            <div className="mt-1 text-[12.5px] text-gray-400 dark:text-slate-400">{topics.length} sections</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close topic sidebar"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            {topics.map((topic) => (
              <TopicButton
                key={topic.id}
                id={topic.id}
                label={topic.name}
                active={activeTopicId === topic.id}
                onClick={() => {
                  onSelectTopic(topic.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function TopicButton({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex w-full items-start gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left transition-colors",
        active
          ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-400/12 dark:text-cyan-50 dark:ring-1 dark:ring-cyan-400/20"
          : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-50",
      ].join(" ")}
    >
      {active && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-500 dark:bg-cyan-300" />}
      <span
        className={[
          "mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full",
          active ? "bg-cyan-500 dark:bg-cyan-300" : "bg-gray-300 group-hover:bg-cyan-400 dark:bg-slate-600 dark:group-hover:bg-cyan-300/80",
        ].join(" ")}
      />
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium leading-snug">{label}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.05em] text-gray-400 dark:text-slate-500 group-hover:dark:text-slate-400">
          {id}
        </span>
      </span>
    </button>
  );
}
