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
import { ProgressView } from "@/components/app/progress-view";
import { SubjectWorkspace } from "@/components/app/subject-workspace";
import { ExamTrackerView } from "@/components/app/exam-tracker-view";
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
    ensureSubject();
    setTopicId("general");
    setPrevScreen((current) => (screen === "conversation" ? current : screen === "home" ? "workspace" : screen));
    setScreen("conversation");
    setStuck(false);
  }, [ensureSubject, screen]);

  const goToSubjectTool = useCallback(
    (next: Screen) => {
      ensureSubject();
      setPrevScreen((current) => (screen === "conversation" ? current : screen));
      setScreen(next);
    },
    [ensureSubject, screen],
  );

  const openConvo = useCallback((nextTopicId = "general") => {
    ensureSubject();
    setTopicId(nextTopicId);
    setPrevScreen((current) => (screen === "conversation" ? current : screen === "home" ? "workspace" : screen));
    setScreen("conversation");
    setStuck(false);
  }, [ensureSubject, screen]);

  const exitConvo = useCallback(() => {
    setScreen(prevScreen);
  }, [prevScreen]);

  const selectSubject = useCallback((id: string) => {
    setSubjectId(id);
    setTopicId("general");
    setScreen("workspace");
  }, []);

  const openSettings = useCallback(() => {
    router.push("/onboarding?edit=1");
  }, [router]);

  return (
    <div className="h-screen min-h-screen bg-white">
      <main
        className="app-study-shell relative flex h-full min-h-0 flex-col bg-white"
      >
        <AppTopBar
          screen={screen}
          subjectId={subjectId}
          activeSubjectId={activeSubjectId}
          userInitials={initialsFrom(userName, userEmail)}
          onBack={screen === "workspace" ? goHome : screen === "conversation" ? exitConvo : goToWorkspace}
          onHome={goHome}
          onOpenSettings={openSettings}
        />

        <div
          className={[
            "relative min-h-0 flex-1",
            screen === "conversation" ? "overflow-hidden" : "overflow-y-auto",
          ].join(" ")}
        >
          {screen === "home" && (
            <HomeFeed
              hasProfile={Boolean(profile)}
              subjects={subjects}
              subjectLevels={profile?.subjectLevels}
              onSelectSubject={selectSubject}
              onOpenSettings={openSettings}
            />
          )}
          {screen === "workspace" && (
            <SubjectWorkspace
              subjectId={activeSubjectId}
              level={activeLevel}
              onOpenTutor={goToTutor}
              onOpenGenerator={() => goToSubjectTool("generator")}
              onOpenTracker={() => goToSubjectTool("tracker")}
              onOpenProgress={() => goToSubjectTool("progress")}
            />
          )}
          {screen === "conversation" && (
            <ConversationView
              subjectId={activeSubjectId}
              level={activeLevel}
              topicId={topicId}
              stuck={stuck}
              onRevealStuck={() => setStuck(true)}
              onOpenTopic={openConvo}
            />
          )}
          {screen === "generator" && (
            <PapersView
              key={activeSubjectId}
              subjectId={activeSubjectId}
              level={activeLevel}
              onOpenConvo={() => openConvo(topicId)}
            />
          )}
          {screen === "tracker" && (
            <ExamTrackerView subjectId={activeSubjectId} level={activeLevel} onOpenTutor={goToTutor} />
          )}
          {screen === "progress" && (
            <ProgressView subjectId={activeSubjectId} level={activeLevel} onOpenConvo={() => openConvo(topicId)} />
          )}
        </div>
      </main>
    </div>
  );
}
