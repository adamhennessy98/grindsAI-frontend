"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SUBJECTS, SAMPLE_CONVO, socraticReply } from "@/lib/constants";
import type { Message } from "@/lib/types";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage, ThinkingBubble } from "@/components/chat/chat-message";
import { EmptyState } from "@/components/chat/empty-state";
import { Composer } from "@/components/chat/composer";

export default function ChatPage() {
  const [subjectId, setSubjectId] = useState("maths");
  const [level, setLevel] = useState("HL");
  const [messages, setMessages] = useState<Message[]>(SAMPLE_CONVO);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const subject = SUBJECTS.find((s) => s.id === subjectId)!;
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const newChat = useCallback(() => {
    setMessages([]);
    setThinking(false);
    setSidebarOpen(false);
  }, []);

  const switchSubject = useCallback((id: string) => {
    if (id === subjectId) return;
    setSubjectId(id);
    setMessages([]);
    setThinking(false);
    setSidebarOpen(false);
  }, [subjectId]);

  const send = useCallback((text?: string) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: socraticReply(subjectId, t) }]);
      setThinking(false);
    }, 1100 + Math.random() * 400);
  }, [draft, subjectId]);

  const useSuggestion = useCallback((q: string) => {
    setDraft(q);
  }, []);

  return (
    <div className="grid h-screen overflow-hidden bg-white" style={{ gridTemplateColumns: "auto 1fr" }}>
      <ChatSidebar
        subjectId={subjectId}
        level={level}
        onSelectSubject={switchSubject}
        onSetLevel={setLevel}
        onNewChat={newChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-[80] min-[861px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex flex-col min-w-0 h-screen">
        <ChatHeader
          subject={subject}
          level={level}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div ref={threadRef} className="flex-1 overflow-auto py-8">
          {messages.length === 0 ? (
            <EmptyState subject={subject} level={level} onPick={useSuggestion} />
          ) : (
            <div className="max-w-[760px] mx-auto px-6 flex flex-col gap-[22px]">
              {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
              {thinking && <ThinkingBubble />}
            </div>
          )}
        </div>

        <Composer
          draft={draft}
          subject={subject}
          onChange={setDraft}
          onSend={() => send()}
        />
      </main>
    </div>
  );
}
