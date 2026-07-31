"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MathMarkdown } from "@/components/math-markdown";
import type { TutorQuestionHandoff } from "./conversation-view";

type TutorMessage = { id: string; role: "user" | "ai"; text: string };

export function QuestionTutorPanel({ subjectId, level, handoff, onClose }: { subjectId: string; level: string; handoff: TutorQuestionHandoff; onClose: () => void }) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const conversationId = useRef<string | null>(null);
  const questionContext = useRef(handoff.contextPrompt);
  const handledHandoff = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView({ block: "end" }), []);
  useEffect(() => { window.requestAnimationFrame(scrollToBottom); }, [isResponding, messages.length, scrollToBottom]);

  const sendMessage = useCallback(async (value: string, context = "") => {
    const text = value.trim();
    if (!text || isResponding) return;
    if (context.trim()) questionContext.current = context.trim();
    const userMessage: TutorMessage = { id: `question-user-${Date.now()}`, role: "user", text };
    const assistantMessageId = `question-ai-${Date.now()}`;
    const history = messages.map(({ role, text: messageText }) => ({ role, text: messageText }));
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsResponding(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId.current,
          subjectId,
          level,
          topicId: handoff.topicId,
          text,
          history,
          studentContext: questionContext.current.slice(0, 12000),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error ?? "Your Tutor could not respond just now.");
      }

      conversationId.current = response.headers.get("X-Conversation-Id");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Your Tutor could not respond just now.");
      const decoder = new TextDecoder();
      let reply = "";
      setMessages((current) => [...current, { id: assistantMessageId, role: "ai", text: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const currentReply = reply;
        setMessages((current) => current.map((message) => message.id === assistantMessageId ? { ...message, text: currentReply } : message));
      }
      if (!reply.trim()) throw new Error("Your Tutor could not respond just now.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Your Tutor could not respond just now.";
      setMessages((current) => [...current.filter((item) => item.id !== assistantMessageId), { id: assistantMessageId, role: "ai", text: message }]);
    } finally {
      setIsResponding(false);
    }
  }, [handoff.topicId, isResponding, level, messages, subjectId]);

  useEffect(() => {
    if (handledHandoff.current) return;
    handledHandoff.current = true;
    void sendMessage(handoff.initialMessage, handoff.contextPrompt);
  }, [handoff.contextPrompt, handoff.initialMessage, sendMessage]);

  return <section className="animate-fade-up mt-4 overflow-hidden rounded-xl border border-cyan-200 bg-white shadow-[0_18px_42px_-34px_rgba(8,145,178,.72)] dark:border-cyan-900 dark:bg-slate-900"><header className="flex items-start justify-between gap-3 border-b border-cyan-100 bg-cyan-50/70 px-4 py-3 dark:border-cyan-950 dark:bg-cyan-400/[.08]"><div><div className="text-[11px] font-semibold uppercase tracking-[.08em] text-cyan-700 dark:text-cyan-300">Tutor for this question</div><div className="mt-0.5 text-[13px] font-medium text-gray-800 dark:text-slate-100">{handoff.topicName}</div></div><button type="button" onClick={onClose} className="rounded-lg border border-cyan-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-cyan-700 hover:border-cyan-500 dark:border-cyan-800 dark:bg-slate-900 dark:text-cyan-200">Close</button></header><div className="max-h-[290px] overflow-y-auto px-4 py-4"><div className="space-y-3"><div className="rounded-lg border border-lime-100 bg-lime-50/60 px-3 py-2 text-[12.5px] leading-relaxed text-gray-600 dark:border-lime-900 dark:bg-lime-400/[.08] dark:text-slate-300">{handoff.summary}</div>{messages.map((message) => message.role === "ai" ? <AssistantMessage key={message.id}>{message.text || "Thinking..."}</AssistantMessage> : <StudentMessage key={message.id}>{message.text}</StudentMessage>)}</div><div ref={bottomRef} /></div><form onSubmit={(event) => { event.preventDefault(); void sendMessage(draft); }} className="flex items-center gap-2 border-t border-cyan-100 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a follow-up about this question..." className="min-w-0 flex-1 border-none bg-transparent px-1 py-2 text-[13.5px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-400" /><button type="submit" disabled={!draft.trim() || isResponding} className="shrink-0 rounded-lg bg-cyan-500 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-cyan-600 disabled:bg-gray-300 dark:disabled:bg-slate-700">Send</button></form></section>;
}

function AssistantMessage({ children }: { children: string }) {
  const text = children.replace(/([.!?])\s+(#{1,6}\s)/g, "$1\n\n$2");
  return <div className="flex gap-2"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-semibold text-white">AI</span><div className="min-w-0 rounded-b-xl rounded-tl-sm rounded-tr-xl bg-gray-100 px-3 py-2.5 text-[13.5px] leading-relaxed text-gray-900 dark:bg-slate-800 dark:text-slate-100"><MathMarkdown className="[&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:text-[16px] [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-[14.5px] [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-[13.5px] [&_h3]:font-semibold">{text}</MathMarkdown></div></div>;
}

function StudentMessage({ children }: { children: string }) {
  return <div className="flex justify-end"><div className="max-w-[88%] whitespace-pre-wrap rounded-b-xl rounded-tl-xl rounded-tr-sm bg-cyan-500 px-3 py-2.5 text-[13.5px] leading-relaxed text-white">{children}</div></div>;
}
