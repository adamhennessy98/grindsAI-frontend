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
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 132) + "px";
  }, [draft]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div className="px-6 pt-3.5 pb-[18px] border-t border-gray-200 bg-white shrink-0">
      <div
        className="max-w-[760px] mx-auto border border-gray-200 rounded-[14px] px-3.5 pt-2.5 pb-2.5 pr-2.5 bg-white flex items-end gap-2 transition-[border-color,box-shadow] focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/[0.08]"
      >
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          placeholder={`Ask a question about ${subject.name}...`}
          rows={1}
          className="flex-1 resize-none border-none outline-none text-[15px] leading-relaxed py-2 px-1 bg-transparent min-h-6 max-h-[132px]"
        />
        <button
          onClick={onSend}
          disabled={!draft.trim()}
          aria-label="Send"
          className={[
            "w-9 h-9 rounded-[10px] grid place-items-center text-white transition-[background,transform] shrink-0",
            draft.trim()
              ? "bg-emerald-500 hover:bg-emerald-600 active:translate-y-px cursor-pointer"
              : "bg-gray-200 cursor-not-allowed",
          ].join(" ")}
        >
          <SendIcon size={16} />
        </button>
      </div>
      <div className="max-w-[760px] mx-auto mt-2 flex items-center justify-between text-[11.5px] text-gray-400 flex-wrap gap-1.5">
        <span>GrindsAI only uses official LC curriculum content</span>
        <span className="hidden md:block font-mono">Shift + Enter for a new line</span>
      </div>
    </div>
  );
}
