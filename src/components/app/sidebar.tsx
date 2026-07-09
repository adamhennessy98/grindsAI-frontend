"use client";

import { subjectInitial, subjectLabel } from "./subjects";
import type { Screen } from "./types";
import type { Subject } from "@/lib/types";

interface SidebarProps {
  screen: Screen;
  subjectId: string;
  subjects: Subject[];
  collapsed: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;
  onSelectAll: () => void;
  onSelectSubject: (id: string) => void;
  onGoHome: () => void;
  onGoWorkspace: () => void;
  onGoTutor: () => void;
  onGoGenerator: () => void;
  onGoTracker: () => void;
  onGoProgress: () => void;
  onOpenSettings: () => void;
}

export function AppSidebar({
  screen,
  subjectId,
  subjects,
  collapsed,
  userName,
  userEmail,
  userInitials,
  onSelectAll,
  onSelectSubject,
  onGoHome,
  onGoWorkspace,
  onGoTutor,
  onGoGenerator,
  onGoTracker,
  onGoProgress,
  onOpenSettings,
}: SidebarProps) {
  if (collapsed) {
    return (
      <CollapsedSidebar
        screen={screen}
        subjectId={subjectId}
        subjects={subjects}
        userInitials={userInitials}
        userName={userName}
        onSelectAll={onSelectAll}
        onSelectSubject={onSelectSubject}
        onGoHome={onGoHome}
        onGoWorkspace={onGoWorkspace}
        onGoTutor={onGoTutor}
        onGoGenerator={onGoGenerator}
        onGoTracker={onGoTracker}
        onGoProgress={onGoProgress}
      />
    );
  }

  const hasSubject = subjectId !== "all";

  return (
    <aside className="relative hidden h-full w-[276px] shrink-0 flex-col border-r border-gray-200 bg-gray-50 md:flex">
      <div className="flex items-center gap-[11px] px-[18px] pb-4 pt-5">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-emerald-500 shadow-[0_2px_6px_-2px_rgba(16,185,129,0.35)]">
          <LogoMark />
        </div>
        <div className="font-heading text-[20px] font-semibold tracking-[-0.02em] text-gray-900">
          Grinds<span className="text-emerald-500">AI</span>
        </div>
      </div>

      <div className="px-3 pt-1">
        <NavRow icon={<GridIcon />} label="My subjects" active={screen === "home"} onClick={onGoHome} />
      </div>

      <div className="flex items-center justify-between px-[18px] pb-[7px] pt-[18px]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Subjects</span>
        <span className="text-[11px] text-gray-400">{subjects.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <button
          type="button"
          onClick={onSelectAll}
          className="relative mb-0.5 flex w-full items-center gap-3 rounded-[10px] px-3 py-[9px] text-left text-gray-700 transition-colors hover:bg-gray-100"
        >
          {subjectId === "all" && <ActiveMarker />}
          <span className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg border-[1.5px] border-dashed border-gray-300">
            <GridIcon />
          </span>
          <span className="relative flex-1 text-[14.5px] font-medium">All subjects</span>
        </button>

        {subjects.map((subject) => {
          const active = subjectId === subject.id;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              className="relative mb-0.5 flex w-full items-center gap-3 rounded-[10px] px-3 py-[9px] text-left text-gray-700 transition-colors hover:bg-gray-100"
            >
              {active && <ActiveMarker />}
              <span className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-[11.5px] font-semibold text-gray-500">
                {subjectInitial(subject.id)}
              </span>
              <span className="relative flex-1 truncate text-[14.5px]">{subject.name}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-200 px-3 py-2">
        <div className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400">
          {hasSubject ? subjectLabel(subjectId) : "Subject tools"}
        </div>
        <NavRow icon={<WorkspaceIcon />} label="Workspace" active={screen === "workspace"} onClick={onGoWorkspace} />
        <NavRow icon={<TutorIcon />} label="Tutor" active={screen === "conversation"} onClick={onGoTutor} />
        <NavRow icon={<PapersIcon />} label="Practice questions" active={screen === "generator"} onClick={onGoGenerator} />
        <NavRow icon={<TrackerIcon />} label="Exam tracker" active={screen === "tracker"} onClick={onGoTracker} />
        <NavRow icon={<ProgressIcon />} label="My progress" active={screen === "progress"} onClick={onGoProgress} />
      </div>

      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-[11px] border-t border-gray-200 bg-gray-50 px-4 py-[13px] text-left transition-colors hover:bg-gray-100"
      >
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gray-500 text-sm font-semibold text-white">
          {userInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-gray-900">{userName}</div>
          <div className="truncate text-[11.5px] text-gray-400">{userEmail || "Study profile"}</div>
        </div>
        <ChevronDownIcon />
      </button>
    </aside>
  );
}

function CollapsedSidebar({
  screen,
  subjectId,
  subjects,
  userInitials,
  userName,
  onSelectAll,
  onSelectSubject,
  onGoHome,
  onGoWorkspace,
  onGoTutor,
  onGoGenerator,
  onGoTracker,
  onGoProgress,
}: {
  screen: Screen;
  subjectId: string;
  subjects: Subject[];
  userInitials: string;
  userName: string;
  onSelectAll: () => void;
  onSelectSubject: (id: string) => void;
  onGoHome: () => void;
  onGoWorkspace: () => void;
  onGoTutor: () => void;
  onGoGenerator: () => void;
  onGoTracker: () => void;
  onGoProgress: () => void;
}) {
  return (
    <aside className="relative hidden h-full w-[74px] shrink-0 flex-col items-center border-r border-gray-200 bg-gray-50 md:flex">
      <div className="pb-3.5 pt-5">
        <div title="GrindsAI" className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-emerald-500 shadow-[0_2px_6px_-2px_rgba(16,185,129,0.35)]">
          <LogoMark />
        </div>
      </div>

      <IconButton active={screen === "home"} title="My subjects" onClick={onGoHome}>
        <GridIcon />
      </IconButton>

      <div className="my-2 h-px w-9 bg-gray-200" />

      <div className="flex flex-1 flex-col items-center gap-[7px] overflow-y-auto py-0.5">
        <button
          type="button"
          onClick={onSelectAll}
          title="All subjects"
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-gray-300 transition-colors hover:bg-gray-100"
        >
          {subjectId === "all" && <span className="absolute -left-[7px] bottom-[9px] top-[9px] w-[3px] rounded-[3px] bg-emerald-500" />}
          <GridIcon />
        </button>
        {subjects.map((subject) => {
          const active = subjectId === subject.id;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              title={subject.name}
              className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-500"
            >
              {active && (
                <>
                  <span className="absolute -left-[7px] bottom-2 top-2 w-[3px] rounded-[3px] bg-emerald-500" />
                  <span className="absolute -inset-[3px] rounded-[13px] border-2 border-gray-50 outline outline-2 outline-emerald-500" />
                </>
              )}
              {subjectInitial(subject.id)}
            </button>
          );
        })}
      </div>

      <div className="flex w-full flex-col items-center gap-1.5 border-t border-gray-200 py-2.5">
        <IconButton active={screen === "workspace"} title="Workspace" onClick={onGoWorkspace}>
          <WorkspaceIcon />
        </IconButton>
        <IconButton active={screen === "conversation"} title="Tutor" onClick={onGoTutor}>
          <TutorIcon />
        </IconButton>
        <IconButton active={screen === "generator"} title="Practice questions" onClick={onGoGenerator}>
          <PapersIcon />
        </IconButton>
        <IconButton active={screen === "tracker"} title="Exam tracker" onClick={onGoTracker}>
          <TrackerIcon />
        </IconButton>
        <IconButton active={screen === "progress"} title="My progress" onClick={onGoProgress}>
          <ProgressIcon />
        </IconButton>
        <div title={userName} className="mt-1 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gray-500 text-[13px] font-semibold text-white">
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
      className="relative flex w-full items-center gap-[11px] rounded-[10px] px-3 py-[9px] text-left text-gray-700 transition-colors hover:bg-gray-100"
    >
      {active && <ActiveMarker />}
      <span className="relative">{icon}</span>
      <span className="relative text-[14.5px] font-medium">{label}</span>
    </button>
  );
}

function IconButton({
  active,
  title,
  onClick,
  children,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[11px] transition-colors hover:bg-gray-100"
    >
      {active && <span className="absolute inset-0 rounded-[11px] bg-gray-100" />}
      <span className="relative">{children}</span>
    </button>
  );
}

function ActiveMarker() {
  return (
    <>
      <span className="absolute inset-0 rounded-[10px] bg-gray-100" />
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-[3px] bg-emerald-500" />
    </>
  );
}

function LogoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21c4-2 7-5 7-10V5l-7-2-7 2v6c0 5 3 8 7 10Z" stroke="#D1FAE5" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.3 12.2l2 2 3.6-4" stroke="#D1FAE5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#6B7280" strokeWidth="1.7" />
    </svg>
  );
}

function WorkspaceIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" stroke="#6B7280" strokeWidth="1.6" />
      <path d="M4 10h16M10 20V10" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5a3.5 3.5 0 0 1-3.5 3.5h-3.2L8 19v-4.1A3.5 3.5 0 0 1 5 11.5z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8h6M9 11h3.5" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PapersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 13h6M9 17h6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrackerIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12M6 20h12M8 4v4.5c0 1.6 1 2.5 2.2 3.5C9 13 8 13.9 8 15.5V20M16 4v4.5c0 1.6-1 2.5-2.2 3.5C15 13 16 13.9 16 15.5V20" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
