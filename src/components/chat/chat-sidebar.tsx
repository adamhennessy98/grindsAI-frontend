"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { conversationKey, SUBJECTS } from "@/lib/constants";
import type { ConversationSummary, SubjectTopic } from "@/lib/types";
import { SubjectIcon, LogoIcon, CloseIcon, SettingsIcon, MessageCircleIcon } from "@/components/icons";

interface SidebarProps {
  subjectId: string;
  level: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  conversations: ConversationSummary[];
  activeTopicId: string;
  topics: SubjectTopic[];
  loadingConversations: boolean;
  onSelectConversation: (conversation: ConversationSummary) => void;
  onSelectSubject: (id: string) => void;
  onSelectTopic: (id: string) => void;
  onSetLevel: (l: string) => void;
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  subjectId,
  level,
  userName,
  userEmail,
  userInitials,
  conversations,
  activeTopicId,
  topics,
  loadingConversations,
  onSelectConversation,
  onSelectSubject,
  onSelectTopic,
  onSetLevel,
  open,
  onClose,
}: SidebarProps) {
  const [mobilePanel, setMobilePanel] = useState<"subjects" | "topics">("subjects");
  const activeSubject = SUBJECTS.find((subject) => subject.id === subjectId);
  const topicConversations = useMemo(() => {
    const byTopic = new Map<string, ConversationSummary>();
    for (const topic of topics) {
      const key = conversationKey(subjectId, level, topic.id);
      const match = conversations.find((conversation) => conversation.conversationKey === key);
      if (match) byTopic.set(topic.id, match);
    }
    return byTopic;
  }, [conversations, level, subjectId, topics]);

  const selectSubject = (id: string) => {
    onSelectSubject(id);
    setMobilePanel("topics");
  };

  const selectTopic = (topicId: string, conversation?: ConversationSummary) => {
    if (conversation) {
      onSelectConversation(conversation);
    } else {
      onSelectTopic(topicId);
    }
    onClose();
    setMobilePanel("subjects");
  };

  return (
    <aside
      className={[
        "flex h-screen bg-gray-50 border-r border-gray-200 shrink-0",
        "max-[860px]:fixed max-[860px]:top-0 max-[860px]:left-0 max-[860px]:bottom-0 max-[860px]:z-[90]",
        "max-[860px]:w-[286px] max-[860px]:flex-col",
        "max-[860px]:transition-transform max-[860px]:duration-[220ms]",
        open ? "max-[860px]:translate-x-0 max-[860px]:shadow-xl" : "max-[860px]:-translate-x-full",
      ].join(" ")}
    >
      <SubjectColumn
        subjectId={subjectId}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
        onSelectSubject={selectSubject}
        onClose={onClose}
        hiddenOnMobile={mobilePanel === "topics"}
      />

      <TopicColumn
        title={`${activeSubject?.name ?? "Subject"} Topics`}
        level={level}
        topics={topics}
        activeTopicId={activeTopicId}
        topicConversations={topicConversations}
        loadingConversations={loadingConversations}
        onSetLevel={onSetLevel}
        onSelectTopic={selectTopic}
        onBack={() => setMobilePanel("subjects")}
        visibleOnMobile={mobilePanel === "topics"}
      />
    </aside>
  );
}

function SubjectColumn({
  subjectId,
  userName,
  userEmail,
  userInitials,
  onSelectSubject,
  onClose,
  hiddenOnMobile,
}: {
  subjectId: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  onSelectSubject: (id: string) => void;
  onClose: () => void;
  hiddenOnMobile: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col h-screen w-[220px] max-[860px]:w-full shrink-0",
        hiddenOnMobile ? "max-[860px]:hidden" : "",
      ].join(" ")}
    >
      <div className="px-4 pt-[18px] pb-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={24} />
            <span className="text-[15.5px] font-semibold tracking-[-0.01em]">GrindsAI</span>
          </Link>
          <button
            onClick={onClose}
            className="min-[861px]:hidden text-gray-500 p-1 hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </div>

      <div className="px-3.5 flex-1 overflow-auto">
        <SectionLabel>Subjects</SectionLabel>
        <div className="flex flex-col gap-[3px]">
          {SUBJECTS.map((subject) => {
            const active = subjectId === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => subject.enabled && onSelectSubject(subject.id)}
                disabled={!subject.enabled}
                className={[
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[13.5px] transition-all border",
                  active
                    ? "bg-white border-gray-200 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)] text-gray-900 font-medium"
                    : "border-transparent hover:bg-black/[0.04]",
                  !subject.enabled ? "opacity-85 cursor-not-allowed text-gray-400" : active ? "" : "text-gray-600",
                ].join(" ")}
              >
                <span className={`w-[22px] h-[22px] grid place-items-center shrink-0 ${active ? "text-emerald-700" : subject.enabled ? "text-gray-400" : "text-gray-300"}`}>
                  <SubjectIcon name={subject.icon} size={15} />
                </span>
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{subject.name}</span>
                {!subject.enabled && (
                  <span className="text-[9.5px] text-gray-400 font-mono uppercase tracking-[0.04em] border border-gray-200 rounded px-1 py-px">
                    Soon
                  </span>
                )}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-3 border-t border-gray-200 flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white grid place-items-center font-semibold text-xs shrink-0">
          {userInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-900 font-medium text-[13px] truncate">{userName}</div>
          <div className="text-[11.5px] text-gray-400 truncate">{userEmail || "Signed in"}</div>
        </div>
        <button
          aria-label="Settings"
          className="w-[30px] h-[30px] rounded-lg text-gray-400 grid place-items-center hover:bg-black/[0.05] hover:text-gray-700 transition-all"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </div>
  );
}

function TopicColumn({
  title,
  level,
  topics,
  activeTopicId,
  topicConversations,
  loadingConversations,
  onSetLevel,
  onSelectTopic,
  onBack,
  visibleOnMobile,
}: {
  title: string;
  level: string;
  topics: SubjectTopic[];
  activeTopicId: string;
  topicConversations: Map<string, ConversationSummary>;
  loadingConversations: boolean;
  onSetLevel: (l: string) => void;
  onSelectTopic: (topicId: string, conversation?: ConversationSummary) => void;
  onBack: () => void;
  visibleOnMobile: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col h-screen w-[230px] border-l border-gray-200 bg-white shrink-0",
        "max-[860px]:w-full max-[860px]:border-l-0",
        visibleOnMobile ? "" : "max-[860px]:hidden",
      ].join(" ")}
    >
      <div className="px-3.5 pt-[18px] pb-3">
        <div className="min-[861px]:hidden flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900"
          >
            <span aria-hidden>{"<"}</span> Subjects
          </button>
        </div>
        <LevelControl level={level} onSetLevel={onSetLevel} />
      </div>

      <div className="px-3.5 flex-1 overflow-auto">
        <div className="flex items-center justify-between pr-1">
          <SectionLabel>{title}</SectionLabel>
          {loadingConversations && <span className="text-[10.5px] text-gray-400 pb-2">Loading</span>}
        </div>
        <div className="flex flex-col gap-[3px] pb-4">
          {topics.map((topic) => {
            const conversation = topicConversations.get(topic.id);
            const active = activeTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.id, conversation)}
                className={[
                  "group flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left border transition-all",
                  active
                    ? "bg-gray-50 border-gray-200 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)]"
                    : "border-transparent hover:bg-black/[0.04]",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-[22px] h-[22px] mt-0.5 rounded-md grid place-items-center shrink-0",
                    active ? "bg-emerald-50 text-emerald-700" : "text-gray-400 group-hover:text-gray-600",
                  ].join(" ")}
                >
                  <MessageCircleIcon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-5 text-gray-800 font-medium truncate">{topic.name}</span>
                  <span className="block text-[11px] leading-4 text-gray-400 truncate">
                    {conversation?.title ?? topic.description ?? "Topic chat"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LevelControl({ level, onSetLevel }: { level: string; onSetLevel: (l: string) => void }) {
  return (
    <>
      <SectionLabel>Level</SectionLabel>
      <div className="grid grid-cols-2 gap-[3px] p-[3px] bg-white border border-gray-200 rounded-[9px]">
        {[["HL", "Higher"], ["OL", "Ordinary"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => onSetLevel(key)}
            className={[
              "py-[7px] px-2.5 text-[13px] rounded-md transition-all",
              level === key
                ? "bg-emerald-500 text-white font-medium shadow-[inset_0_-1px_0_rgba(0,0,0,0.12),0_1px_1.5px_rgba(16,185,129,0.25)]"
                : "text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] text-gray-400 uppercase tracking-[0.08em] font-mono px-1.5 pb-2">
      {children}
    </div>
  );
}
