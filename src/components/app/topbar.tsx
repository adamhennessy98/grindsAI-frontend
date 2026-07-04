"use client";

import type { Screen } from "./types";

interface TopBarProps {
  screen: Screen;
  onToggleSidebar: () => void;
  onExitConvo: () => void;
}

export function AppTopBar({ screen, onToggleSidebar, onExitConvo }: TopBarProps) {
  const inConvo = screen === "conversation";

  return (
    <header className="relative z-[3] flex items-center gap-3.5 px-7 h-[62px] shrink-0 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggleSidebar}
        title="Toggle sidebar"
        className="w-[34px] h-[34px] rounded-[9px] border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="#6B7280" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {inConvo ? (
        <button
          type="button"
          onClick={onExitConvo}
          className="flex items-center gap-2 -ml-1 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">Back to Today</span>
        </button>
      ) : screen === "home" ? (
        <div className="flex items-baseline gap-2.5">
          <span className="font-heading text-lg font-semibold text-gray-900">Today</span>
          <span className="text-[13px] text-gray-400">Friday 27 November</span>
        </div>
      ) : screen === "papers" ? (
        <span className="font-heading text-lg font-semibold text-gray-900">Exam papers</span>
      ) : (
        <span className="font-heading text-lg font-semibold text-gray-900">Your progress</span>
      )}

      <div className="flex-1" />

      {inConvo ? (
        <div className="flex items-center gap-2 text-[12.5px] text-gray-500 bg-gray-100 border border-gray-200 px-[11px] py-[5px] rounded-full">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5l3 2" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="8.5" stroke="#10B981" strokeWidth="1.6" />
          </svg>
          Saoirse remembers your last&nbsp;<strong className="text-emerald-600 font-semibold">18 sessions</strong>
        </div>
      ) : screen === "home" ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-[5px] rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Beta
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
            Leaving Cert · 193 days
          </span>
        </div>
      ) : null}
    </header>
  );
}
