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
      <div className="mx-auto grid max-w-[1140px] gap-10 border-y border-[#cfe3dd] px-6 py-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="border-l-2 border-cyan-600 pl-2.5 text-xs font-semibold text-cyan-700">Built around real study moments</div>
          <h2 className="font-heading m-0 mt-4 max-w-[610px] text-[clamp(29px,4vw,42px)] font-semibold leading-[1.1] tracking-[-.03em] text-gray-950">A better way to use your study time.</h2>
          <p className="m-0 mt-4 max-w-[630px] text-[15.5px] leading-relaxed text-gray-600">Use GrindsAI when something does not click, when a class test is coming up, or when you are ready to push into exam-style practice. The more you work with it, the clearer your next useful move becomes.</p>
          <Link href="/signup" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-600 px-5 text-[14px] font-semibold text-white shadow-[0_14px_28px_-22px_rgba(8,145,178,.7)] transition-colors hover:bg-cyan-700">Get started <ArrowRightIcon size={15} /></Link>
        </div>
        <div className="border-l-2 border-violet-500 pl-5">
          <div className="text-[12px] font-semibold text-violet-700">WHAT THAT MEANS FOR YOU</div>
          <div className="mt-4 space-y-4">{points.map((point) => <div key={point} className="flex gap-3 text-[14px] leading-relaxed text-gray-700"><span className="mt-0.5 shrink-0 text-violet-600"><CheckIcon size={16} /></span><span>{point}</span></div>)}</div>
          <div className="mt-6 border-t border-gray-200 pt-4 text-[12.5px] leading-relaxed text-gray-500">Created and monitored with real Irish secondary school teachers.</div>
        </div>
      </div>
    </section>
  );
}
