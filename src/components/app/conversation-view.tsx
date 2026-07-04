"use client";

interface ConversationViewProps {
  stuck: boolean;
  onRevealStuck: () => void;
}

export function ConversationView({ stuck, onRevealStuck }: ConversationViewProps) {
  return (
    <div className="max-w-[780px] mx-auto px-7 h-full flex flex-col">
      {/* session header */}
      <div className="flex items-center gap-[13px] pt-5 pb-4 px-1 border-b border-gray-200">
        <div className="relative w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-xl font-semibold shrink-0">
          S
          <span className="absolute right-px bottom-px w-[11px] h-[11px] rounded-full bg-emerald-400 border-2 border-white" />
        </div>
        <div className="flex-1">
          <div className="font-heading text-[17px] font-semibold text-gray-900">Saoirse</div>
          <div className="text-[12.5px] text-gray-400">Maths (H) · Differentiation · picking up from your mock</div>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-[11px] py-[5px] rounded-full">
          Higher Level
        </span>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto pt-[22px] pb-4 px-1 flex flex-col gap-4">
        <TutorBubble>
          Fáilte ar ais, Colm. Let&apos;s go back to the question that cost you in the mock — the bracket raised to a power.
          I won&apos;t just hand you the answer; we&apos;ll get there together.
        </TutorBubble>

        <PastPaperCard />

        <TutorBubble>
          Before you reach for any formula — just <em>describe</em> it to me. Is (3x² + 1)⁵ one simple function, or
          is there something sitting <em>inside</em> something else?
        </TutorBubble>

        <StudentBubble>There&apos;s the 3x² + 1 inside, and then the whole thing is raised to the 5th.</StudentBubble>

        <TutorBubble>
          Exactly — a function tucked inside another. That &ldquo;inside–outside&rdquo; shape is the signal for one specific
          rule. Which one comes to mind?
        </TutorBubble>

        <StudentBubble>the chain rule?</StudentBubble>

        <QuickQuestion>quick one — remind me what d/dx of u&#8319; is?</QuickQuestion>
        <QuickFactBubble />

        <TutorBubble>
          Grand. So treat the inside as a single lump <em>u</em>. Differentiate just the <strong className="font-semibold">outer</strong>{" "}
          part first — what do you get? <span className="text-gray-400">(Don&apos;t multiply anything on yet.)</span>
        </TutorBubble>

        {stuck && (
          <>
            <QuickQuestion>I&apos;m still stuck…</QuickQuestion>
            <TutorBubble>
              No bother — one nudge. The outer gives you <strong className="font-semibold">5(3x² + 1)&#8308;</strong>.
              Now the chain rule says multiply by the derivative of the <em>inside</em>. So: what&apos;s d/dx of (3x² + 1)
              on its own? Work that out and combine the two — then tell me your final answer.
            </TutorBubble>
          </>
        )}
      </div>

      {/* input */}
      <div className="px-1 pt-2 pb-5 shrink-0">
        <div className="flex gap-2 mb-2.5">
          <button
            type="button"
            onClick={onRevealStuck}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-500 hover:text-gray-500 rounded-full px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors"
          >
            💡 Give me a hint
          </button>
          <button
            type="button"
            onClick={onRevealStuck}
            className="bg-white border border-gray-200 hover:border-gray-500 hover:text-gray-500 rounded-full px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors"
          >
            I&apos;m still stuck
          </button>
          <button
            type="button"
            className="bg-white border border-gray-200 hover:border-gray-500 hover:text-gray-500 rounded-full px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors"
          >
            Show a worked example
          </button>
        </div>
        <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-[13px] pl-4 pr-1.5 py-1.5 shadow-[0_6px_18px_-14px_rgba(17,24,39,.5)]">
          <input
            placeholder="Reply to Saoirse, or type your answer…"
            className="flex-1 border-none bg-transparent outline-none text-[14.5px] text-gray-700 py-2.5"
          />
          <button
            type="button"
            className="w-[38px] h-[38px] rounded-[10px] bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shrink-0 transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="text-center text-[11.5px] text-gray-400 mt-2">
          Saoirse guides you to the answer — she won&apos;t just give it away.
        </div>
      </div>
    </div>
  );
}

function TutorBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 max-w-[88%]">
      <div className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-sm shrink-0">
        S
      </div>
      <div className="bg-gray-100 rounded-tl-sm rounded-tr-2xl rounded-b-2xl px-4 py-[13px] text-[14.5px] leading-relaxed text-gray-900">
        {children}
      </div>
    </div>
  );
}

function StudentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="bg-emerald-500 text-white rounded-tl-2xl rounded-tr-sm rounded-b-2xl px-[15px] py-[11px] text-[14.5px] leading-relaxed max-w-[80%]">
        {children}
      </div>
    </div>
  );
}

function QuickQuestion({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-tl-2xl rounded-tr-sm rounded-b-2xl px-3.5 py-2.5 text-[13.5px] leading-snug max-w-[74%]">
        {children}
      </div>
    </div>
  );
}

function QuickFactBubble() {
  return (
    <div className="flex gap-2.5 max-w-[88%]">
      <div className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-sm shrink-0">
        S
      </div>
      <div className="bg-emerald-50 border border-emerald-100 border-l-[3px] border-l-emerald-500 rounded-tl-sm rounded-tr-xl rounded-b-xl px-[15px] py-3 max-w-full">
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.05em] text-emerald-600 mb-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v18M3 12h18" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Quick fact
        </div>
        <div className="font-heading text-lg text-gray-900 mb-1.5">d/dx (u&#8319;) = n&middot;u&#8319;&#8315;&sup1;</div>
        <p className="m-0 text-[13px] leading-relaxed text-gray-500">
          That&apos;s the power rule — and that part I&apos;ll just <em>tell</em> you, because it&apos;s a fact to recall, not
          something to puzzle out.
        </p>
      </div>
    </div>
  );
}

function PastPaperCard() {
  return (
    <div className="ml-[41px] mt-0.5 mb-0.5 shrink-0 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-[0_10px_30px_-24px_rgba(17,24,39,.6)]">
      <div className="flex items-center gap-2 px-[15px] py-[9px] bg-gray-100 border-b border-gray-200">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 3h8l4 4v14H6z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.04em] text-gray-500">Past paper</span>
        <span className="text-xs text-gray-400">Leaving Cert 2022 · Higher Level · Paper 1 · Q6 (b)</span>
        <div className="flex-1" />
        <span className="text-[11.5px] font-semibold text-gray-500 bg-white border border-gray-200 px-[9px] py-0.5 rounded-full">
          25 marks
        </span>
      </div>
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-[repeating-linear-gradient(180deg,#E5E7EB,#E5E7EB_6px,transparent_6px,transparent_12px)]" />
        <div className="flex-1 px-5 py-[18px]">
          <p className="m-0 mb-3.5 text-[13.5px] text-gray-500">
            Differentiate the following with respect to <em>x</em>, giving your answer in its simplest form:
          </p>
          <div className="font-heading text-2xl text-gray-900 text-center py-1.5">y = (3x² + 1)⁵</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="#6B7280" strokeWidth="1.6" />
          <path d="M12 8v5l3 2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Pulled from your November mock — you scored <strong className="text-gray-500">&nbsp;0 / 25</strong>&nbsp; here. Let&apos;s
        fix it for good.
      </div>
    </div>
  );
}
