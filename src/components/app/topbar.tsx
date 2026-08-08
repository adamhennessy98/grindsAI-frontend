"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/icons";
import { subjectLabel, subjectThemeStyle } from "./subjects";
import type { Screen } from "./types";

interface TopBarProps {
  screen: Screen;
  subjectId: string;
  activeSubjectId: string;
  userInitials: string;
  onBack: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
}

export function AppTopBar({ screen, activeSubjectId, userInitials, onBack, onHome, onOpenSettings }: TopBarProps) {
  const isHome = screen === "home";
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("grindsai-theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("grindsai-theme", next ? "dark" : "light");
      return next;
    });
  };

  const subject = subjectLabel(activeSubjectId);
  const title = screen === "workspace" ? subject : screen === "generator" ? "Exam Questions" : screen === "progress" ? "Progress & Results" : screen === "topic-check" ? "Topic Check" : "Tutor";
  const subtitle = screen === "workspace" ? "Choose what to do next" : screen === "conversation" ? `${subject} tutor` : subject;

  return (
    <header style={subjectThemeStyle(activeSubjectId)} className="sticky top-0 z-20 border-b border-white/70 bg-[#f7faf8]/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
      <div className="mx-auto flex max-w-[1120px] items-center gap-3">
        {isHome ? (
          <button type="button" onClick={onHome} className="flex min-w-0 flex-col items-start gap-0.5 text-left">
            <BrandLogo height={36} />
            <span className="pl-0.5 text-[11px] text-gray-400">Leaving Cert study workspace</span>
          </button>
        ) : (
          <button type="button" onClick={onBack} aria-label="Go back" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        {!isHome && <div className="min-w-0 flex-1"><div className="truncate font-heading text-[16.5px] font-semibold text-gray-900 dark:text-white">{title}</div><div className="subject-context-label truncate text-xs">{subtitle}</div></div>}
        {isHome && <div className="flex-1" />}
        <button type="button" onClick={toggleTheme} title={darkMode ? "Switch to light mode" : "Switch to dark mode"} className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-[12.5px] font-semibold text-gray-700 transition-colors hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
          <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span><span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
        </button>
        <button type="button" onClick={onOpenSettings} title="Study profile and feedback" className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fef3c7,#bbf7d0)] text-[13px] font-semibold text-gray-800 transition-transform hover:scale-[1.03] dark:!bg-none dark:!bg-cyan-950 dark:!text-cyan-100 dark:ring-1 dark:ring-cyan-700">{userInitials}</button>
      </div>
    </header>
  );
}
