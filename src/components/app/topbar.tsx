"use client";

import { useEffect, useState } from "react";
import { subjectLabel } from "./subjects";
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

export function AppTopBar({
  screen,
  subjectId,
  activeSubjectId,
  userInitials,
  onBack,
  onHome,
  onOpenSettings,
}: TopBarProps) {
  const isHome = screen === "home";
  const subject = subjectLabel(activeSubjectId);
  const title = screenTitle(screen, subjectId, subject);
  const subtitle = screenSubtitle(screen, subjectId, subject);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("grindsai-theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("grindsai-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-[5] border-b border-white/70 bg-white/82 px-4 py-3 shadow-[0_10px_35px_-30px_rgba(15,23,42,.55)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1120px] items-center gap-3">
        {isHome ? (
          <button type="button" onClick={onHome} className="flex min-w-0 items-center gap-2.5 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#10b981,#22d3ee)] font-heading text-sm font-semibold text-white shadow-[0_10px_24px_-16px_rgba(16,185,129,.9)]">
              G
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-[17px] font-semibold text-gray-900">GrindsAI</span>
              <span className="block text-xs text-gray-400">Leaving Cert tutor</span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/85 shadow-[0_8px_22px_-18px_rgba(15,23,42,.45)] transition-colors hover:bg-cyan-50"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="#4B5563" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {!isHome && (
          <div className="min-w-0 flex-1">
            <div className="font-heading truncate text-[16.5px] font-semibold text-gray-900">{title}</div>
            <div className="truncate text-xs text-gray-400">{subtitle}</div>
          </div>
        )}

        {isHome && <div className="flex-1" />}

        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 text-[12.5px] font-semibold text-gray-700 shadow-[0_8px_22px_-18px_rgba(15,23,42,.45)] transition-colors hover:bg-amber-50"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={darkMode}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
          <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fef3c7,#bbf7d0)] text-[13px] font-semibold text-gray-800 shadow-[0_10px_24px_-18px_rgba(245,158,11,.75)] transition-transform hover:scale-[1.03]"
          title="Study profile"
        >
          {userInitials}
        </button>
      </div>
    </header>
  );
}

function screenTitle(screen: Screen, subjectId: string, subject: string) {
  if (screen === "home" || !subjectId) return "My subjects";
  if (screen === "workspace") return subject;
  if (screen === "generator") return "Practice questions";
  if (screen === "tracker") return "Exam tracker";
  if (screen === "progress") return "My progress";
  return "Tutor";
}

function screenSubtitle(screen: Screen, subjectId: string, subject: string) {
  if (screen === "home" || !subjectId) return "Choose what to work on";
  if (screen === "workspace") return "Choose what to do next";
  if (screen === "conversation") return `${subject} tutor`;
  return subject;
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 15.2A7.7 7.7 0 0 1 8.8 4a8.2 8.2 0 1 0 11.2 11.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
