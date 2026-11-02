"use client";

import { useEffect, useRef } from "react";

// Tab-local drafts are scoped by signed-in account, subject and level by callers.
export function useSessionDraft<T>(key: string | null, value: T | null, restore: (value: unknown) => void) {
  const loadedKey = useRef<string | null>(null);
  useEffect(() => {
    if (!key) return;
    const timer = window.setTimeout(() => {
      try {
        const raw = window.sessionStorage.getItem(key);
        restore(raw ? JSON.parse(raw) : null);
      } catch { /* A damaged draft must never prevent opening a tool. */ }
      loadedKey.current = key;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key, restore]);
  useEffect(() => {
    if (!key || loadedKey.current !== key) return;
    try {
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch { /* Navigation warnings still protect work when storage is blocked. */ }
  }, [key, value]);
}

export function useUnfinishedWork(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const beforeNavigation = (event: Event) => {
      if (!window.confirm("Leave this unfinished work? A draft will stay in this tab where browser storage is available.")) event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("grindsai:before-study-navigation", beforeNavigation);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("grindsai:before-study-navigation", beforeNavigation);
    };
  }, [active]);
}
