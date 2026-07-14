"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS } from "@/lib/constants";
import { filterSubjects, getSubjectLevel, readStudentProfile, type StudentProfile } from "@/lib/onboarding";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { AppTopBar } from "@/components/app/topbar";
import { HomeFeed } from "@/components/app/home-feed";
import { ConversationView } from "@/components/app/conversation-view";
import { PapersView } from "@/components/app/papers-view";
import { ProgressResultsView } from "@/components/app/progress-view";
import { SubjectWorkspace } from "@/components/app/subject-workspace";
import type { Screen } from "@/components/app/types";

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
  const [screen, setScreen] = useState<Screen>("home");
  const [previousScreen, setPreviousScreen] = useState<Screen>("workspace");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("general");
  const [stuck, setStuck] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setProfile(readStudentProfile()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
      setUserName(fullName || user.email?.split("@")[0] || "Student");
      setUserEmail(user.email ?? "");
    })();
  }, []);

  const subjects = useMemo(() => (profile ? filterSubjects(profile.subjects) : []), [profile]);
  const fallbackSubjectId = subjects[0]?.id ?? SUBJECTS[0]?.id ?? "maths";
  const activeSubjectId = subjectId || fallbackSubjectId;
  const activeLevel = getSubjectLevel(profile, activeSubjectId);

  const ensureSubject = useCallback(() => {
    if (subjectId) return subjectId;
    setSubjectId(fallbackSubjectId);
    return fallbackSubjectId;
  }, [fallbackSubjectId, subjectId]);

  const goHome = useCallback(() => {
    setSubjectId("");
    setScreen("home");
  }, []);

  const goToWorkspace = useCallback(() => {
    ensureSubject();
    setScreen("workspace");
  }, [ensureSubject]);

  const goToTutor = useCallback(() => {
    const nextSubjectId = ensureSubject();
    const lastTopicId = window.localStorage.getItem(`grindsai-last-tutor-topic:${nextSubjectId}`) ?? "general";
    setTopicId(lastTopicId);
    setPreviousScreen(screen === "home" ? "workspace" : screen === "conversation" ? previousScreen : screen);
    setScreen("conversation");
    setStuck(false);
  }, [ensureSubject, previousScreen, screen]);

  const goToTool = useCallback(
    (next: Exclude<Screen, "home" | "workspace" | "conversation">) => {
      ensureSubject();
      setPreviousScreen(screen === "conversation" ? previousScreen : screen);
      setScreen(next);
    },
    [ensureSubject, previousScreen, screen],
  );

  const openTopic = useCallback(
    (nextTopicId = "general") => {
      const nextSubjectId = ensureSubject();
      window.localStorage.setItem(`grindsai-last-tutor-topic:${nextSubjectId}`, nextTopicId);
      setTopicId(nextTopicId);
      setPreviousScreen(screen === "home" ? "workspace" : screen === "conversation" ? previousScreen : screen);
      setScreen("conversation");
      setStuck(false);
    },
    [ensureSubject, previousScreen, screen],
  );

  const selectSubject = useCallback((id: string) => {
    setSubjectId(id);
    setTopicId("general");
    setScreen("workspace");
  }, []);

  return (
    <div className="h-screen min-h-screen bg-[#f4f8f6] dark:bg-slate-950">
      <main className="app-study-shell flex h-full min-h-0 flex-col">
        <AppTopBar
          screen={screen}
          subjectId={subjectId}
          activeSubjectId={activeSubjectId}
          userInitials={initialsFrom(userName, userEmail)}
          onBack={screen === "workspace" ? goHome : screen === "conversation" ? () => setScreen(previousScreen) : goToWorkspace}
          onHome={goHome}
          onOpenSettings={() => router.push("/onboarding?edit=1")}
        />

        <div className={screen === "conversation" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"}>
          {screen === "home" && (
            <HomeFeed
              hasProfile={Boolean(profile)}
              subjects={subjects}
              subjectLevels={profile?.subjectLevels}
              onSelectSubject={selectSubject}
              onOpenSettings={() => router.push("/onboarding?edit=1")}
            />
          )}
          {screen === "workspace" && (
            <SubjectWorkspace
              subjectId={activeSubjectId}
              level={activeLevel}
              onOpenTutor={goToTutor}
              onOpenGenerator={() => goToTool("generator")}
              onOpenProgress={() => goToTool("progress")}
            />
          )}
          {screen === "conversation" && (
            <ConversationView
              subjectId={activeSubjectId}
              level={activeLevel}
              topicId={topicId}
              stuck={stuck}
              onRevealStuck={() => setStuck(true)}
              onOpenTopic={openTopic}
            />
          )}
          {screen === "generator" && (
            <PapersView key={activeSubjectId} subjectId={activeSubjectId} level={activeLevel} onOpenConvo={() => openTopic(topicId)} />
          )}
          {screen === "progress" && (
            <ProgressResultsView
              key={activeSubjectId}
              subjectId={activeSubjectId}
              level={activeLevel}
              onOpenConvo={() => openTopic(topicId)}
              onOpenGenerator={() => goToTool("generator")}
            />
          )}
        </div>
      </main>
    </div>
  );
}
