"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS, getSubjectTopics, getTopic } from "@/lib/constants";
import { filterSubjects, getSubjectLevel, loadStudentProfile, type StudentProfile } from "@/lib/onboarding";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { AppTopBar } from "@/components/app/topbar";
import { HomeFeed } from "@/components/app/home-feed";
import { ConversationView, type TutorQuestionHandoff } from "@/components/app/conversation-view";
import { PapersView } from "@/components/app/papers-view";
import { ProgressResultsView } from "@/components/app/progress-view";
import { SubjectWorkspace } from "@/components/app/subject-workspace";
import { SubjectQuickCheck } from "@/components/app/subject-quick-check";
import { TopicCheckView } from "@/components/app/topic-check-view";
import { TopicCheckHistory } from "@/components/app/topic-check-history";
import { emptySubjectStudyState, loadStudyState, saveStudyState, type FocusArea, type ResultEntry, type StudyActivity, type StudyStateBySubject, type TopicCheckEntry } from "@/components/app/study-state";
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
  const [studyStateOwner, setStudyStateOwner] = useState("");
  const [tutorHandoff, setTutorHandoff] = useState<TutorQuestionHandoff | null>(null);
  const [generatorTopicId, setGeneratorTopicId] = useState<string | undefined>();
  const [quickCheckSubjectId, setQuickCheckSubjectId] = useState<string | null>(null);
  const [tutorSessionResetKey, setTutorSessionResetKey] = useState(0);
  const hasLoadedStudyState = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        const next = await loadStudentProfile();
        setProfile(next);
      })();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const fullName = typeof data.user.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name.trim() : "";
      setUserName(fullName || data.user.email?.split("@")[0] || "Student");
      setUserEmail(data.user.email ?? "");
      const ownerId = data.user.id;
      setStudyState(loadStudyState(ownerId));
      setStudyStateOwner(ownerId);
      hasLoadedStudyState.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!studyStateOwner || !hasLoadedStudyState.current) return;
    // TODO: move this browser-local progress record into the authenticated profile store when its API is available.
    saveStudyState(studyStateOwner, studyState);
  }, [studyState, studyStateOwner]);

  const subjects = useMemo(() => (profile ? filterSubjects(profile.subjects) : []), [profile]);
  const fallbackSubjectId = subjects[0]?.id ?? SUBJECTS[0]?.id ?? "maths";
  const activeSubjectId = subjectId || fallbackSubjectId;
  const activeLevel = getSubjectLevel(profile, activeSubjectId);
  const activeStudyState = studyState[activeSubjectId] ?? emptySubjectStudyState();

  const updateSubjectState = useCallback((id: string, update: (current: ReturnType<typeof emptySubjectStudyState>) => ReturnType<typeof emptySubjectStudyState>) => {
    setStudyState((current) => ({ ...current, [id]: update(current[id] ?? emptySubjectStudyState()) }));
  }, []);
  const recordActivity = useCallback((id: string, activity: Omit<StudyActivity, "id">) => {
    updateSubjectState(id, (current) => ({ ...current, activities: [{ ...activity, id: `${activity.type}-${Date.now()}` }, ...current.activities].slice(0, 12) }));
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

  const goToTutor = useCallback((topicOverride?: string, summary?: string | null) => {
    const id = ensureSubject();
    const lastTopic =
      topicOverride ||
      studyState[id]?.lastTopicId ||
      window.localStorage.getItem(`grindsai-last-tutor-topic:${id}`) ||
      "general";
    setTutorSessionResetKey((key) => key + 1);
    if (summary?.trim()) {
      openTopic(lastTopic, {
        id: `continue-${Date.now()}`,
        title: "Continue from last session",
        topicId: lastTopic,
        topicName: getTopic(id, lastTopic).name,
        level: getSubjectLevel(profile, id) === "OL" ? "Ordinary Level" : "Higher Level",
        sourceLabel: "Session continue",
        summary: summary.trim(),
        initialMessage: "Help me continue from where I left off — keep it short.",
        contextPrompt: [
          "Continue brief (structured wrap-up only — not a full transcript replay):",
          summary.trim(),
        ].join("\n"),
      });
      return;
    }
    openTopic(lastTopic);
  }, [ensureSubject, openTopic, profile, studyState]);
  const goToTool = useCallback((next: Exclude<Screen, "home" | "workspace" | "conversation">) => { ensureSubject(); setTutorHandoff(null); setPreviousScreen(screen === "conversation" ? previousScreen : screen); setScreen(next); }, [ensureSubject, previousScreen, screen]);
  const selectSubject = useCallback((id: string) => {
    setSubjectId(id);
    setTopicId(studyState[id]?.lastTopicId ?? "general");
    setTutorHandoff(null);
    setGeneratorTopicId(undefined);
    setScreen("workspace");
    setQuickCheckSubjectId(id);
  }, [studyState]);
  const continueSubject = useCallback((id: string, topicOverride?: string) => {
    const lastTopic = topicOverride || studyState[id]?.lastTopicId || "general";
    window.localStorage.setItem(`grindsai-last-tutor-topic:${id}`, lastTopic);
    updateSubjectState(id, (current) => ({ ...current, lastTopicId: lastTopic }));
    setSubjectId(id);
    setTopicId(lastTopic);
    setTutorHandoff(null);
    setPreviousScreen("workspace");
    setTutorSessionResetKey((key) => key + 1);
    setScreen("conversation");
    setQuickCheckSubjectId(id);
  }, [studyState, updateSubjectState]);

  const addFocusArea = useCallback((label: string) => {
    const value = label.trim();
    if (!value) return;
    const createdAt = new Date().toISOString();
    updateSubjectState(activeSubjectId, (current) => {
      if (current.focusAreas.some((area) => area.label.toLowerCase() === value.toLowerCase())) return current;
      return {
        ...current,
        focusAreas: [...current.focusAreas, { id: `focus-${Date.now()}`, label: value, status: "current", createdAt, updatedAt: createdAt }],
        activities: [{ id: `focus-${Date.now()}`, type: "focus" as const, label: `Added focus area: ${value}`, createdAt }, ...current.activities].slice(0, 12),
      };
    });
  }, [activeSubjectId, updateSubjectState]);
  const updateFocusArea = useCallback((area: FocusArea, status: FocusArea["status"]) => {
    const updatedAt = new Date().toISOString();
    updateSubjectState(activeSubjectId, (current) => ({ ...current, focusAreas: current.focusAreas.map((item) => item.id === area.id ? { ...item, status, updatedAt } : item) }));
    recordActivity(activeSubjectId, { type: status === "improved" ? "improved" : "focus", label: status === "improved" ? `Marked comfortable: ${area.label}` : `Restored focus area: ${area.label}`, createdAt: updatedAt });
  }, [activeSubjectId, recordActivity, updateSubjectState]);
  const addResult = useCallback((result: ResultEntry) => { updateSubjectState(activeSubjectId, (current) => ({ ...current, results: [result, ...current.results].slice(0, 12) })); }, [activeSubjectId, updateSubjectState]);
  const addTopicCheck = useCallback((entry: TopicCheckEntry) => {
    // TODO: sync the browser-local progress record to the authenticated profile store when its API is available.
    updateSubjectState(activeSubjectId, (current) => ({ ...current, topicChecks: [entry, ...current.topicChecks].slice(0, 8) }));
    recordActivity(activeSubjectId, { type: "topic-check", topicId: entry.topicId, label: `Topic Check: ${entry.topicName} (${entry.status === "independent" ? "independent" : "with support"})`, createdAt: entry.completedAt });
  }, [activeSubjectId, recordActivity, updateSubjectState]);
  const topicForFocus = useCallback((focus: string) => getSubjectTopics(activeSubjectId).find((topic) => topic.name.toLowerCase() === focus.trim().toLowerCase())?.id ?? "general", [activeSubjectId]);
  const openFocusTutor = useCallback((focus = "") => { openTopic(topicForFocus(focus)); }, [openTopic, topicForFocus]);
  const openTopicGenerator = useCallback((nextTopicId: string) => { setGeneratorTopicId(nextTopicId); goToTool("generator"); }, [goToTool]);
  const openFocusGenerator = useCallback((focus = "") => { openTopicGenerator(topicForFocus(focus)); }, [openTopicGenerator, topicForFocus]);

  return <div className="h-screen min-h-screen bg-[#eaf1ed] dark:bg-slate-950"><main className="app-study-shell flex h-full min-h-0 flex-col"><AppTopBar screen={screen} subjectId={subjectId} activeSubjectId={activeSubjectId} userInitials={initialsFrom(userName, userEmail)} onBack={screen === "workspace" ? goHome : screen === "conversation" ? () => setScreen(previousScreen) : goToWorkspace} onHome={goHome} onOpenSettings={() => router.push("/onboarding?edit=1")} /><div className={screen === "conversation" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"}>
    {screen === "home" && <HomeFeed hasProfile={Boolean(profile)} subjects={subjects} subjectLevels={profile?.subjectLevels} studyState={studyState} onSelectSubject={selectSubject} onContinueSubject={continueSubject} onOpenSettings={() => router.push("/onboarding?edit=1")} />}
    {screen === "workspace" && (
      <SubjectWorkspace
        subjectId={activeSubjectId}
        level={activeLevel}
        studyState={activeStudyState}
        onOpenTutor={(topic, summary) => goToTutor(topic, summary)}
        onOpenGenerator={(topic) => {
          if (topic) openTopicGenerator(topic);
          else goToTool("generator");
        }}
        onOpenProgress={() => goToTool("progress")}
        onOpenTopicCheck={(topic) => {
          if (topic) {
            updateSubjectState(activeSubjectId, (current) => ({ ...current, lastTopicId: topic }));
            setTopicId(topic);
          }
          goToTool("topic-check");
        }}
      />
    )}
    {screen === "conversation" && <ConversationView subjectId={activeSubjectId} level={activeLevel} topicId={topicId} sessionResetKey={tutorSessionResetKey} handoff={tutorHandoff} onOpenGenerator={() => openFocusGenerator(getTopic(activeSubjectId, topicId).name)} onStartSession={(activeTopicId) => recordActivity(activeSubjectId, { type: "tutor", topicId: activeTopicId, label: `Tutor session: ${getTopic(activeSubjectId, activeTopicId).name}`, createdAt: new Date().toISOString() })} onOpenTopic={openTopic} />}
    {screen === "generator" && <PapersView key={activeSubjectId} subjectId={activeSubjectId} level={activeLevel} initialTopicId={generatorTopicId} focusAreas={activeStudyState.focusAreas.filter((area) => area.status === "current")} onQuestionGenerated={(topic) => recordActivity(activeSubjectId, { type: "question", topicId: topic.id, label: `Generated an Exam Question: ${topic.name}`, createdAt: new Date().toISOString() })} onReflect={(outcome, topic) => { recordActivity(activeSubjectId, { type: "reflection", topicId: topic.id, label: `Question reflection: ${outcome}`, createdAt: new Date().toISOString() }); if (outcome === "Still stuck") addFocusArea(topic.name); }} />}
    {screen === "topic-check" && <TopicCheckView subjectId={activeSubjectId} level={activeLevel} onComplete={addTopicCheck} onAddFocusArea={addFocusArea} onOpenTutor={openTopic} onOpenGenerator={openTopicGenerator} />}
    {screen === "progress" && <><ProgressResultsView subjectId={activeSubjectId} level={activeLevel} focusAreas={activeStudyState.focusAreas} results={activeStudyState.results} activities={activeStudyState.activities} onAddFocusArea={addFocusArea} onUpdateFocusArea={updateFocusArea} onAddResult={addResult} onOpenConvo={openFocusTutor} onOpenGenerator={openFocusGenerator} onOpenTopicCheck={() => goToTool("topic-check")} /><TopicCheckHistory subjectId={activeSubjectId} entries={activeStudyState.topicChecks} /></>}
  </div>
  {quickCheckSubjectId && (
    <SubjectQuickCheck
      subjectId={quickCheckSubjectId}
      onDone={() => setQuickCheckSubjectId(null)}
    />
  )}
  </main></div>;
}
