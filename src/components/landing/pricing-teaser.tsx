import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SectionHeader } from "./how-it-works";

const sharedFeatures = [
  "Unlimited guided Tutor sessions",
  "Topic Checks, Exam Questions and past-paper practice",
  "Progress and results for every included subject",
  "Cancel any time, no contract",
];

const plans = [
  {
    name: "Individual subjects",
    price: "€10",
    detail: "Your first subject is €10/month. Add any further subjects for €5/month each.",
    cta: "Choose subjects",
    tone: "cyan",
    note: "Four subjects cost the same as the seven-subject plan.",
  },
  {
    name: "Up to 7 subjects",
    price: "€25",
    detail: "One monthly price for up to seven Leaving Cert subjects.",
    cta: "Choose this plan",
    tone: "lime",
    badge: "Best for most students",
  },
  {
    name: "Unlimited subjects",
    price: "€30",
    detail: "Every subject you study, with room to add more when you need to.",
    cta: "Go unlimited",
    tone: "violet",
  },
] as const;

const tones = {
  cyan: { border: "border-cyan-200 border-t-cyan-500", label: "text-cyan-800", button: "bg-cyan-600 hover:bg-cyan-700", tick: "text-cyan-600", badge: "border-cyan-200 bg-cyan-50 text-cyan-800" },
  lime: { border: "border-lime-200 border-t-lime-500", label: "text-lime-800", button: "bg-lime-600 hover:bg-lime-700", tick: "text-lime-600", badge: "border-lime-200 bg-lime-50 text-lime-800" },
  violet: { border: "border-violet-200 border-t-violet-500", label: "text-violet-800", button: "bg-violet-600 hover:bg-violet-700", tick: "text-violet-600", badge: "border-violet-200 bg-violet-50 text-violet-800" },
} as const;

export function PricingOptions() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3 lg:items-stretch">
      {plans.map((plan) => {
        const tone = tones[plan.tone];
        return (
          <article key={plan.name} className={`flex h-full flex-col border border-t-[3px] bg-[#fbfaf6] p-6 sm:p-7 ${tone.border}`} style={{ boxShadow: "0 16px 34px -32px rgba(15,23,42,0.42)" }}>
            <div className="flex min-h-7 items-start justify-between gap-3">
              <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-gray-950">{plan.name}</h3>
              {plan.badge && <span className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-semibold ${tone.badge}`}>{plan.badge}</span>}
            </div>
            <div className="mt-5 flex items-baseline gap-1.5"><span className="text-[42px] font-semibold tracking-[-0.04em] text-gray-950">{plan.price}</span><span className="text-[14px] text-gray-500">/ month</span></div>
            <p className="m-0 mt-2 min-h-[64px] text-[13.5px] leading-relaxed text-gray-600">{plan.detail}</p>
            <Link href="/signup" className={`mt-5 flex h-11 w-full items-center justify-center rounded-lg px-4 text-[14px] font-semibold text-white transition-colors ${tone.button}`}>{plan.cta}</Link>
            <ul className="m-0 mt-6 list-none space-y-2.5 p-0">
              {sharedFeatures.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-gray-700"><span className={`mt-0.5 shrink-0 ${tone.tick}`}><CheckIcon size={16} /></span>{feature}</li>)}
            </ul>
            {plan.note && <p className="mb-0 mt-auto border-t border-gray-200 pt-4 text-[11.5px] leading-relaxed text-gray-500">{plan.note}</p>}
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
