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
import { emptySubjectStudyState, loadStudyState, saveStudyState, type FocusArea, type ResultEntry, type StudyActivity, type StudyStateBySubject, type TopicCheckEntry } from "@/components/app/study-state";
import { normaliseStudyStateBySubject, type SubjectStudyState } from "@/lib/study-state";
import type { Screen } from "@/components/app/types";
import type { NextStep } from "@/lib/learning/next-step";
import { recommendationDestination } from "@/lib/study-navigation";
import type { StudyLocation } from "@/lib/study-location";
import { confirmStudyNavigation, useStudyHistory } from "@/components/app/use-study-history";

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
  const [studyStateSyncStatus, setStudyStateSyncStatus] = useState<"loading" | "saving" | "saved" | "device-only">("loading");
  const [tutorHandoff, setTutorHandoff] = useState<TutorQuestionHandoff | null>(null);
  const [generatorTopicId, setGeneratorTopicId] = useState<string | undefined>();
  const [topicCheckTopicId, setTopicCheckTopicId] = useState<string | undefined>();
  const [quickCheckSubjectId, setQuickCheckSubjectId] = useState<string | null>(null);
  const [tutorSessionResetKey, setTutorSessionResetKey] = useState(0);
  const hasLoadedStudyState = useRef(false);
  const studyStateSyncVersion = useRef(0);
  const progressSaveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
      const localState = loadStudyState(ownerId);
      setStudyState(localState);
      setStudyStateOwner(ownerId);
      setStudyStateSyncStatus("loading");
      hasLoadedStudyState.current = false;

      try {
        const response = await fetch("/api/learning/study-state");
        if (!response.ok) throw new Error("Could not load progress.");
        const payload = (await response.json()) as { state?: unknown };
        const remoteState = normaliseStudyStateBySubject(payload.state);
        const mergedState = mergeStudyStates(localState, remoteState);
        setStudyState(mergedState);
        setStudyStateSyncStatus("saving");
      } catch {
        // Keep the existing browser cache usable if an old deployment has not run the migration yet.
        setStudyStateSyncStatus("device-only");
      } finally {
        hasLoadedStudyState.current = true;
      }
    })();
  }, []);

  const persistProgress = useCallback((nextState: StudyStateBySubject) => {
    const version = ++studyStateSyncVersion.current;
    setStudyStateSyncStatus("saving");
    const task = progressSaveQueue.current.catch(() => {}).then(async () => {
      const response = await fetch("/api/learning/study-state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: nextState }) });
      if (!response.ok) throw new Error("Could not save progress");
    }).then(() => {
      if (studyStateSyncVersion.current === version) setStudyStateSyncStatus("saved");
      return true;
    }).catch(() => {
      if (studyStateSyncVersion.current === version) setStudyStateSyncStatus("device-only");
      return false;
    });
    progressSaveQueue.current = task;
    return task;
  }, []);

  useEffect(() => {
    if (!studyStateOwner || !hasLoadedStudyState.current) return;
    saveStudyState(studyStateOwner, studyState);
    const timer = window.setTimeout(() => {
      void persistProgress(studyState);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [studyState, studyStateOwner, persistProgress]);

  const subjects = useMemo(() => (profile ? filterSubjects(profile.subjects) : []), [profile]);
  const fallbackSubjectId = subjects[0]?.id ?? SUBJECTS[0]?.id ?? "maths";
  const activeSubjectId = subjectId || fallbackSubjectId;
  const activeLevel = getSubjectLevel(profile, activeSubjectId);
  const activeStudyState = studyState[activeSubjectId] ?? emptySubjectStudyState();

  const restoreStudyLocation = useCallback((location: StudyLocation) => {
    setSubjectId(location.subjectId);
    setTopicId(location.topicId);
    setGeneratorTopicId(location.topicId);
    setTopicCheckTopicId(location.topicId);
    setTutorHandoff(null);
    setPreviousScreen("workspace");
    setScreen(location.screen);
  }, []);
  useStudyHistory({ screen, subjectId: screen === "home" ? "" : activeSubjectId, topicId: screen === "generator" ? generatorTopicId ?? "general" : screen === "topic-check" ? topicCheckTopicId ?? "general" : topicId }, restoreStudyLocation);

  const backToStudy = () => {
    if (Number(window.history.state?.studyDepth ?? 0) > 0) window.history.back();
    else if (confirmStudyNavigation()) restoreStudyLocation({ screen: screen === "workspace" ? "home" : "workspace", subjectId: activeSubjectId, topicId });
  };

  useEffect(() => {
    if (screen === "conversation") return;
    const frame = window.requestAnimationFrame(() => scrollAreaRef.current?.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, [activeSubjectId, screen]);

  const updateSubjectState = useCallback((id: string, update: (current: ReturnType<typeof emptySubjectStudyState>) => ReturnType<typeof emptySubjectStudyState>) => {
    studyStateSyncVersion.current += 1;
    setStudyStateSyncStatus("saving");
    setStudyState((current) => ({ ...current, [id]: update(current[id] ?? emptySubjectStudyState()) }));
  }, []);
  const recordActivity = useCallback((id: string, activity: Omit<StudyActivity, "id">) => {
    updateSubjectState(id, (current) => ({ ...current, activities: [{ ...activity, id: `${activity.type}-${Date.now()}` }, ...current.activities].slice(0, 12) }));
  }, [updateSubjectState]);

  const ensureSubject = useCallback(() => { if (subjectId) return subjectId; setSubjectId(fallbackSubjectId); return fallbackSubjectId; }, [fallbackSubjectId, subjectId]);
  const goHome = useCallback(() => { setSubjectId(""); setTutorHandoff(null); setGeneratorTopicId(undefined); setScreen("home"); }, []);

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

  const openRecommendation = useCallback((step: NextStep) => {
    const destination = recommendationDestination(step);
    setSubjectId(destination.subjectId);
    setTopicId(destination.topicId);
    setGeneratorTopicId(destination.screen === "generator" ? destination.topicId : undefined);
    setTopicCheckTopicId(destination.screen === "topic-check" ? destination.topicId : undefined);
    setPreviousScreen("workspace");
    setTutorHandoff(null);
    if (destination.screen === "conversation") {
      continueSubject(destination.subjectId, destination.topicId);
      if (destination.summary?.trim()) {
        setTutorHandoff({ id: `continue-${Date.now()}`, title: "Continue from last session", topicId: destination.topicId,
          topicName: getTopic(destination.subjectId, destination.topicId).name, level: getSubjectLevel(profile, destination.subjectId),
          sourceLabel: "Session continue", summary: destination.summary, initialMessage: "Help me continue from where I left off — keep it short.",
          contextPrompt: `Continue brief (structured wrap-up only):\n${destination.summary}` });
      }
    } else setScreen(destination.screen);
  }, [continueSubject, profile]);

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
  const addResult = useCallback(async (result: ResultEntry) => {
    const current = studyState[activeSubjectId] ?? emptySubjectStudyState();
    const next = { ...studyState, [activeSubjectId]: { ...current, results: [result, ...current.results.filter((item) => item.id !== result.id)].slice(0, 12) } };
    setStudyState(next);
    return persistProgress(next);
  }, [activeSubjectId, studyState, persistProgress]);
  const addTopicCheck = useCallback((entry: TopicCheckEntry) => {
    updateSubjectState(activeSubjectId, (current) => ({ ...current, topicChecks: [entry, ...current.topicChecks].slice(0, 8) }));
    recordActivity(activeSubjectId, { type: "topic-check", topicId: entry.topicId, label: `Topic Check: ${entry.topicName} (${entry.status === "independent" ? "independent" : "with support"})`, createdAt: entry.completedAt });
  }, [activeSubjectId, recordActivity, updateSubjectState]);
  const topicForFocus = useCallback((focus: string) => getSubjectTopics(activeSubjectId).find((topic) => topic.name.toLowerCase() === focus.trim().toLowerCase())?.id ?? "general", [activeSubjectId]);
  const openFocusTutor = useCallback((focus = "") => { openTopic(topicForFocus(focus)); }, [openTopic, topicForFocus]);
  const openTopicGenerator = useCallback((nextTopicId: string) => { setGeneratorTopicId(nextTopicId); goToTool("generator"); }, [goToTool]);
  const openFocusGenerator = useCallback((focus = "") => { openTopicGenerator(topicForFocus(focus)); }, [openTopicGenerator, topicForFocus]);

  return <div className="h-[100dvh] min-h-[100dvh] bg-[#eaf1ed] dark:bg-slate-950"><main className="app-study-shell flex h-full min-h-0 flex-col"><AppTopBar screen={screen} subjectId={subjectId} activeSubjectId={activeSubjectId} userInitials={initialsFrom(userName, userEmail)} onBack={backToStudy} onHome={() => { if (confirmStudyNavigation()) goHome(); }} onOpenSettings={() => { if (confirmStudyNavigation()) router.push("/account"); }} /><div ref={scrollAreaRef} className={screen === "conversation" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"}>
    {screen === "home" && <HomeFeed hasProfile={Boolean(profile)} subjects={subjects} subjectLevels={profile?.subjectLevels} studyState={studyState} onSelectSubject={selectSubject} onContinueSubject={continueSubject} onOpenRecommendation={openRecommendation} onOpenSettings={() => router.push("/onboarding?edit=1")} />}
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
          setTopicCheckTopicId(topic);
          if (topic) {
            updateSubjectState(activeSubjectId, (current) => ({ ...current, lastTopicId: topic }));
            setTopicId(topic);
          }
          goToTool("topic-check");
        }}
      />
    )}
    {screen === "conversation" && <ConversationView draftScope={studyStateOwner} subjectId={activeSubjectId} level={activeLevel} topicId={topicId} sessionResetKey={tutorSessionResetKey} handoff={tutorHandoff} onOpenGenerator={() => openFocusGenerator(getTopic(activeSubjectId, topicId).name)} onStartSession={(activeTopicId) => recordActivity(activeSubjectId, { type: "tutor", topicId: activeTopicId, label: `Tutor session: ${getTopic(activeSubjectId, activeTopicId).name}`, createdAt: new Date().toISOString() })} onOpenTopic={openTopic} />}
    {screen === "generator" && <PapersView onTopicChange={setGeneratorTopicId} key={activeSubjectId} subjectId={activeSubjectId} level={activeLevel} initialTopicId={generatorTopicId} focusAreas={activeStudyState.focusAreas.filter((area) => area.status === "current")} onQuestionGenerated={(topic) => recordActivity(activeSubjectId, { type: "question", topicId: topic.id, label: `Generated an Exam Question: ${topic.name}`, createdAt: new Date().toISOString() })} onReflect={(outcome, topic) => { recordActivity(activeSubjectId, { type: "reflection", topicId: topic.id, label: `Question reflection: ${outcome}`, createdAt: new Date().toISOString() }); if (outcome === "Still stuck") addFocusArea(topic.name); }} />}
    {screen === "topic-check" && <TopicCheckView draftScope={studyStateOwner} onTopicChange={setTopicCheckTopicId} key={activeSubjectId} subjectId={activeSubjectId} level={activeLevel} initialTopicId={topicCheckTopicId} onComplete={addTopicCheck} onAddFocusArea={addFocusArea} onOpenTutor={openTopic} onOpenGenerator={openTopicGenerator} />}
    {screen === "progress" && <ProgressResultsView draftScope={studyStateOwner} onRetrySave={() => void persistProgress(studyState)} subjectId={activeSubjectId} level={activeLevel} focusAreas={activeStudyState.focusAreas} results={activeStudyState.results} activities={activeStudyState.activities} storageStatus={studyStateSyncStatus} onAddFocusArea={addFocusArea} onUpdateFocusArea={updateFocusArea} onAddResult={addResult} onOpenConvo={openFocusTutor} onOpenGenerator={openFocusGenerator} onOpenTopicCheck={() => goToTool("topic-check")} />}
  </div>
  {quickCheckSubjectId && (
    <SubjectQuickCheck
      subjectId={quickCheckSubjectId}
      onDone={() => setQuickCheckSubjectId(null)}
    />
  )}
  </main></div>;
}

function mergeStudyStates(local: StudyStateBySubject, remote: StudyStateBySubject): StudyStateBySubject {
  const subjectIds = new Set([...Object.keys(local), ...Object.keys(remote)]);
  return Object.fromEntries([...subjectIds].map((subjectId) => {
    const localState = local[subjectId] ?? emptySubjectStudyState();
    const remoteState = remote[subjectId] ?? emptySubjectStudyState();
    return [subjectId, {
      lastTopicId: remoteState.lastTopicId ?? localState.lastTopicId,
      focusAreas: mergeEntries<SubjectStudyState["focusAreas"][number]>(localState.focusAreas, remoteState.focusAreas, "updatedAt", 30),
      results: mergeEntries<SubjectStudyState["results"][number]>(localState.results, remoteState.results, "createdAt", 60),
      activities: mergeEntries<SubjectStudyState["activities"][number]>(localState.activities, remoteState.activities, "createdAt", 100),
      topicChecks: mergeEntries<SubjectStudyState["topicChecks"][number]>(localState.topicChecks, remoteState.topicChecks, "completedAt", 40),
    }];
  }));
}

function mergeEntries<T extends { id: string }>(local: T[], remote: T[], dateKey: keyof T, max: number) {
  const entries = new Map<string, T>();
  for (const entry of local) entries.set(entry.id, entry);
  for (const entry of remote) entries.set(entry.id, entry);
  return [...entries.values()]
    .sort((a, b) => Date.parse(String(b[dateKey])) - Date.parse(String(a[dateKey])))
    .slice(0, max);
}
