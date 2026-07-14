"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTopic, STARTERS } from "@/lib/constants";
import { subjectLabel } from "./subjects";
import { MobileTutorTopicDrawer, TutorTopicSidebar } from "./tutor-topic-sidebar";

interface ConversationViewProps {
  subjectId: string;
  level: string;
  topicId: string;
  stuck: boolean;
  onRevealStuck: () => void;
  onOpenTopic: (topicId: string) => void;
}

export function ConversationView({ subjectId, level, topicId, stuck, onRevealStuck, onOpenTopic }: ConversationViewProps) {
  const subject = subjectLabel(subjectId);
  const topic = getTopic(subjectId, topicId);
  const starters = STARTERS[`${subjectId}:${topic.id}`] ?? STARTERS[subjectId] ?? [];
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionMessages, setSessionMessages] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(scrollToBottom);
  }, [scrollToBottom, sessionMessages.length, stuck, topic.id]);

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    setSessionMessages((current) => [...current, message]);
    setDraft("");
    window.requestAnimationFrame(scrollToBottom);
  };

  return (
    <div className="mx-auto grid h-[calc(100dvh-65px)] max-w-[1180px] grid-cols-1 overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)]">
      <TutorTopicSidebar subjectId={subjectId} activeTopicId={topic.id} onSelectTopic={onOpenTopic} />
      <MobileTutorTopicDrawer
        subjectId={subjectId}
        activeTopicId={topic.id}
        open={topicsOpen}
        onClose={() => setTopicsOpen(false)}
        onSelectTopic={onOpenTopic}
      />

      <div className="flex min-h-0 min-w-0 flex-col px-4 sm:px-6">
        <div className="shrink-0 flex items-center gap-3 border-b border-gray-200 px-1 pb-3 pt-4">
          <button
            type="button"
            onClick={() => setTopicsOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-[0_8px_22px_-18px_rgba(15,23,42,.45)] transition-colors hover:bg-gray-50 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open topic sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-sm font-semibold text-white">
            AI
            <span className="absolute bottom-px right-px h-[11px] w-[11px] rounded-full border-2 border-white bg-cyan-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[17px] font-semibold text-gray-900">Subject tutor</div>
            <div className="truncate text-[12.5px] text-gray-400">
              {subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"} / {topic.name}
            </div>
          </div>
          <span className="hidden rounded-full border border-gray-200 bg-gray-100 px-[11px] py-[5px] text-xs text-gray-500 sm:inline-flex">
            Socratic mode
          </span>
        </div>

        <div ref={messagesRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 pb-4 pt-4">
          <TutorBubble>
            You&apos;re in {topic.name}. Ask a question from this topic, paste an exam question, or choose one of the starters
            below. I will keep the help step by step.
          </TutorBubble>

          {starters.length > 0 && (
            <div className="ml-0 flex flex-wrap gap-2 sm:ml-[41px]">
              {starters.slice(0, 3).map((starter) => (
                <span key={starter} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12.5px] text-gray-600">
                  {starter}
                </span>
              ))}
            </div>
          )}

          <PastPaperCard topicName={topic.name} />

          <TutorBubble>
            Before we try to solve anything, tell me what part of {topic.name} feels least clear: the concept, the exam
            wording, or the first step in a question?
          </TutorBubble>

          <StudentBubble>I usually understand it in class, but I am not sure how to start when it appears in an exam question.</StudentBubble>

          <TutorBubble>
            Good. Then we will start with recognition: what clues in the question tell you this is a {topic.name} problem?
            Name one clue, even if you are not fully sure.
          </TutorBubble>

          <StudentBubble>The wording and the formula I think I need.</StudentBubble>

          <QuickQuestion>Can you give me one starting hint?</QuickQuestion>
          <QuickFactBubble />

          <TutorBubble>
            Exactly. Now make that concrete: write the first line you would put on the page. It does not have to be perfect;
            we just need a starting point to improve.
          </TutorBubble>

          {stuck && (
            <>
              <QuickQuestion>I&apos;m still stuck.</QuickQuestion>
              <TutorBubble>
                One nudge: write down the information the question gives you first, then underline what it asks for. Most
                exam questions become easier once those two pieces are separated.
              </TutorBubble>
            </>
          )}

          {sessionMessages.map((message, index) => (
            <StudentBubble key={`${index}-${message}`}>{message}</StudentBubble>
          ))}

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white/95 px-1 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
          <div className="mb-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRevealStuck}
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[8px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              Give me a hint
            </button>
            <button
              type="button"
              onClick={onRevealStuck}
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[8px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              I&apos;m still stuck
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[8px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              Show a worked example
            </button>
          </div>
          <form
            onSubmit={submitMessage}
            className="flex items-center gap-2.5 rounded-[13px] border border-gray-200 bg-white py-1.5 pl-4 pr-1.5 shadow-[0_6px_18px_-14px_rgba(17,24,39,.5)]"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Reply to the tutor, or type your answer..."
              className="flex-1 border-none bg-transparent py-2.5 text-[14.5px] text-gray-700 outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-cyan-500 transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              aria-label="Send message"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <div className="mt-2 text-center text-[11.5px] text-gray-400">
            The tutor guides you to the answer instead of simply giving it away.
          </div>
        </div>
      </div>
    </div>
  );
}

function TutorBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[88%] gap-2.5">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-[11px] font-semibold text-white">
        AI
      </div>
      <div className="rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gray-100 px-4 py-[13px] text-[14.5px] leading-relaxed text-gray-900">
        {children}
      </div>
    </div>
  );
}

function StudentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-b-2xl rounded-tl-2xl rounded-tr-sm bg-cyan-500 px-[15px] py-[11px] text-[14.5px] leading-relaxed text-white">
        {children}
      </div>
    </div>
  );
}

function QuickQuestion({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[74%] rounded-b-2xl rounded-tl-2xl rounded-tr-sm border border-cyan-100 bg-cyan-50 px-3.5 py-2.5 text-[13.5px] leading-snug text-cyan-700">
        {children}
      </div>
    </div>
  );
}

function QuickFactBubble() {
  return (
    <div className="flex max-w-[88%] gap-2.5">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-[11px] font-semibold text-white">
        AI
      </div>
      <div className="max-w-full rounded-b-xl rounded-tl-sm rounded-tr-xl border border-cyan-100 border-l-[3px] border-l-cyan-500 bg-cyan-50 px-[15px] py-3">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.05em] text-cyan-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v18M3 12h18" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Quick fact
        </div>
        <div className="font-heading mb-1.5 text-lg text-gray-900">Start by naming the task</div>
        <p className="m-0 text-[13px] leading-relaxed text-gray-500">
          A strong first move is to identify the topic, list the given information, and write what the question is asking
          for before doing any working.
        </p>
      </div>
    </div>
  );
}

function PastPaperCard({ topicName }: { topicName: string }) {
  return (
    <div className="mb-0.5 ml-0 mt-0.5 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-[0_10px_30px_-24px_rgba(17,24,39,.6)] sm:ml-[41px]">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-100 px-[15px] py-[9px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 3h8l4 4v14H6z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.04em] text-gray-500">Topic context</span>
        <span className="text-xs text-gray-400">Mapped topic context</span>
        <div className="flex-1" />
      </div>
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-[repeating-linear-gradient(180deg,#E5E7EB,#E5E7EB_6px,transparent_6px,transparent_12px)]" />
        <div className="flex-1 px-5 py-[18px]">
          <p className="m-0 mb-3.5 text-[13.5px] text-gray-500">
            This session is keyed to the mapped topic:
          </p>
          <div className="font-heading py-1.5 text-center text-2xl text-gray-900">{topicName}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="#6B7280" strokeWidth="1.6" />
          <path d="M12 8v5l3 2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        The topic ID is preserved for backend context and retrieval.
      </div>
    </div>
  );
}
