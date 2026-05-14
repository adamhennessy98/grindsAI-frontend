"use client";

import Link from "next/link";
import { SUBJECTS } from "@/lib/constants";
import { SubjectIcon, LogoIcon, PlusIcon, CloseIcon, SettingsIcon } from "@/components/icons";

interface SidebarProps {
  subjectId: string;
  level: string;
  onSelectSubject: (id: string) => void;
  onSetLevel: (l: string) => void;
  onNewChat: () => void;
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  subjectId, level, onSelectSubject, onSetLevel, onNewChat, open, onClose,
}: SidebarProps) {
  return (
    <aside
      className={[
        "flex flex-col h-screen w-[240px] bg-gray-50 border-r border-gray-200 shrink-0",
        // mobile: fixed drawer
        "max-[860px]:fixed max-[860px]:top-0 max-[860px]:left-0 max-[860px]:bottom-0 max-[860px]:z-[90]",
        "max-[860px]:transition-transform max-[860px]:duration-[220ms]",
        open ? "max-[860px]:translate-x-0 max-[860px]:shadow-xl" : "max-[860px]:-translate-x-full",
      ].join(" ")}
    >
      {/* Top */}
      <div className="px-4 pt-[18px] pb-3">
        <div className="flex items-center justify-between mb-3.5">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={24} />
            <span className="text-[15.5px] font-semibold tracking-[-0.01em]">GrindsAI</span>
          </Link>
          <button
            onClick={onClose}
            className="min-[861px]:hidden text-gray-500 p-1 hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="w-full h-[38px] flex items-center justify-center gap-1.5 rounded-lg text-[13.5px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)]"
        >
          <PlusIcon size={14} /> New chat
        </button>
      </div>

      {/* Middle */}
      <div className="px-3.5 flex-1 overflow-auto">
        <SectionLabel>Subject</SectionLabel>
        <div className="flex flex-col gap-[3px] mb-[22px]">
          {SUBJECTS.map((s) => {
            const active = subjectId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => s.enabled && onSelectSubject(s.id)}
                disabled={!s.enabled}
                className={[
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[13.5px] transition-all",
                  "border",
                  active
                    ? "bg-white border-gray-200 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)] text-gray-900 font-medium"
                    : "border-transparent hover:bg-black/[0.04]",
                  !s.enabled ? "opacity-85 cursor-not-allowed text-gray-400" : active ? "" : "text-gray-600",
                ].join(" ")}
              >
                <span className={`w-[22px] h-[22px] grid place-items-center shrink-0 ${active ? "text-emerald-700" : s.enabled ? "text-gray-400" : "text-gray-300"}`}>
                  <SubjectIcon name={s.icon} size={15} />
                </span>
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{s.name}</span>
                {!s.enabled && (
                  <span className="text-[9.5px] text-gray-400 font-mono uppercase tracking-[0.04em] border border-gray-200 rounded px-1 py-px">
                    Soon
                  </span>
                )}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        <SectionLabel>Level</SectionLabel>
        <div className="grid grid-cols-2 gap-[3px] p-[3px] bg-white border border-gray-200 rounded-[9px] mb-[22px]">
          {[["HL", "Higher"], ["OL", "Ordinary"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => onSetLevel(k)}
              className={[
                "py-[7px] px-2.5 text-[13px] rounded-md transition-all",
                level === k
                  ? "bg-emerald-500 text-white font-medium shadow-[inset_0_-1px_0_rgba(0,0,0,0.12),0_1px_1.5px_rgba(16,185,129,0.25)]"
                  : "text-gray-500 hover:bg-gray-50",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-gray-200 flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white grid place-items-center font-semibold text-xs shrink-0">
          AM
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-900 font-medium text-[13px] truncate">Aoife Murphy</div>
          <div className="text-[11.5px] text-gray-400 truncate">aoife.m@school.ie</div>
        </div>
        <button
          aria-label="Settings"
          className="w-[30px] h-[30px] rounded-lg text-gray-400 grid place-items-center hover:bg-black/[0.05] hover:text-gray-700 transition-all"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] text-gray-400 uppercase tracking-[0.08em] font-mono px-1.5 pb-2">
      {children}
    </div>
  );
}
