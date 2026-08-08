import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

const points = [
  "Open it when a question, concept or test is in front of you",
  "Move from foundations to exam-style practice in the same subject context",
  "Keep one useful record of what needs attention and what has improved",
];

export function SocialProof() {
  return (
    <section className="bg-[#f4f8f6] py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1140px] gap-8 rounded-[24px] border border-cyan-100 bg-[#fbfaf6] px-6 py-8 shadow-[0_28px_60px_-46px_rgba(8,145,178,.52)] sm:px-9 sm:py-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="font-mono text-xs uppercase tracking-[.08em] text-cyan-700">Built around real study moments</div>
          <h2 className="font-heading m-0 mt-3 max-w-[610px] text-[clamp(29px,4vw,42px)] font-semibold leading-[1.1] tracking-[-.03em] text-gray-950">A better way to use your study time.</h2>
          <p className="m-0 mt-4 max-w-[630px] text-[15.5px] leading-relaxed text-gray-600">Use GrindsAI when something does not click, when a class test is coming up, or when you are ready to push into exam-style practice. The more you work with it, the clearer your next useful move becomes.</p>
          <Link href="/signup" className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[linear-gradient(135deg,#06b6d4,#84cc16)] px-5 text-[14px] font-semibold text-white shadow-[0_16px_32px_-22px_rgba(6,182,212,.9)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105">Get started <ArrowRightIcon size={15} /></Link>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 sm:p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-violet-700">What that means for you</div>
          <div className="mt-4 space-y-4">{points.map((point) => <div key={point} className="flex gap-3 text-[14px] leading-relaxed text-gray-700"><span className="mt-0.5 shrink-0 text-violet-600"><CheckIcon size={16} /></span><span>{point}</span></div>)}</div>
          <div className="mt-6 border-t border-violet-100 pt-4 text-[12.5px] leading-relaxed text-gray-500">Created and monitored with real Irish secondary school teachers.</div>
        </div>
      </div>
    </section>
  );
}
