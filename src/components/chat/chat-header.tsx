import Link from "next/link";
import { SubjectIcon, MenuIcon, ShieldIcon } from "@/components/icons";
import { BetaBadge } from "@/components/beta-badge";
import { BETA_FEEDBACK_EMAIL, IS_BETA } from "@/lib/beta";
import type { Subject, SubjectTopic } from "@/lib/types";

interface ChatHeaderProps {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
  onOpenSidebar: () => void;
  subscriptionActive?: boolean;
  onSignOut: () => void;
}

export function ChatHeader({
  subject,
  level,
  topic,
  onOpenSidebar,
  subscriptionActive,
  onSignOut,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 px-6 max-sm:px-3 border-b border-gray-200 bg-white min-h-[60px] max-sm:min-h-[56px] shrink-0">
      <div className="flex items-center gap-3 max-sm:gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="min-[861px]:hidden text-gray-600 p-1 hover:text-gray-900 shrink-0"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
        <div className="w-7 h-7 rounded-[7px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100 shrink-0 max-[360px]:hidden">
          <SubjectIcon name={subject.icon} size={15} />
        </div>
        <h1 className="m-0 text-[15px] font-semibold tracking-[-0.005em] hidden sm:flex items-center gap-2 min-w-0">
          <span className="shrink-0">{subject.name}</span>
          <span className="text-gray-300 font-normal">/</span>
          <span className="text-gray-500 font-medium shrink-0">{level === "HL" ? "Higher Level" : "Ordinary Level"}</span>
          <span className="text-gray-300 font-normal">/</span>
          <span className="text-gray-500 font-medium truncate min-w-0">{topic.name}</span>
        </h1>
        <h1 className="m-0 text-[14px] font-semibold tracking-[-0.005em] sm:hidden flex items-center gap-1.5 min-w-0">
          <span className="shrink-0 max-w-[112px] truncate">{subject.name}</span>
          <span className="text-gray-300 font-normal shrink-0">/</span>
          <span className="text-gray-500 font-medium truncate min-w-0">{topic.name}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2.5 max-sm:gap-1.5 shrink-0">
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500">
          <ShieldIcon size={12} />
          Curriculum: LC 2025
        </span>
        {IS_BETA ? (
          <>
            <BetaBadge className="hidden sm:inline-flex" />
            <a
              href={`mailto:${BETA_FEEDBACK_EMAIL}?subject=GrindsAI%20beta%20feedback`}
              className="hidden lg:inline-flex items-center h-[34px] px-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
            >
              Send feedback
            </a>
          </>
        ) : (
          <>
            {subscriptionActive && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-[5px] rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-800">
                Pro
              </span>
            )}
            {!subscriptionActive && (
              <Link
                href="/pricing"
                className="inline-flex items-center h-[34px] max-sm:h-[32px] px-2.5 max-sm:px-2 rounded-lg text-[13px] max-sm:text-[12.5px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
              >
                Upgrade
              </Link>
            )}
          </>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="hidden sm:inline-flex items-center h-[34px] px-2.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
