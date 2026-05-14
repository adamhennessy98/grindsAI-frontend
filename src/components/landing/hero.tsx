import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

function HeroPreview() {
  return (
    <div className="mt-14 animate-fade-up-4">
      <div
        className="max-w-[880px] mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden text-left"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 24px 48px -24px rgba(17,24,39,0.18)" }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="w-2.5 h-2.5 rounded-full bg-gray-200" />)}
          </div>
          <span className="ml-3 text-xs text-gray-400 font-mono">grindsai.ie/chat — Maths · Higher Level</span>
        </div>
        <div className="p-7 flex flex-col gap-3.5">
          <UserBubble>Why does a² + b² = c² actually work?</UserBubble>
          <AIBubble>
            Great question — let&apos;s build the intuition rather than memorise it. If you draw a right-angled triangle and build a square on <em>each</em> side, what do you notice about the area of the square on the hypotenuse compared to the other two?
          </AIBubble>
          <UserBubble>It&apos;s the same as the other two added together?</UserBubble>
          <AIBubble>
            Exactly. Now — can you think of <span className="font-medium text-gray-900">why</span> that has to be true, not just that it is?
          </AIBubble>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="bg-emerald-500 text-white px-3.5 py-2.5 rounded-[16px_16px_4px_16px] max-w-[78%] text-[14.5px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function AIBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center font-semibold text-[13px] border border-emerald-100 shrink-0">
        G
      </div>
      <div className="bg-gray-100 text-gray-900 px-3.5 py-2.5 rounded-[4px_16px_16px_16px] max-w-[78%] text-[14.5px] leading-[1.55]">
        {children}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="dotgrid fade-mask absolute inset-0 pointer-events-none" />
      <div className="relative max-w-[1140px] mx-auto px-6 pt-[88px] pb-16 text-center">
        <div className="animate-fade-up inline-flex">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Built for the Irish Leaving Cert
          </span>
        </div>

        <h1 className="font-heading animate-fade-up-1 text-[clamp(40px,6vw,72px)] font-semibold tracking-[-0.035em] leading-[1.02] mt-6 mb-5">
          Your personal<br />LC tutor.
        </h1>

        <p className="animate-fade-up-2 text-[clamp(16px,2vw,19px)] text-gray-500 max-w-[560px] mx-auto mb-9 leading-relaxed">
          One grinds session costs <span className="text-gray-700 font-medium">€40 an hour</span>. GrindsAI is a Socratic tutor that helps you understand — not just copy answers — for less than a tank of fuel a month.
        </p>

        <div className="animate-fade-up-3 flex gap-3 justify-center flex-wrap">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-12 px-[22px] rounded-[10px] text-[15px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)]"
          >
            Start for free <ArrowRightIcon size={16} />
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center h-12 px-[22px] rounded-[10px] text-[15px] font-medium border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            See it in action
          </Link>
        </div>

        <p className="animate-fade-up-4 mt-[18px] text-xs text-gray-400 font-mono">
          No card required · 7-day free trial
        </p>

        <HeroPreview />
      </div>
    </section>
  );
}
