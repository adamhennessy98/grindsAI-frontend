"use client";

import { useEffect, useRef } from "react";
import { SendIcon } from "@/components/icons";
import type { Subject } from "@/lib/types";

interface ComposerProps {
  draft: string;
  subject: Subject;
  onChange: (v: string) => void;
  onSend: () => void;
}

export function Composer({ draft, subject, onChange, onSend }: ComposerProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const maxHeight = window.matchMedia("(max-width: 640px)").matches ? 104 : 132;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
  }, [draft]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div className="px-6 max-sm:px-3 pt-3.5 max-sm:pt-2.5 pb-[18px] max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-gray-200 bg-white shrink-0">
      <div
        className="max-w-[760px] mx-auto border border-gray-200 rounded-[14px] max-sm:rounded-[12px] px-3.5 max-sm:px-3 pt-2.5 max-sm:pt-2 pb-2.5 max-sm:pb-2 pr-2.5 max-sm:pr-2 bg-white flex items-end gap-2 transition-[border-color,box-shadow] focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/[0.08]"
      >
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          placeholder={`Ask a question about ${subject.name}...`}
          rows={1}
          className="flex-1 resize-none border-none outline-none text-[15px] max-sm:text-[14px] leading-relaxed py-2 max-sm:py-1.5 px-1 bg-transparent min-h-6 max-h-[132px] max-sm:max-h-[104px]"
        />
        <button
          onClick={onSend}
          disabled={!draft.trim()}
          aria-label="Send"
          className={[
            "w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-[10px] max-sm:rounded-[9px] grid place-items-center text-white transition-[background,transform] shrink-0",
            draft.trim()
              ? "bg-emerald-500 hover:bg-emerald-600 active:translate-y-px cursor-pointer"
              : "bg-gray-200 cursor-not-allowed",
          ].join(" ")}
        >
          <SendIcon size={16} />
        </button>
      </div>
      <div className="max-w-[760px] mx-auto mt-2 max-sm:hidden flex items-center justify-between text-[11.5px] text-gray-400 flex-wrap gap-1.5">
        <span>GrindsAI only uses official LC curriculum content</span>
        <span className="hidden md:block font-mono">Shift + Enter for a new line</span>
      </div>
    </div>
  );
}
