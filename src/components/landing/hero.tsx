import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

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
          Built around the Leaving Cert curriculum, subject specifications, past papers and marking schemes. It helps you understand why methods work, not just memorise procedures, then learns what you know, what feels difficult, and what to work on next.
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

      </div>
    </section>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5"><span className="text-cyan-600"><CheckIcon size={14} /></span>{children}</span>;
}
