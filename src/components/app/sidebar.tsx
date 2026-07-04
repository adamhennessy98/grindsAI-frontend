"use client";

import { SUBJECTS } from "@/lib/constants";
import { subjectInitial } from "./subjects";
import type { Screen } from "./types";

interface SidebarProps {
  screen: Screen;
  subjectId: string;
  collapsed: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;
  onSelectAll: () => void;
  onSelectSubject: (id: string) => void;
  onGoHome: () => void;
  onGoPapers: () => void;
  onGoProgress: () => void;
  onOpenSettings: () => void;
}

export function AppSidebar({
  screen,
  subjectId,
  collapsed,
  userName,
  userEmail,
  userInitials,
  onSelectAll,
  onSelectSubject,
  onGoHome,
  onGoPapers,
  onGoProgress,
  onOpenSettings,
}: SidebarProps) {
  if (collapsed) {
    return (
      <CollapsedSidebar
        screen={screen}
        subjectId={subjectId}
        userInitials={userInitials}
        userName={userName}
        onSelectAll={onSelectAll}
        onSelectSubject={onSelectSubject}
        onGoHome={onGoHome}
        onGoPapers={onGoPapers}
        onGoProgress={onGoProgress}
      />
    );
  }

  const allActive = subjectId === "all";

  return (
    <aside className="relative w-[272px] shrink-0 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-[11px] px-[18px] pt-5 pb-4">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_2px_6px_-2px_rgba(16,185,129,0.35)]">
          <LogoMark />
        </div>
        <div className="font-heading text-[20px] font-semibold tracking-[-0.02em] text-gray-900">
          Grinds<span className="text-emerald-500">AI</span>
        </div>
      </div>

      <div className="px-3 pt-1">
        <NavRow icon={<CompassIcon />} label="Today" active={screen === "home"} onClick={onGoHome} />
      </div>

      <div className="flex items-center justify-between px-[18px] pt-[18px] pb-[7px]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Subjects</span>
        <span className="text-[11px] text-gray-400">{SUBJECTS.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <button
          type="button"
          onClick={onSelectAll}
          className="relative flex items-center gap-3 w-full px-3 py-[9px] mb-0.5 rounded-[10px] text-left text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {allActive && <ActiveMarker />}
          <span className="relative w-[26px] h-[26px] rounded-lg flex items-center justify-center shrink-0 border-[1.5px] border-dashed border-gray-300">
            <GridIcon />
          </span>
          <span className="relative flex-1 text-[14.5px] font-medium">All subjects</span>
        </button>

        {SUBJECTS.map((subject) => {
          const active = subjectId === subject.id;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              className="relative flex items-center gap-3 w-full px-3 py-[9px] mb-0.5 rounded-[10px] text-left text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {active && <ActiveMarker />}
              <span className="relative w-[26px] h-[26px] rounded-lg flex items-center justify-center text-[11.5px] font-semibold text-gray-500 shrink-0 bg-gray-100 border border-gray-200">
                {subjectInitial(subject.id)}
              </span>
              <span className="relative flex-1 text-[14.5px] truncate">{subject.name}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-2 border-t border-gray-200">
        <NavRow icon={<PapersIcon />} label="Exam papers" active={screen === "papers"} onClick={onGoPapers} />
        <NavRow icon={<ProgressIcon />} label="Progress" active={screen === "progress"} onClick={onGoProgress} />
      </div>

      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-[11px] px-4 py-[13px] border-t border-gray-200 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
      >
        <div className="w-[34px] h-[34px] rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold text-sm shrink-0">
          {userInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-gray-900 truncate">{userName}</div>
          <div className="text-[11.5px] text-gray-400 truncate">{userEmail || "Signed in"}</div>
        </div>
        <ChevronDownIcon />
      </button>
    </aside>
  );
}

function CollapsedSidebar({
  screen,
  subjectId,
  userInitials,
  userName,
  onSelectAll,
  onSelectSubject,
  onGoHome,
  onGoPapers,
  onGoProgress,
}: {
  screen: Screen;
  subjectId: string;
  userInitials: string;
  userName: string;
  onSelectAll: () => void;
  onSelectSubject: (id: string) => void;
  onGoHome: () => void;
  onGoPapers: () => void;
  onGoProgress: () => void;
}) {
  const allActive = subjectId === "all";
  return (
    <aside className="relative w-[74px] shrink-0 h-full bg-gray-50 border-r border-gray-200 flex flex-col items-center">
      <div className="pt-5 pb-3.5">
        <div title="GrindsAI" className="w-[34px] h-[34px] rounded-[10px] bg-emerald-500 flex items-center justify-center shadow-[0_2px_6px_-2px_rgba(16,185,129,0.35)]">
          <LogoMark />
        </div>
      </div>

      <button
        type="button"
        onClick={onGoHome}
        title="Today"
        className="relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mb-1 hover:bg-gray-100 transition-colors"
      >
        {screen === "home" && <span className="absolute inset-0 bg-gray-100 rounded-[11px]" />}
        <span className="relative"><CompassIcon /></span>
      </button>

      <div className="w-9 h-px bg-gray-200 my-2" />

      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-[7px] py-0.5">
        <button
          type="button"
          onClick={onSelectAll}
          title="All subjects"
          className="relative w-[38px] h-[38px] rounded-[10px] border-[1.5px] border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          {allActive && <span className="absolute -left-[7px] top-[9px] bottom-[9px] w-[3px] rounded-[3px] bg-emerald-500" />}
          <GridIcon />
        </button>
        {SUBJECTS.map((subject) => {
          const active = subjectId === subject.id;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              title={subject.name}
              className="relative w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200"
            >
              {active && (
                <>
                  <span className="absolute -left-[7px] top-2 bottom-2 w-[3px] rounded-[3px] bg-emerald-500" />
                  <span className="absolute -inset-[3px] border-2 border-gray-50 outline outline-2 outline-emerald-500 rounded-[13px]" />
                </>
              )}
              {subjectInitial(subject.id)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1.5 py-2.5 border-t border-gray-200 w-full">
        <button
          type="button"
          onClick={onGoPapers}
          title="Exam papers"
          className="relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          {screen === "papers" && <span className="absolute inset-0 bg-gray-100 rounded-[11px]" />}
          <span className="relative"><PapersIcon /></span>
        </button>
        <button
          type="button"
          onClick={onGoProgress}
          title="Progress"
          className="relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          {screen === "progress" && <span className="absolute inset-0 bg-gray-100 rounded-[11px]" />}
          <span className="relative"><ProgressIcon /></span>
        </button>
        <div title={userName} className="w-[34px] h-[34px] rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold text-[13px] mt-1">
          {userInitials}
        </div>
      </div>
    </aside>
  );
}

function NavRow({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-[11px] w-full px-3 py-[9px] rounded-[10px] text-left text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {active && <ActiveMarker />}
      <span className="relative">{icon}</span>
      <span className="relative text-[14.5px] font-medium">{label}</span>
    </button>
  );
}

function ActiveMarker() {
  return (
    <>
      <span className="absolute inset-0 bg-gray-100 rounded-[10px]" />
      <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-[3px] bg-emerald-500" />
    </>
  );
}

function LogoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21c4-2 7-5 7-10V5l-7-2-7 2v6c0 5 3 8 7 10Z" stroke="#D1FAE5" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.3 12.2l2 2 3.6-4" stroke="#D1FAE5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="#6B7280" strokeWidth="1.6" />
      <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4 17 17M7 7 5.6 5.6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
    </svg>
  );
}

function PapersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h8l4 4v14H6z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 13h6M9 17h6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
