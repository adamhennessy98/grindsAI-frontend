"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MathMarkdown } from "@/components/math-markdown";
import { getTopic } from "@/lib/constants";
import type { Message } from "@/lib/types";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";
import { MobileTutorTopicDrawer, TutorTopicSidebar } from "./tutor-topic-sidebar";

export type TutorQuestionHandoff = {
  title: string;
  question: string;
  topicId: string;
  topicName: string;
  level: string;
};

interface ConversationViewProps {
  subjectId: string;
  level: string;
  topicId: string;
  handoff: TutorQuestionHandoff | null;
  onStartSession: (topicId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onOpenGenerator: () => void;
}

const starterActions = [
  "Paste an exam question",
  "Help me start a question",
  "Explain this topic",
  "Test me on this topic",
  "What should I revise next?",
];

const stuckPhrases = new Set(["I'm still stuck", "I am still stuck", "I'm stuck", "I am stuck"]);

export function ConversationView({
  subjectId,
  level,
  topicId,
  handoff,
  onStartSession,
  onOpenTopic,
  onOpenGenerator,
}: ConversationViewProps) {
  const subject = subjectLabel(subjectId);
  const topic = getTopic(subjectId, topicId);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesByTopic, setMessagesByTopic] = useState<Record<string, Message[]>>({});
  const [conversationIds, setConversationIds] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messages = messagesByTopic[topic.id] ?? [];
  const isNewTopic = messages.length === 0 && !handoff;
  const contextualActions =
    messages.length === 0 && !handoff
      ? []
      : messages.length < 2
        ? ["Give me a hint", "Help me start", "Explain what the question is asking"]
        : ["I'm still stuck", "Show another step", "Show a worked example"];
  const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView({ block: "end" }), []);

  useEffect(() => {
    window.requestAnimationFrame(scrollToBottom);
  }, [scrollToBottom, handoff, messages.length, topic.id, sending]);

  const sendMessage = async (value: string) => {
    const message = value.trim();
    if (!message || sending) return;

    const wasEmpty = messages.length === 0;
    const history = messages;
    const mode = stuckPhrases.has(message) ? "stuck" : "normal";

    setError(null);
    setSending(true);
    setDraft("");
    setMessagesByTopic((current) => ({
      ...current,
      [topic.id]: [...(current[topic.id] ?? []), { role: "user", text: message }],
    }));
    if (wasEmpty) onStartSession(topic.id);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIds[topic.id] ?? null,
          subjectId,
          level,
          topicId: topic.id,
          text: message,
          history,
          agentId: "subject-tutor",
          mode,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not reach the tutor.");
      }

      const conversationId = response.headers.get("X-Conversation-Id");
      if (conversationId) {
        setConversationIds((current) => ({ ...current, [topic.id]: conversationId }));
      }

      setMessagesByTopic((current) => ({
        ...current,
        [topic.id]: [...(current[topic.id] ?? []), { role: "ai", text: "" }],
      }));

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream.");

      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        reply += decoder.decode(chunk, { stream: true });
        const text = reply;
        setMessagesByTopic((current) => {
          const list = [...(current[topic.id] ?? [])];
          const last = list[list.length - 1];
          if (last?.role === "ai") list[list.length - 1] = { role: "ai", text };
          return { ...current, [topic.id]: list };
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the tutor.");
      const fallback = "Sorry — I couldn't reply just now. Please try again in a moment.";
      setMessagesByTopic((current) => {
        const list = [...(current[topic.id] ?? [])];
        const last = list[list.length - 1];
        if (last?.role === "ai" && !last.text.trim()) {
          list[list.length - 1] = { role: "ai", text: fallback };
        } else if (last?.role !== "ai" || last.text !== fallback) {
          list.push({ role: "ai", text: fallback });
        }
        return { ...current, [topic.id]: list };
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={subjectThemeStyle(subjectId)}
      className="mx-auto grid h-[calc(100dvh-65px)] max-w-[1180px] grid-cols-1 overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)]"
    >
      <TutorTopicSidebar subjectId={subjectId} activeTopicId={topic.id} onSelectTopic={onOpenTopic} />
      <MobileTutorTopicDrawer
        subjectId={subjectId}
        activeTopicId={topic.id}
        open={topicsOpen}
        onClose={() => setTopicsOpen(false)}
        onSelectTopic={onOpenTopic}
      />
      <div className="flex min-h-0 min-w-0 flex-col px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-1 pb-3 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTopicsOpen(true)}
            aria-label="Open tutor topics"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[12px] font-medium text-gray-600 transition-colors hover:border-cyan-500 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
          >
            Topics
          </button>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-sm font-semibold text-white">
            AI
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[17px] font-semibold text-gray-900 dark:text-white">{subject} Tutor</div>
            <div className="flex min-w-0 items-center gap-1.5" aria-live="polite">
              <span className="subject-context-marker flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[9px] font-semibold">
                {subjectInitial(subjectId)}
              </span>
              <div className="subject-context-label truncate text-[12.5px]">
                {level === "OL" ? "Ordinary Level" : "Higher Level"} / {topic.name}
              </div>
            </div>
          </div>
          <span className="hidden rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs text-cyan-700 dark:border-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-200 sm:inline">
            Guided help
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 pb-4 pt-4">
          <div key={topic.id} className="animate-fade-up flex flex-col gap-4">
            {isNewTopic ? (
              <TutorEmptyState topicName={topic.name} onChoose={(value) => void sendMessage(value)} disabled={sending} />
            ) : (
              <>
                {handoff && <QuestionHandoff handoff={handoff} />}
                <TutorBubble>
                  {handoff
                    ? "Let's work through this together. What would you try first?"
                    : `You are in ${topic.name}. Tell me what you are working on or where you are stuck.`}
                </TutorBubble>
                {messages.map((message, index) =>
                  message.role === "user" ? (
                    <StudentBubble key={`${topic.id}-${index}-user`}>{message.text}</StudentBubble>
                  ) : (
                    <TutorBubble key={`${topic.id}-${index}-ai`}>
                      {message.text ? <MathMarkdown>{message.text}</MathMarkdown> : sending ? "…" : null}
                    </TutorBubble>
                  ),
                )}
              </>
            )}
          </div>
          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-[#eaf1ed]/95 px-1 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          {(contextualActions.length > 0 || messages.length > 0 || handoff) && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {contextualActions.map((action) => (
                <QuickAction key={action} disabled={sending} onClick={() => void sendMessage(action)}>
                  {action}
                </QuickAction>
              ))}
              {(messages.length > 0 || handoff) && (
                <QuickAction disabled={sending} onClick={onOpenGenerator}>
                  Practise this topic
                </QuickAction>
              )}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(draft);
            }}
            className="flex items-center gap-2.5 rounded-[13px] border border-gray-200 bg-white py-1.5 pl-4 pr-1.5 shadow-[0_6px_18px_-14px_rgba(17,24,39,.5)] dark:border-slate-700 dark:bg-slate-900"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={sending}
              placeholder="Paste a question or tell your Tutor where you are stuck..."
              className="flex-1 border-none bg-transparent py-2.5 text-[14.5px] text-gray-700 outline-none placeholder:text-gray-400 disabled:opacity-60 dark:text-white dark:placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              aria-label="Send message"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-cyan-500 text-[12px] font-semibold text-white transition-colors hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 disabled:bg-gray-300 dark:disabled:bg-slate-700"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TutorEmptyState({
  topicName,
  onChoose,
  disabled,
}: {
  topicName: string;
  onChoose: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="my-auto flex flex-col items-start py-8 sm:items-center sm:text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 font-heading text-sm font-semibold text-white">
        AI
      </span>
      <h2 className="font-heading mb-0 mt-4 text-[23px] font-semibold text-gray-900 dark:text-white">
        Paste a question or tell me where you are stuck.
      </h2>
      <p className="mb-0 mt-2 max-w-[560px] text-[14px] leading-relaxed text-gray-500">
        This is a fresh {topicName} session. Your Tutor keeps the subject, level, and topic in view.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 sm:justify-center">
        {starterActions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={disabled}
            onClick={() => onChoose(action)}
            className="rounded-full border border-cyan-100 bg-white px-3.5 py-2 text-[12.5px] font-medium text-cyan-700 transition-colors hover:border-cyan-500 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-cyan-200"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionHandoff({ handoff }: { handoff: TutorQuestionHandoff }) {
  return (
    <article className="rounded-xl border border-lime-100 bg-lime-50/70 px-4 py-3 dark:border-lime-900 dark:bg-lime-400/10">
      <div className="text-[11px] font-semibold uppercase tracking-[.07em] text-lime-700 dark:text-lime-300">
        Exam Question
      </div>
      <div className="mt-1 text-[14px] font-semibold text-gray-900 dark:text-white">{handoff.title}</div>
      <p className="m-0 mt-2 text-[13px] leading-relaxed text-gray-600 dark:text-slate-300">{handoff.question}</p>
    </article>
  );
}

function TutorBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[88%] gap-2.5">
      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-[11px] font-semibold text-white">
        AI
      </span>
      <div className="rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gray-100 px-4 py-[13px] text-[14.5px] leading-relaxed text-gray-900 dark:bg-slate-800 dark:text-slate-100">
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

function QuickAction({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-700 transition-colors hover:border-cyan-500 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {children}
    </button>
  );
}
