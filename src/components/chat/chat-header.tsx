import Link from "next/link";
import { SubjectIcon, MenuIcon, ShieldIcon } from "@/components/icons";
import type { Subject } from "@/lib/types";

interface ChatHeaderProps {
  subject: Subject;
  level: string;
  onOpenSidebar: () => void;
  subscriptionActive?: boolean;
  onSignOut: () => void;
}

export function ChatHeader({
  subject,
  level,
  onOpenSidebar,
  subscriptionActive,
  onSignOut,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 border-b border-gray-200 bg-white min-h-[60px] shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="min-[861px]:hidden text-gray-600 p-1 hover:text-gray-900"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
        <div className="w-7 h-7 rounded-[7px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100 shrink-0">
          <SubjectIcon name={subject.icon} size={15} />
        </div>
        <h1 className="m-0 text-[15px] font-semibold tracking-[-0.005em] flex items-center gap-2">
          <span>{subject.name}</span>
          <span className="text-gray-300 font-normal">·</span>
          <span className="text-gray-500 font-medium">{level === "HL" ? "Higher Level" : "Ordinary Level"}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500">
          <ShieldIcon size={12} />
          Curriculum: LC 2025
        </span>
        {subscriptionActive && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-[5px] rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-800">
            Pro
          </span>
        )}
        <Link
          href="/pricing"
          className="inline-flex items-center h-[34px] px-2.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Upgrade
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center h-[34px] px-2.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
