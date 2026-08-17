import { CheckIcon } from "@/components/icons";
import { SubscribeButton } from "@/components/pricing/subscribe-button";
import { BILLING_PLAN_LIST } from "@/lib/billing-plans";
import { SectionHeader } from "./how-it-works";

const sharedFeatures = [
  "Unlimited guided Tutor sessions",
  "Topic Checks, Exam Questions and past-paper practice",
  "Progress and results for every included subject",
  "Cancel any time, no contract",
];

const planPresentation = {
  individual: { tone: "cyan", note: "Four subjects cost the same as the seven-subject plan." },
  seven: { tone: "lime", badge: "Best for most students" },
  unlimited: { tone: "violet" },
} as const;

const tones = {
  cyan: { border: "border-cyan-200 border-t-cyan-500", tick: "text-cyan-600", badge: "border-cyan-200 bg-cyan-50 text-cyan-800" },
  lime: { border: "border-lime-200 border-t-lime-500", tick: "text-lime-600", badge: "border-lime-200 bg-lime-50 text-lime-800" },
  violet: { border: "border-violet-200 border-t-violet-500", tick: "text-violet-600", badge: "border-violet-200 bg-violet-50 text-violet-800" },
} as const;

export function PricingOptions() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3 lg:items-stretch">
      {BILLING_PLAN_LIST.map((plan) => {
        const presentation = planPresentation[plan.id];
        const tone = tones[presentation.tone];
        return (
          <article key={plan.id} className={`flex h-full flex-col border border-t-[3px] bg-[#fbfaf6] p-6 sm:p-7 ${tone.border}`} style={{ boxShadow: "0 16px 34px -32px rgba(15,23,42,0.42)" }}>
            <div className="flex min-h-7 items-start justify-between gap-3">
              <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-gray-950">{plan.name}</h3>
              {"badge" in presentation && <span className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-semibold ${tone.badge}`}>{presentation.badge}</span>}
            </div>
            <div className="mt-5 flex items-baseline gap-1.5"><span className="text-[42px] font-semibold tracking-[-0.04em] text-gray-950">{plan.priceLabel}</span><span className="text-[14px] text-gray-500">/ month</span></div>
            <p className="m-0 mt-2 min-h-[64px] text-[13.5px] leading-relaxed text-gray-600">{plan.detail}</p>
            <SubscribeButton planId={plan.id} label={plan.cta} />
            <ul className="m-0 mt-6 list-none space-y-2.5 p-0">
              {sharedFeatures.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-gray-700"><span className={`mt-0.5 shrink-0 ${tone.tick}`}><CheckIcon size={16} /></span>{feature}</li>)}
            </ul>
            {"note" in presentation && <p className="mb-0 mt-auto border-t border-gray-200 pt-4 text-[11.5px] leading-relaxed text-gray-500">{presentation.note}</p>}
          </article>
        );
      })}
    </div>
  );
}

export function PricingTeaser() {
  return (
    <section id="pricing" className="bg-[#f4f8f6] py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeader eyebrow="Pricing" title="Choose the subjects you need." subtitle="Start with one subject, or keep every part of your Leaving Cert study life in one place. Every plan includes the same subject-aware support and you can cancel any time." />
        <div className="mt-10"><PricingOptions /></div>
      </div>
    </section>
  );
}
