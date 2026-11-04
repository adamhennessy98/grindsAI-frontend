"use client";

import { useEffect, useRef } from "react";
import { readStudyLocation, studyLocationUrl, type StudyLocation } from "@/lib/study-location";

export function confirmStudyNavigation() {
  return window.dispatchEvent(new Event("grindsai:before-study-navigation", { cancelable: true }));
}

export function useStudyHistory(location: StudyLocation, restore: (location: StudyLocation) => void) {
  const initialized = useRef(false);
  const pending = useRef<string | null>(null);
  const cancelling = useRef(false);
  const url = studyLocationUrl(location);
  const { screen, subjectId, topicId } = location;

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const initial = readStudyLocation(window.location.hash);
      const initialUrl = studyLocationUrl(initial);
      const alreadyTracked = typeof window.history.state?.studyDepth === "number";
      if (!alreadyTracked) window.history.replaceState({ ...window.history.state, studyDepth: 0 }, "", "/chat");
      if (initial.screen !== "home" && !alreadyTracked) {
        window.history.pushState({ ...window.history.state, studyDepth: 1 }, "", studyLocationUrl({ ...initial, screen: "workspace" }));
        if (initial.screen !== "workspace") window.history.pushState({ ...window.history.state, studyDepth: 2 }, "", initialUrl);
      }
      if (initial.screen !== "home") {
        pending.current = initialUrl;
        restore(initial);
      }
    }
    if (pending.current) {
      if (pending.current === url) pending.current = null;
    } else if (`${window.location.pathname}${window.location.hash}` !== url) {
      const current = readStudyLocation(window.location.hash);
      const sameTool = current.screen === screen && current.subjectId === subjectId;
      let depth = Number(window.history.state?.studyDepth ?? 0);
      if (current.screen === "home" && screen !== "home" && screen !== "workspace") {
        window.history.pushState({ ...window.history.state, studyDepth: ++depth }, "", studyLocationUrl({ screen: "workspace", subjectId, topicId }));
      }
      if (sameTool) window.history.replaceState({ ...window.history.state, studyDepth: depth }, "", url);
      else window.history.pushState({ ...window.history.state, studyDepth: depth + 1 }, "", url);
    }

    const activeDepth = Number(window.history.state?.studyDepth ?? 0);
    const onPop = () => {
      if (window.location.pathname !== "/chat") return;
      if (cancelling.current) { cancelling.current = false; return; }
      if (!confirmStudyNavigation()) {
        cancelling.current = true;
        window.history.go(Number(window.history.state?.studyDepth ?? 0) > activeDepth ? -1 : 1);
        return;
      }
      const next = readStudyLocation(window.location.hash);
      pending.current = studyLocationUrl(next);
      restore(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [url, screen, subjectId, topicId, restore]);
}
