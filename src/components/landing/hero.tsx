import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

function HeroPreview() {
  return (
    <div className="mt-14 animate-fade-up-4">
      <div
        className="mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-cyan-100 bg-[#fbfaf6] text-left"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 28px 58px -28px rgba(8,145,178,0.26)" }}
      >
        <div className="flex items-center gap-2 border-b border-cyan-100 bg-cyan-50/60 px-4 py-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
            ))}
          </div>
          <span className="ml-3 font-mono text-xs text-gray-500">Maths / Higher Level / General Maths</span>
        </div>
        <div className="flex flex-col gap-3.5 p-7">
          <UserBubble>Why does a^2 + b^2 = c^2 actually work?</UserBubble>
          <AIBubble>
            Great question. Let&apos;s build the intuition rather than memorise it. If you draw a right-angled triangle
            and build a square on <em>each</em> side, what do you notice about the area of the square on the hypotenuse?
          </AIBubble>
          <UserBubble>It&apos;s the same as the other two added together?</UserBubble>
          <AIBubble>
            Exactly. Now can you explain why that has to be true, not just that it is?
          </AIBubble>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-[16px_16px_4px_16px] bg-cyan-500 px-3.5 py-2.5 text-[14.5px] leading-relaxed text-white">
        {children}
      </div>
    </div>
  );
}

function AIBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-cyan-100 bg-cyan-50 text-[12px] font-semibold text-cyan-700">
        AI
      </div>
      <div className="max-w-[78%] rounded-[4px_16px_16px_16px] bg-[#eef4f2] px-3.5 py-2.5 text-[14.5px] leading-[1.55] text-gray-900">
        {children}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="dotgrid fade-mask pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1140px] px-6 pb-16 pt-[88px] text-center">
        <div className="animate-fade-up inline-flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-800">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            Built for Leaving Cert students
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-800">
            Tutor, practice, tracker, progress
          </span>
        </div>

        <h1 className="font-heading animate-fade-up-1 mb-5 mt-6 text-[clamp(40px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]">
          Your personal<br />
          Leaving Cert tutor.
        </h1>

        <p className="animate-fade-up-2 mx-auto mb-9 max-w-[610px] text-[clamp(16px,2vw,19px)] leading-relaxed text-gray-500">
          GrindsAI gives each subject a tutor workspace: ask questions, practise exam-style prompts, track tests, and see
          what to work on next. It guides you step by step instead of just handing over answers.
        </p>

        <div className="animate-fade-up-3 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[linear-gradient(135deg,#06b6d4,#84cc16)] px-[22px] text-[15px] font-medium text-white shadow-[0_18px_36px_-22px_rgba(6,182,212,.95)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105"
          >
            Start studying <ArrowRightIcon size={16} />
          </Link>
          <Link
            href="/chat"
            className="inline-flex h-12 items-center rounded-[10px] border border-cyan-100 bg-[#fbfaf6] px-[22px] text-[15px] font-medium transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
          >
            See the tutor
          </Link>
        </div>

        <p className="animate-fade-up-4 mt-[18px] font-mono text-xs text-gray-400">
          Already have an account? Sign in from the top right.
        </p>

        <HeroPreview />
      </div>
    </section>
  );
}
