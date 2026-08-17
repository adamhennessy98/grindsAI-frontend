"use client";

import { getSubjectTopics } from "@/lib/constants";
import { subjectThemeStyle } from "./subjects";

interface TutorTopicNavProps {
  subjectId: string;
  activeTopicId?: string;
  onSelectTopic: (topicId: string) => void;
}

export function TutorTopicSidebar({ subjectId, activeTopicId, onSelectTopic }: TutorTopicNavProps) {
  const topics = getSubjectTopics(subjectId);
  return <aside style={subjectThemeStyle(subjectId)} className="hidden h-full overflow-y-auto border-r border-gray-200 bg-white/80 px-3 py-4 dark:border-slate-800 dark:bg-slate-900/90 lg:block"><TopicList topics={topics} activeTopicId={activeTopicId} onSelectTopic={onSelectTopic} /></aside>;
}

export function MobileTutorTopicDrawer({ subjectId, activeTopicId, onSelectTopic, open, onClose }: TutorTopicNavProps & { open: boolean; onClose: () => void }) {
  const topics = getSubjectTopics(subjectId);
  if (!open) return null;
  return <div className="fixed inset-0 z-40 lg:hidden"><button type="button" aria-label="Close topic selector" onClick={onClose} className="absolute inset-0 bg-slate-950/45" /><aside style={subjectThemeStyle(subjectId)} className="relative h-full w-[min(86vw,330px)] overflow-y-auto border-r border-gray-200 bg-white px-3 py-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900"><div className="mb-4 flex items-center justify-between px-2"><div><div className="subject-context-label text-[10.5px] font-semibold">TUTOR TOPICS</div><div className="mt-1 text-[12.5px] text-gray-400">Choose the context for this chat</div></div><button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-500 dark:border-slate-700 dark:text-slate-300">Close</button></div><TopicList topics={topics} activeTopicId={activeTopicId} onSelectTopic={(id) => { onSelectTopic(id); onClose(); }} /></aside></div>;
}

function TopicList({ topics, activeTopicId, onSelectTopic }: { topics: ReturnType<typeof getSubjectTopics>; activeTopicId?: string; onSelectTopic: (topicId: string) => void }) {
  return <><div className="mb-3 hidden px-2 lg:block"><div className="subject-context-label text-[10.5px] font-semibold">TUTOR TOPICS</div><div className="mt-1 text-[12.5px] text-gray-400">{topics.length} sections</div></div><div className="space-y-1">{topics.map((topic) => <button key={topic.id} type="button" onClick={() => onSelectTopic(topic.id)} className={`group relative flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${activeTopicId === topic.id ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-400/12 dark:text-cyan-100" : "text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}><span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${activeTopicId === topic.id ? "bg-cyan-500" : "bg-gray-300 group-hover:bg-cyan-400"}`} /><span className="min-w-0"><span className="block text-[13.5px] font-medium leading-snug">{topic.name}</span></span></button>)}</div></>;
}
