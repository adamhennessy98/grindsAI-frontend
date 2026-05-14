import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SectionHeader } from "./how-it-works";

const FEATURES = [
  "Unlimited Socratic tutoring sessions",
  "All LC subjects — Higher & Ordinary",
  "Past paper walkthroughs (2010 → 2025)",
  "Saved chat history & notes",
  "Mobile, tablet & desktop",
  "Cancel any time, no contract",
];

export function PricingCard({ compact }: { compact?: boolean }) {
  return (
    <div
      className="w-full max-w-[440px] bg-white border border-gray-200 rounded-[18px] p-7"
      style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-[-0.01em] m-0">Student</h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
          Most popular
        </span>
      </div>
      <div className="mt-[18px] flex items-baseline gap-1.5">
        <span className="text-[48px] font-semibold tracking-[-0.04em]">€14</span>
        <span className="text-gray-500 text-[15px]">/ month</span>
      </div>
      <p className="text-gray-500 text-[13.5px] mt-1 mb-0">Or €120/year — cancel any time.</p>
      <Link
        href="/signup"
        className="mt-5 flex items-center justify-center h-12 w-full rounded-[10px] text-[15px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)]"
      >
        Start 7-day free trial
      </Link>
      <ul className="list-none p-0 mt-6 flex flex-col gap-2.5 m-0">
        {FEATURES.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
            <span className="text-emerald-500 mt-0.5 shrink-0"><CheckIcon size={16} /></span>
            {item}
          </li>
        ))}
      </ul>
      {!compact && (
        <p className="mt-5 text-[11.5px] text-gray-400 font-mono text-center pt-4 border-t border-[#eef0f3] mb-0">
          €14 · less than 30 mins of a real grind
        </p>
      )}
    </div>
  );
}

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader
          eyebrow="Pricing"
          title="One price. No upsells."
          subtitle="A single private grinds session in Dublin costs €40–50. This is your tutor for an entire term."
        />
        <div className="mt-10 grid place-items-center">
          <PricingCard />
        </div>
      </div>
    </section>
  );
}
