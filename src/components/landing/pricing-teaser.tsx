import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SubscribeButton } from "@/components/pricing/subscribe-button";
import { SectionHeader } from "./how-it-works";

const FEATURES = [
  "Unlimited Socratic tutoring sessions",
  "All LC subjects - Higher & Ordinary",
  "Practice question generator",
  "Exam tracker and progress views",
  "Mobile, tablet & desktop",
  "Cancel any time, no contract",
];

export function PricingCard({ compact, checkoutCta }: { compact?: boolean; checkoutCta?: boolean }) {
  return (
    <div
      className="w-full max-w-[440px] bg-[#fbfaf6] border border-cyan-100 rounded-[18px] p-7"
      style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 18px 44px -30px rgba(8,145,178,0.42)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-[-0.01em] m-0">Student</h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-medium border border-cyan-100">
          Student plan
        </span>
      </div>
      <div className="mt-[18px] flex items-baseline gap-1.5">
        <span className="text-[48px] font-semibold tracking-[-0.04em]">EUR14</span>
        <span className="text-gray-500 text-[15px]">/ month</span>
      </div>
      <p className="text-gray-500 text-[13.5px] mt-1 mb-0">Or EUR120/year - cancel any time.</p>
      {checkoutCta ? (
        <SubscribeButton label="Subscribe with Stripe" />
      ) : (
        <Link
          href="/signup"
          className="mt-5 flex items-center justify-center h-12 w-full rounded-[10px] text-[15px] font-medium text-white bg-[linear-gradient(135deg,#06b6d4,#84cc16)] hover:brightness-105 transition-[filter,transform] hover:-translate-y-0.5 shadow-[0_16px_34px_-22px_rgba(6,182,212,.9)]"
        >
          Create account
        </Link>
      )}
      <ul className="list-none p-0 mt-6 flex flex-col gap-2.5 m-0">
        {FEATURES.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
            <span className="text-cyan-600 mt-0.5 shrink-0"><CheckIcon size={16} /></span>
            {item}
          </li>
        ))}
      </ul>
      {!compact && (
        <p className="mt-5 text-[11.5px] text-gray-400 font-mono text-center pt-4 border-t border-[#eef0f3] mb-0">
          EUR14 / less than 30 mins of a real grind
        </p>
      )}
    </div>
  );
}

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-24 bg-[#f4f8f6]">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader
          eyebrow="Pricing"
          title="A tutor workspace for every subject."
          subtitle="Use GrindsAI at home, on the bus, or before class. Sign in to continue, or create an account to start."
        />
        <div className="mt-10 grid place-items-center">
          <PricingCard />
        </div>
      </div>
    </section>
  );
}
