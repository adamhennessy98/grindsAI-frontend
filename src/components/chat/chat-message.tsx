import type { Message } from "@/lib/types";
import { MathMarkdown } from "@/components/math-markdown";

export function ChatMessage({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="animate-fade-up flex justify-end">
        <div className="bg-emerald-500 text-white px-4 py-[11px] max-sm:px-3 max-sm:py-2.5 rounded-[18px_18px_4px_18px] max-w-[65%] max-sm:max-w-[88%] text-[15px] max-sm:text-[14px] leading-relaxed shadow-[0_1px_1px_rgba(0,0,0,0.04)] whitespace-pre-wrap break-words">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-up flex gap-3 max-sm:gap-2 items-start">
      <div className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-white text-emerald-700 grid place-items-center font-semibold text-sm max-sm:text-[12px] border border-emerald-100 shrink-0 mt-0.5 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)]">
        G
      </div>
      <div className="bg-gray-100 text-gray-900 px-4 py-3 max-sm:px-3 max-sm:py-2.5 rounded-[4px_18px_18px_18px] max-w-[75%] max-sm:max-w-[calc(100%-2.25rem)] text-[15px] max-sm:text-[14px] leading-[1.6] max-sm:leading-relaxed min-w-0">
        <MathMarkdown>{msg.text}</MathMarkdown>
      </div>
    </div>
  );
}

export function ThinkingBubble() {
  return (
    <div className="animate-fade-up flex gap-3 max-sm:gap-2 items-start">
      <div className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-white text-emerald-700 grid place-items-center font-semibold text-sm max-sm:text-[12px] border border-emerald-100 shrink-0 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)]">
        G
      </div>
      <div className="bg-gray-100 px-[18px] max-sm:px-4 py-3.5 max-sm:py-3 rounded-[4px_18px_18px_18px] flex items-center">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
