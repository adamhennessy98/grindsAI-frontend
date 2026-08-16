"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTopic } from "@/lib/constants";
import { MathMarkdown } from "@/components/math-markdown";
import { subjectInitial, subjectLabel, subjectThemeStyle } from "./subjects";
import { MobileTutorTopicDrawer, TutorTopicSidebar } from "./tutor-topic-sidebar";

export type TutorQuestionHandoff = {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  level: string;
  sourceLabel: "Generated exam question" | "Past exam question" | "Topic Check question";
  summary: string;
  initialMessage: string;
  contextPrompt: string;
};

type TutorMessage = { id: string; role: "user" | "ai"; text: string };

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
  const [messagesByTopic, setMessagesByTopic] = useState<Record<string, TutorMessage[]>>({});
  const [respondingTopicId, setRespondingTopicId] = useState<string | null>(null);
  const conversationIds = useRef<Record<string, string>>({});
  const questionContexts = useRef<Record<string, string>>({});
  const handledHandoffs = useRef(new Set<string>());
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messages = messagesByTopic[topic.id] ?? [];
  const isNewTopic = messages.length === 0 && !handoff;
  const isResponding = respondingTopicId === topic.id;
  const contextualActions =
    messages.length === 0 && !handoff
      ? []
      : messages.length < 2
        ? ["Give me a hint", "Help me start", "Explain what the question is asking"]
        : ["I'm still stuck", "Show another step", "Show a worked example"];
  const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView({ block: "end" }), []);

  useEffect(() => {
    window.requestAnimationFrame(scrollToBottom);
  }, [scrollToBottom, messages.length, topic.id, isResponding]);

  const sendMessage = useCallback(async (value: string, studentContext = "") => {
    const message = value.trim();
    if (!message || respondingTopicId) return;
    if (studentContext.trim()) questionContexts.current[topic.id] = studentContext.trim();
    const activeMessages = messagesByTopic[topic.id] ?? [];
    const wasEmpty = activeMessages.length === 0;
    const userMessage: TutorMessage = { id: `user-${Date.now()}`, role: "user", text: message };
    const assistantMessageId = `ai-${Date.now()}`;

    setMessagesByTopic((current) => ({ ...current, [topic.id]: [...(current[topic.id] ?? []), userMessage] }));
    setDraft("");
    setRespondingTopicId(topic.id);
    if (wasEmpty) onStartSession(topic.id);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIds.current[topic.id] ?? null,
          subjectId,
          level,
          topicId: topic.id,
          text: message,
          history: activeMessages.map(({ role, text }) => ({ role, text })),
          agentId: "subject-tutor",
          mode: stuckPhrases.has(message) ? "stuck" : "normal",
          studentContext: (studentContext || questionContexts.current[topic.id] || "").slice(0, 12000),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error ?? "Your Tutor could not respond just now.");
      }

      const conversationId = response.headers.get("X-Conversation-Id");
      if (conversationId) conversationIds.current[topic.id] = conversationId;
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Your Tutor could not respond just now.");
      const decoder = new TextDecoder();
      let reply = "";
      setMessagesByTopic((current) => ({ ...current, [topic.id]: [...(current[topic.id] ?? []), { id: assistantMessageId, role: "ai", text: "" }] }));
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        reply += decoder.decode(chunk, { stream: true });
        const currentReply = reply;
        setMessagesByTopic((current) => ({ ...current, [topic.id]: (current[topic.id] ?? []).map((item) => item.id === assistantMessageId ? { ...item, text: currentReply } : item) }));
      }
      if (!reply.trim()) throw new Error("Your Tutor could not respond just now.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Your Tutor could not respond just now.";
      setMessagesByTopic((current) => ({
        ...current,
        [topic.id]: [...(current[topic.id] ?? []).filter((item) => item.id !== assistantMessageId), { id: assistantMessageId, role: "ai", text }],
      }));
    } finally {
      setRespondingTopicId((current) => current === topic.id ? null : current);
    }
  }, [level, messagesByTopic, onStartSession, respondingTopicId, subjectId, topic.id]);

  useEffect(() => {
    if (!handoff || handledHandoffs.current.has(handoff.id)) return;
    handledHandoffs.current.add(handoff.id);
    void sendMessage(handoff.initialMessage, handoff.contextPrompt);
  }, [handoff, sendMessage]);

  return (
    <div style={subjectThemeStyle(subjectId)} className="mx-auto grid h-[calc(100dvh-65px)] max-w-[1180px] grid-cols-1 overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)]">
      <TutorTopicSidebar subjectId={subjectId} activeTopicId={topic.id} onSelectTopic={onOpenTopic} />
      <MobileTutorTopicDrawer subjectId={subjectId} activeTopicId={topic.id} open={topicsOpen} onClose={() => setTopicsOpen(false)} onSelectTopic={onOpenTopic} />
      <div className="flex min-h-0 min-w-0 flex-col px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-1 pb-3 pt-4 dark:border-slate-800">
          <button type="button" onClick={() => setTopicsOpen(true)} aria-label="Open tutor topics" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-gray-600 transition-colors hover:border-cyan-500 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden">Topics</button>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-sm font-semibold text-white">AI</span>
          <div className="min-w-0 flex-1"><div className="font-heading text-[17px] font-semibold text-gray-900 dark:text-white">{subject} Tutor</div><div className="flex min-w-0 items-center gap-1.5" aria-live="polite"><span className="subject-context-marker flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[9px] font-semibold">{subjectInitial(subjectId)}</span><div className="subject-context-label truncate text-[12.5px]">{level === "OL" ? "Ordinary Level" : "Higher Level"} / {topic.name}</div></div></div>
          <span className="hidden border-l-2 border-cyan-500 pl-2 text-xs font-medium text-cyan-700 dark:text-cyan-300 sm:inline">Guided help</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 pb-4 pt-4"><div key={topic.id} className="animate-fade-up flex flex-col gap-4">{isNewTopic ? <TutorEmptyState topicName={topic.name} onChoose={sendMessage} /> : <>{handoff && <QuestionHandoff handoff={handoff} />}{!handoff && messages.length === 0 && <TutorBubble>You are in {topic.name}. Tell me what you are working on or where you are stuck.</TutorBubble>}{messages.map((message) => message.role === "ai" ? <TutorBubble key={message.id}>{message.text || "Thinking..."}</TutorBubble> : <StudentBubble key={message.id}>{message.text}</StudentBubble>)}</>}</div><div ref={bottomRef} /></div>

        <div className="shrink-0 border-t border-gray-200 bg-[#f4f7f4]/95 px-1 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm dark:border-slate-800 dark:bg-[#07101e]/95">{(contextualActions.length > 0 || messages.length > 0 || handoff) && <div className="mb-2.5 flex flex-wrap gap-2">{contextualActions.map((action) => <QuickAction key={action} onClick={() => void sendMessage(action)}>{action}</QuickAction>)}{(messages.length > 0 || handoff) && <QuickAction onClick={onOpenGenerator}>Practise this topic</QuickAction>}</div>}<form onSubmit={(event) => { event.preventDefault(); void sendMessage(draft); }} className="flex items-center gap-2.5 rounded-lg border border-gray-300 bg-white py-1.5 pl-4 pr-1.5 shadow-[0_8px_18px_-18px_rgba(15,23,42,.5)] dark:border-slate-700 dark:bg-slate-900"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Paste a question or tell your Tutor where you are stuck..." className="flex-1 border-none bg-transparent py-2.5 text-[14.5px] text-gray-700 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-400" /><button type="submit" disabled={!draft.trim() || isResponding} aria-label="Send message" className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md bg-cyan-600 text-[12px] font-semibold text-white transition-colors hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 disabled:bg-gray-300 dark:disabled:bg-slate-700">Send</button></form></div>
      </div>
    </div>
  );
}

function TutorEmptyState({ topicName, onChoose }: { topicName: string; onChoose: (value: string) => void }) {
  return <div className="my-auto flex flex-col items-start py-8 sm:items-center sm:text-center"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 font-heading text-sm font-semibold text-white">AI</span><h2 className="font-heading mb-0 mt-4 text-[22px] font-semibold tracking-[-.02em] text-gray-900 dark:text-white">Paste a question or tell me where you are stuck.</h2><p className="mb-0 mt-2 max-w-[560px] text-[14px] leading-relaxed text-gray-500">A fresh {topicName} session, with your subject, level, and topic already in view.</p><div className="mt-5 flex flex-wrap gap-2 sm:justify-center">{starterActions.map((action) => <button key={action} type="button" onClick={() => onChoose(action)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-700 transition-colors hover:border-cyan-400 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:text-cyan-200">{action}</button>)}</div></div>;
}

function QuestionHandoff({ handoff }: { handoff: TutorQuestionHandoff }) {
  return <article className="border border-lime-200 border-l-4 border-l-lime-500 bg-white/88 px-4 py-3 dark:border-lime-900 dark:border-l-lime-400 dark:bg-slate-900"><div className="text-[11px] font-semibold text-lime-700 dark:text-lime-300">{handoff.sourceLabel}</div><div className="mt-1 text-[14px] font-semibold text-gray-900 dark:text-white">{handoff.title}</div><p className="m-0 mt-2 text-[13px] leading-relaxed text-gray-600 dark:text-slate-300">{handoff.summary}</p></article>;
}

function TutorBubble({ children }: { children: React.ReactNode }) {
  const text = typeof children === "string" ? children.replace(/([.!?])\s+(#{1,6}\s)/g, "$1\n\n$2") : null;
  return <div className="flex max-w-[88%] gap-2.5"><span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-cyan-500 font-heading text-[11px] font-semibold text-white">AI</span><div className="rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gray-100 px-4 py-[13px] text-[14.5px] leading-relaxed text-gray-900 dark:bg-slate-800 dark:text-slate-100">{text !== null ? <MathMarkdown className="[&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:text-[18px] [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-[14.5px] [&_h3]:font-semibold [&_hr]:my-4 [&_hr]:border-gray-200 dark:[&_hr]:border-slate-700">{text}</MathMarkdown> : children}</div></div>;
}
function StudentBubble({ children }: { children: React.ReactNode }) { return <div className="flex justify-end"><div className="max-w-[80%] whitespace-pre-wrap rounded-b-2xl rounded-tl-2xl rounded-tr-sm bg-cyan-500 px-[15px] py-[11px] text-[14.5px] leading-relaxed text-white">{children}</div></div>; }
function QuickAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-700 transition-colors hover:border-cyan-500 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{children}</button>; }
