"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUBJECTS } from "@/lib/constants";
import type { Message } from "@/lib/types";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage, ThinkingBubble } from "@/components/chat/chat-message";
import { EmptyState } from "@/components/chat/empty-state";
import { Composer } from "@/components/chat/composer";
import { getBrowserSupabase } from "@/lib/supabase/client";

type SidebarUser = {
  name: string;
  email: string;
};

function initialsFrom(name: string, email: string) {
  const source = name || email.split("@")[0] || "Student";
  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "S";
}

export function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState("maths");
  const [level, setLevel] = useState("HL");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [checkoutBannerDismissed, setCheckoutBannerDismissed] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<SidebarUser>({
    name: "Student",
    email: "",
  });

  const subject = SUBJECTS.find((s) => s.id === subjectId)!;
  const threadRef = useRef<HTMLDivElement>(null);

  const checkoutSuccess = searchParams.get("checkout") === "success";
  const showCheckoutBanner = checkoutSuccess && !checkoutBannerDismissed;

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    void (async () => {
      const { data: authData } = await sb.auth.getUser();
      const user = authData.user;
      if (!user) return;
      const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
      const name = fullName || user.email?.split("@")[0] || "Student";
      setSidebarUser({ name, email: user.email ?? "" });
      const { data } = await sb.from("profiles").select("subscription_status").eq("id", user.id).maybeSingle();
      if (data?.subscription_status === "active") {
        setSubscriptionActive(true);
      }
    })();
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const newChat = useCallback(() => {
    setMessages([]);
    setThinking(false);
    setSidebarOpen(false);
    setConversationId(null);
    setApiError(null);
  }, []);

  const switchSubject = useCallback((id: string) => {
    if (id === subjectId) return;
    setSubjectId(id);
    setMessages([]);
    setThinking(false);
    setSidebarOpen(false);
    setConversationId(null);
    setApiError(null);
  }, [subjectId]);

  const signOut = useCallback(async () => {
    const sb = getBrowserSupabase();
    await sb?.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  const send = useCallback(
    async (text?: string) => {
      const t = (text ?? draft).trim();
      if (!t) return;
      setApiError(null);
      setDraft("");
      setMessages((m) => [...m, { role: "user", text: t }]);
      setThinking(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            subjectId,
            level,
            text: t,
          }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setMessages((m) => m.slice(0, -1));
          setDraft(t);
          setApiError(data.error ?? "Could not reach the tutor. Try again.");
          return;
        }

        const nextConversationId = res.headers.get("X-Conversation-Id");
        if (nextConversationId) {
          setConversationId(nextConversationId);
        }

        if (!res.body) {
          setMessages((m) => m.slice(0, -1));
          setDraft(t);
          setApiError("The tutor response did not include a readable stream.");
          return;
        }

        setThinking(false);
        setMessages((m) => [...m, { role: "ai", text: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          reply += chunk;
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last?.role === "ai") {
              next[next.length - 1] = { ...last, text: last.text + chunk };
            }
            return next;
          });
        }

        const tail = decoder.decode();
        if (tail) {
          reply += tail;
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last?.role === "ai") {
              next[next.length - 1] = { ...last, text: last.text + tail };
            }
            return next;
          });
        }

        if (!reply.trim()) {
          setMessages((m) => m.slice(0, -1));
          setApiError("The tutor returned an empty response. Try again.");
        }
      } catch {
        setMessages((m) => m.slice(0, -1));
        setDraft(t);
        setApiError("Network error. Check your connection and try again.");
      } finally {
        setThinking(false);
      }
    },
    [draft, conversationId, subjectId, level],
  );

  const useSuggestion = useCallback((q: string) => {
    setDraft(q);
  }, []);

  return (
    <div className="grid h-screen overflow-hidden bg-white" style={{ gridTemplateColumns: "auto 1fr" }}>
      <ChatSidebar
        subjectId={subjectId}
        level={level}
        userName={sidebarUser.name}
        userEmail={sidebarUser.email}
        userInitials={initialsFrom(sidebarUser.name, sidebarUser.email)}
        onSelectSubject={switchSubject}
        onSetLevel={setLevel}
        onNewChat={newChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-[80] min-[861px]:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex flex-col min-w-0 h-screen">
        {showCheckoutBanner && (
          <div className="px-6 py-2.5 text-sm text-emerald-900 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-3 shrink-0">
            <span>Subscription active — thanks for supporting GrindsAI.</span>
            <button
              type="button"
              onClick={() => setCheckoutBannerDismissed(true)}
              className="text-emerald-800 hover:text-emerald-950 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        )}
        {apiError && (
          <div className="px-6 py-2.5 text-sm text-red-800 bg-red-50 border-b border-red-100 shrink-0">{apiError}</div>
        )}
        <ChatHeader
          subject={subject}
          level={level}
          onOpenSidebar={() => setSidebarOpen(true)}
          subscriptionActive={subscriptionActive}
          onSignOut={() => void signOut()}
        />

        <div ref={threadRef} className="flex-1 overflow-auto py-8">
          {messages.length === 0 ? (
            <EmptyState subject={subject} level={level} onPick={useSuggestion} />
          ) : (
            <div className="max-w-[760px] mx-auto px-6 flex flex-col gap-[22px]">
              {messages.map((m, i) => (
                <ChatMessage key={i} msg={m} />
              ))}
              {thinking && <ThinkingBubble />}
            </div>
          )}
        </div>

        <Composer draft={draft} subject={subject} onChange={setDraft} onSend={() => void send()} />
      </main>
    </div>
  );
}
