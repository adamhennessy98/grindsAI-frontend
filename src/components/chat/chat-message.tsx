import type { Message } from "@/lib/types";
import { MathMarkdown } from "@/components/math-markdown";

export function ChatMessage({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="animate-fade-up flex justify-end">
        <div className="bg-emerald-500 text-white px-4 py-[11px] rounded-[18px_18px_4px_18px] max-w-[65%] text-[15px] leading-relaxed shadow-[0_1px_1px_rgba(0,0,0,0.04)] whitespace-pre-wrap">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-up flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-white text-emerald-700 grid place-items-center font-semibold text-sm border border-emerald-100 shrink-0 mt-0.5 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)]">
        G
      </div>
      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-[4px_18px_18px_18px] max-w-[75%] text-[15px] leading-[1.6]">
        <MathMarkdown>{msg.text}</MathMarkdown>
      </div>
    </div>
  );
}

export function ThinkingBubble() {
  return (
    <div className="animate-fade-up flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-white text-emerald-700 grid place-items-center font-semibold text-sm border border-emerald-100 shrink-0 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_1px_1px_rgba(17,24,39,0.03)]">
        G
      </div>
      <div className="bg-gray-100 px-[18px] py-3.5 rounded-[4px_18px_18px_18px] flex items-center">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
