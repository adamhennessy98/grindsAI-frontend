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
    <aside className="hidden h-full overflow-y-auto border-r border-gray-200 bg-white/80 px-3 py-4 lg:block">
      <div className="mb-3 px-2">
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-400">
          Tutor topics
        </div>
        <div className="mt-1 text-[12.5px] text-gray-400">{topics.length} sections</div>
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
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-emerald-500 hover:text-emerald-600",
            ].join(" ")}
          >
            {topic.name}
          </button>
        ))}
      </div>
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
        active ? "bg-emerald-50 text-emerald-800" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      {active && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-emerald-500" />}
      <span
        className={[
          "mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full",
          active ? "bg-emerald-500" : "bg-gray-300 group-hover:bg-emerald-400",
        ].join(" ")}
      />
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium leading-snug">{label}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.05em] text-gray-400">
          {id}
        </span>
      </span>
    </button>
  );
}
