"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { AppSidebar } from "@/components/app/sidebar";
import { AppTopBar } from "@/components/app/topbar";
import { CalendarRail } from "@/components/app/calendar-rail";
import { HomeFeed } from "@/components/app/home-feed";
import { ConversationView } from "@/components/app/conversation-view";
import { PapersView } from "@/components/app/papers-view";
import { ProgressView } from "@/components/app/progress-view";
import type { Screen } from "@/components/app/types";

function initialsFrom(name: string, email: string) {
  const source = name || email.split("@")[0] || "Student";
  return (
    source
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S"
  );
}

export function ChatClient() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("home");
  const [prevScreen, setPrevScreen] = useState<Screen>("home");
  const [subjectId, setSubjectId] = useState("all");
  const [collapsed, setCollapsed] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    void (async () => {
      const { data } = await sb.auth.getUser();
      const user = data.user;
      if (!user) return;
      const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
      setUserName(fullName || user.email?.split("@")[0] || "Student");
      setUserEmail(user.email ?? "");
    })();
  }, []);

  const goToScreen = useCallback(
    (next: Screen) => {
      setPrevScreen((current) => (screen === "conversation" ? current : screen));
      setScreen(next);
    },
    [screen],
  );

  const openConvo = useCallback(() => {
    setPrevScreen((current) => (screen === "conversation" ? current : screen));
    setScreen("conversation");
    setStuck(false);
  }, [screen]);

  const exitConvo = useCallback(() => {
    setScreen(prevScreen);
  }, [prevScreen]);

  const selectSubject = useCallback((id: string) => {
    setSubjectId(id);
    setScreen((current) => (current === "conversation" ? "home" : current));
  }, []);

  const openSettings = useCallback(() => {
    router.push("/onboarding?edit=1");
  }, [router]);

  const showRail = screen === "home" || screen === "conversation";

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar
        screen={screen}
        subjectId={subjectId}
        collapsed={collapsed}
        userName={userName}
        userEmail={userEmail}
        userInitials={initialsFrom(userName, userEmail)}
        onSelectAll={() => selectSubject("all")}
        onSelectSubject={selectSubject}
        onGoHome={() => goToScreen("home")}
        onGoPapers={() => goToScreen("papers")}
        onGoProgress={() => goToScreen("progress")}
        onOpenSettings={openSettings}
      />

      <main
        className="flex-1 min-w-0 h-full flex flex-col relative bg-white"
        style={{
          backgroundImage:
            "radial-gradient(120% 52% at 50% -8%, rgba(16,185,129,0.07), rgba(16,185,129,0) 62%), radial-gradient(circle at center, rgba(17,24,39,0.045) 1px, transparent 1.5px)",
          backgroundSize: "100% 100%, 23px 23px",
        }}
      >
        <AppTopBar screen={screen} onToggleSidebar={() => setCollapsed((c) => !c)} onExitConvo={exitConvo} />

        <div className="flex-1 overflow-y-auto relative">
          {screen === "home" && (
            <HomeFeed subjectId={subjectId} onOpenConvo={openConvo} onGoProgress={() => goToScreen("progress")} />
          )}
          {screen === "conversation" && <ConversationView stuck={stuck} onRevealStuck={() => setStuck(true)} />}
          {screen === "papers" && <PapersView subjectId={subjectId} onOpenConvo={openConvo} />}
          {screen === "progress" && <ProgressView onOpenConvo={openConvo} />}
        </div>
      </main>

      {showRail && (
        <CalendarRail dimmed={screen === "conversation"} onDismiss={exitConvo} onOpenConvo={openConvo} />
      )}
    </div>
  );
}
