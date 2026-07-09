"use client";

import { subjectLabel } from "./subjects";
import type { Screen } from "./types";

interface TopBarProps {
  screen: Screen;
  subjectId: string;
  activeSubjectId: string;
  onToggleSidebar: () => void;
  onExitConvo: () => void;
}

export function AppTopBar({ screen, subjectId, activeSubjectId, onToggleSidebar, onExitConvo }: TopBarProps) {
  const inConvo = screen === "conversation";
  const subject = subjectLabel(activeSubjectId);

  return (
    <header className="relative z-[3] flex h-[62px] shrink-0 items-center gap-3.5 border-b border-gray-200 bg-white/90 px-5 backdrop-blur-sm sm:px-7">
      <button
        type="button"
        onClick={onToggleSidebar}
        title="Toggle sidebar"
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-gray-200 bg-gray-50 transition-colors hover:bg-gray-100"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="#6B7280" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {inConvo ? (
        <button
          type="button"
          onClick={onExitConvo}
          className="-ml-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      ) : (
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="font-heading truncate text-lg font-semibold text-gray-900">{screenTitle(screen, subjectId, subject)}</span>
          <span className="hidden text-[13px] text-gray-400 sm:inline">{screenSubtitle(screen, subjectId, subject)}</span>
        </div>
      )}

      <div className="flex-1" />

      {inConvo ? (
        <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-[11px] py-[5px] text-[12.5px] text-gray-500 sm:flex">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v5l3 2" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="8.5" stroke="#10B981" strokeWidth="1.6" />
          </svg>
          Tutor memory active for&nbsp;<strong className="font-semibold text-emerald-600">{subject}</strong>
        </div>
      ) : screen === "home" ? (
        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-[5px] font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] text-amber-900">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Beta
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-500">
            <span className="h-[7px] w-[7px] rounded-full bg-emerald-500" />
            Leaving Cert planning
          </span>
        </div>
      ) : null}
    </header>
  );
}

function screenTitle(screen: Screen, subjectId: string, subject: string) {
  if (screen === "home" || subjectId === "all") return "My subjects";
  if (screen === "workspace") return `${subject} workspace`;
  if (screen === "generator") return "Practice questions";
  if (screen === "tracker") return "Exam tracker";
  if (screen === "progress") return "My progress";
  return "Tutor";
}

function screenSubtitle(screen: Screen, subjectId: string, subject: string) {
  if (screen === "home" || subjectId === "all") return "Choose what to work on";
  if (screen === "workspace") return "Tutor, practice, tracker, and progress";
  return subject;
}
