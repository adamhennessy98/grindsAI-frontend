"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS, getSubjectTopics, getTopic } from "@/lib/constants";
import { filterSubjects, getSubjectLevel, readStudentProfile, type StudentProfile } from "@/lib/onboarding";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { AppTopBar } from "@/components/app/topbar";
import { HomeFeed } from "@/components/app/home-feed";
import { ConversationView, type TutorQuestionHandoff } from "@/components/app/conversation-view";
import { PapersView } from "@/components/app/papers-view";
import { ProgressResultsView } from "@/components/app/progress-view";
import { SubjectWorkspace } from "@/components/app/subject-workspace";
import { emptySubjectStudyState, type FocusArea, type ResultEntry, type StudyActivity, type StudyStateBySubject } from "@/components/app/study-state";
import type { Screen } from "@/components/app/types";

function initialsFrom(name: string, email: string) {
  const source = name || email.split("@")[0] || "Student";
  return source.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "S";
}

export function ChatClient() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("home");
  const [previousScreen, setPreviousScreen] = useState<Screen>("workspace");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("general");
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studyState, setStudyState] = useState<StudyStateBySubject>({});
  const [tutorHandoff, setTutorHandoff] = useState<TutorQuestionHandoff | null>(null);
  const [generatorTopicId, setGeneratorTopicId] = useState<string | undefined>();

  useEffect(() => { const timer = window.setTimeout(() => setProfile(readStudentProfile()), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const fullName = typeof data.user.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name.trim() : "";
      setUserName(fullName || data.user.email?.split("@")[0] || "Student");
      setUserEmail(data.user.email ?? "");
    })();
  }, []);

  const subjects = useMemo(() => (profile ? filterSubjects(profile.subjects) : []), [profile]);
  const fallbackSubjectId = subjects[0]?.id ?? SUBJECTS[0]?.id ?? "maths";
  const activeSubjectId = subjectId || fallbackSubjectId;
  const activeLevel = getSubjectLevel(profile, activeSubjectId);
  const activeStudyState = studyState[activeSubjectId] ?? emptySubjectStudyState();

  const updateSubjectState = useCallback((id: string, update: (current: ReturnType<typeof emptySubjectStudyState>) => ReturnType<typeof emptySubjectStudyState>) => {
    setStudyState((current) => ({ ...current, [id]: update(current[id] ?? emptySubjectStudyState()) }));
  }, []);
  const recordActivity = useCallback((id: string, activity: Omit<StudyActivity, "id">) => {
    updateSubjectState(id, (current) => ({ ...current, activities: [{ ...activity, id: `${activity.type}-${Date.now()}` }, ...current.activities].slice(0, 8) }));
  }, [updateSubjectState]);

  const ensureSubject = useCallback(() => { if (subjectId) return subjectId; setSubjectId(fallbackSubjectId); return fallbackSubjectId; }, [fallbackSubjectId, subjectId]);
  const goHome = useCallback(() => { setSubjectId(""); setTutorHandoff(null); setGeneratorTopicId(undefined); setScreen("home"); }, []);
  const goToWorkspace = useCallback(() => { ensureSubject(); setTutorHandoff(null); setScreen("workspace"); }, [ensureSubject]);

  const openTopic = useCallback((nextTopicId = "general", handoff?: TutorQuestionHandoff | null) => {
    const id = ensureSubject();
    window.localStorage.setItem(`grindsai-last-tutor-topic:${id}`, nextTopicId);
    updateSubjectState(id, (current) => ({ ...current, lastTopicId: nextTopicId }));
    setTopicId(nextTopicId);
    setTutorHandoff(handoff ?? null);
    setPreviousScreen(screen === "home" ? "workspace" : screen === "conversation" ? previousScreen : screen);
    setScreen("conversation");
  }, [ensureSubject, previousScreen, screen, updateSubjectState]);

  const goToTutor = useCallback(() => {
    const id = ensureSubject();
    const lastTopic = studyState[id]?.lastTopicId ?? window.localStorage.getItem(`grindsai-last-tutor-topic:${id}`) ?? "general";
    openTopic(lastTopic);
  }, [ensureSubject, openTopic, studyState]);
  const goToTool = useCallback((next: Exclude<Screen, "home" | "workspace" | "conversation">) => { ensureSubject(); setTutorHandoff(null); setPreviousScreen(screen === "conversation" ? previousScreen : screen); setScreen(next); }, [ensureSubject, previousScreen, screen]);
  const selectSubject = useCallback((id: string) => { setSubjectId(id); setTopicId(studyState[id]?.lastTopicId ?? "general"); setTutorHandoff(null); setGeneratorTopicId(undefined); setScreen("workspace"); }, [studyState]);
  const continueSubject = useCallback((id: string) => {
    const lastTopic = studyState[id]?.lastTopicId ?? "general";
    window.localStorage.setItem(`grindsai-last-tutor-topic:${id}`, lastTopic);
    updateSubjectState(id, (current) => ({ ...current, lastTopicId: lastTopic }));
    setSubjectId(id);
    setTopicId(lastTopic);
    setTutorHandoff(null);
    setPreviousScreen("workspace");
    setScreen("conversation");
  }, [studyState, updateSubjectState]);

  const addFocusArea = useCallback((label: string) => {
    const value = label.trim();
    if (!value) return;
    updateSubjectState(activeSubjectId, (current) => current.focusAreas.some((area) => area.label.toLowerCase() === value.toLowerCase()) ? current : ({ ...current, focusAreas: [...current.focusAreas, { id: `focus-${Date.now()}`, label: value, status: "current" }] }));
    recordActivity(activeSubjectId, { type: "focus", label: `Added focus area: ${value}` });
  }, [activeSubjectId, recordActivity, updateSubjectState]);
  const updateFocusArea = useCallback((area: FocusArea, status: FocusArea["status"]) => {
    updateSubjectState(activeSubjectId, (current) => ({ ...current, focusAreas: current.focusAreas.map((item) => item.id === area.id ? { ...item, status } : item) }));
    recordActivity(activeSubjectId, { type: status === "improved" ? "improved" : "focus", label: status === "improved" ? `Marked comfortable: ${area.label}` : `Restored focus area: ${area.label}` });
  }, [activeSubjectId, recordActivity, updateSubjectState]);
  const addResult = useCallback((result: ResultEntry) => { updateSubjectState(activeSubjectId, (current) => ({ ...current, results: [result, ...current.results] })); recordActivity(activeSubjectId, { type: "result", label: `${result.type}: ${result.topic}` }); }, [activeSubjectId, recordActivity, updateSubjectState]);
  const topicForFocus = useCallback((focus: string) => getSubjectTopics(activeSubjectId).find((topic) => topic.name.toLowerCase() === focus.trim().toLowerCase())?.id ?? "general", [activeSubjectId]);
  const openFocusTutor = useCallback((focus = "") => { openTopic(topicForFocus(focus)); }, [openTopic, topicForFocus]);
  const openFocusGenerator = useCallback((focus = "") => { setGeneratorTopicId(topicForFocus(focus)); goToTool("generator"); }, [goToTool, topicForFocus]);

  return <div className="h-screen min-h-screen bg-[#eaf1ed] dark:bg-slate-950"><main className="app-study-shell flex h-full min-h-0 flex-col"><AppTopBar screen={screen} subjectId={subjectId} activeSubjectId={activeSubjectId} userInitials={initialsFrom(userName, userEmail)} onBack={screen === "workspace" ? goHome : screen === "conversation" ? () => setScreen(previousScreen) : goToWorkspace} onHome={goHome} onOpenSettings={() => router.push("/onboarding?edit=1")} /><div className={screen === "conversation" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"}>
    {screen === "home" && <HomeFeed hasProfile={Boolean(profile)} subjects={subjects} subjectLevels={profile?.subjectLevels} studyState={studyState} onSelectSubject={selectSubject} onContinueSubject={continueSubject} onOpenSettings={() => router.push("/onboarding?edit=1")} />}
    {screen === "workspace" && <SubjectWorkspace subjectId={activeSubjectId} level={activeLevel} studyState={activeStudyState} onOpenTutor={goToTutor} onOpenGenerator={() => goToTool("generator")} onOpenProgress={() => goToTool("progress")} />}
    {screen === "conversation" && <ConversationView subjectId={activeSubjectId} level={activeLevel} topicId={topicId} handoff={tutorHandoff} onOpenGenerator={() => openFocusGenerator(getTopic(activeSubjectId, topicId).name)} onStartSession={(activeTopicId) => recordActivity(activeSubjectId, { type: "tutor", topicId: activeTopicId, label: `Tutor session: ${getTopic(activeSubjectId, activeTopicId).name}` })} onOpenTopic={openTopic} />}
    {screen === "generator" && <PapersView key={activeSubjectId} subjectId={activeSubjectId} level={activeLevel} initialTopicId={generatorTopicId} focusAreas={activeStudyState.focusAreas.filter((area) => area.status === "current")} onQuestionGenerated={(topic) => recordActivity(activeSubjectId, { type: "question", topicId: topic.id, label: `Generated an Exam Question: ${topic.name}` })} onReflect={(outcome, topic) => { recordActivity(activeSubjectId, { type: "reflection", topicId: topic.id, label: `Question reflection: ${outcome}` }); if (outcome === "Still stuck") addFocusArea(topic.name); }} />}
    {screen === "progress" && <ProgressResultsView subjectId={activeSubjectId} level={activeLevel} focusAreas={activeStudyState.focusAreas} results={activeStudyState.results} activities={activeStudyState.activities} onAddFocusArea={addFocusArea} onUpdateFocusArea={updateFocusArea} onAddResult={addResult} onOpenConvo={openFocusTutor} onOpenGenerator={openFocusGenerator} />}
  </div></main></div>;
}
