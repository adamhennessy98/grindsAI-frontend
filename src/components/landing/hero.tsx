import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

function HeroPreview() {
  return (
    <div className="mt-12 animate-fade-up-4 text-left sm:mt-14">
      <div
        className="mx-auto max-w-[1000px] overflow-hidden rounded-[20px] border border-cyan-100 bg-[#fbfaf6]"
        style={{ boxShadow: "0 2px 4px rgba(17,24,39,.04), 0 32px 72px -34px rgba(8,145,178,.32)" }}
      >
        <div className="flex items-center justify-between border-b border-cyan-100 bg-cyan-50/55 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex shrink-0 gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((index) => <span key={index} className="h-2.5 w-2.5 rounded-full bg-cyan-200" />)}
            </div>
            <span className="truncate font-mono text-[11px] text-gray-500 sm:text-xs">grindsai.ie / Maths / Higher Level</span>
          </div>
          <span className="ml-3 shrink-0 rounded-full border border-cyan-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-cyan-800 sm:text-[11px]">Your study workspace</span>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[.9fr_1.35fr]">
          <aside className="rounded-2xl border border-gray-100 bg-[#f5f8f6] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[.08em] text-cyan-700">Current focus</div>
            <h2 className="font-heading m-0 mt-1.5 text-[19px] font-semibold tracking-[-.02em] text-gray-900">Probability</h2>
            <p className="m-0 mt-1 text-[12.5px] leading-relaxed text-gray-500">Build confidence with conditional probability.</p>
            <div className="mt-4 space-y-2">
              <PreviewItem label="Talk it through" detail="Tutor" accent="cyan" />
              <PreviewItem label="Check the foundations" detail="Topic Check" accent="amber" active />
              <PreviewItem label="Practise exam-style" detail="Exam Questions" accent="lime" />
            </div>
          </aside>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/55 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[.08em] text-amber-700">Topic Check</div>
                <h2 className="font-heading m-0 mt-1 text-[18px] font-semibold tracking-[-.015em] text-gray-900">Question 3 of 6</h2>
              </div>
              <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-800">Foundations first</span>
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-gray-900">A bag contains 4 red and 6 blue counters. Two counters are chosen without replacement. What is the probability that both are red?</p>
            <div className="rounded-xl border border-amber-100 bg-white/90 p-3 text-[12.5px] text-gray-500">Write your working here...</div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4">
              <span className="text-[12px] text-gray-500">Tutor support is there when you need it.</span>
              <span className="rounded-xl bg-amber-500 px-3 py-2 text-[12px] font-semibold text-white">Next question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, detail, accent, active = false }: { label: string; detail: string; accent: "cyan" | "amber" | "lime"; active?: boolean }) {
  const tone = {
    cyan: "border-cyan-100 bg-cyan-50/70 text-cyan-800",
    amber: "border-amber-200 bg-amber-100/75 text-amber-900",
    lime: "border-lime-100 bg-lime-50/70 text-lime-800",
  }[accent];
  return <div className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${tone} ${active ? "shadow-[0_10px_20px_-18px_rgba(217,119,6,.75)]" : "opacity-80"}`}><div className="min-w-0"><div className="truncate text-[12px] font-semibold">{label}</div><div className="mt-0.5 text-[10.5px] opacity-75">{detail}</div></div>{active && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />}</div>;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="dotgrid fade-mask pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1140px] px-6 pb-16 pt-[82px] text-center sm:pb-20 sm:pt-[98px]">
        <div className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          Built for the Irish Leaving Cert
        </div>

        <h1 className="font-heading animate-fade-up-1 mx-auto mb-5 mt-6 max-w-[850px] text-[clamp(42px,6vw,74px)] font-semibold leading-[1.01] tracking-[-.04em] text-gray-950">
          Study with a tutor that knows your course.<br className="hidden md:block" /> And gets to know you.
        </h1>

        <p className="animate-fade-up-2 mx-auto mb-8 max-w-[680px] text-[clamp(16px,2vw,19px)] leading-relaxed text-gray-600">
          Built around the Leaving Cert curriculum, subject specifications, past papers and marking schemes. GrindsAI then learns what you know, what feels difficult, and what to work on next.
        </p>

        <div className="animate-fade-up-3 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[linear-gradient(135deg,#06b6d4,#84cc16)] px-[22px] text-[15px] font-semibold text-white shadow-[0_18px_36px_-22px_rgba(6,182,212,.95)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105">
            Create your study workspace <ArrowRightIcon size={16} />
          </Link>
          <a href="#how" className="inline-flex h-12 items-center rounded-[10px] border border-cyan-100 bg-[#fbfaf6] px-[22px] text-[15px] font-semibold text-gray-800 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800">
            See how it works
          </a>
        </div>

        <div className="animate-fade-up-4 mx-auto mt-6 flex max-w-[760px] flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] font-medium text-gray-500">
          <TrustPoint>Built around your actual course</TrustPoint>
          <TrustPoint>Teacher-informed</TrustPoint>
          <TrustPoint>Ready when you are stuck</TrustPoint>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5"><span className="text-cyan-600"><CheckIcon size={14} /></span>{children}</span>;
}
