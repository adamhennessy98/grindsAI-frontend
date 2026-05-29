import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { PricingCard } from "@/components/landing/pricing-teaser";
import { FAQ } from "@/components/pricing/faq";
import { IS_BETA } from "@/lib/beta";

const rows = [
  ["", "Private grinds", "GrindsAI"],
  ["Hourly cost", "EUR40-50", "EUR0.46"],
  ["Available 24/7", "No", "Yes"],
  ["Curriculum-aligned", "Sometimes", "Always"],
  ["Travels with you", "No", "Yes"],
  ["Cancellable any time", "No", "Yes"],
];

function Comparison() {
  return (
    <section className="mt-16 w-full max-w-[720px]">
      <h2 className="font-heading text-[18px] font-semibold text-center mb-[18px] tracking-[-0.01em]">Side by side</h2>
      <div
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 1px 1px rgba(17,24,39,0.03)" }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            className={[
              "grid px-5 py-3.5 text-sm",
              i < rows.length - 1 ? "border-b border-[#eef0f3]" : "",
              i === 0 ? "bg-gray-50 font-medium text-gray-500" : "bg-white text-gray-900",
            ].join(" ")}
            style={{ gridTemplateColumns: "1.4fr 1fr 1fr" }}
          >
            <div>{r[0]}</div>
            <div className="text-gray-500">{r[1]}</div>
            <div className={i === 0 ? "text-gray-500" : "text-emerald-700 font-medium"}>{r[2]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PricingPage() {
  if (IS_BETA) {
    redirect("/#beta");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={26} />
            <span className="font-heading text-[16.5px] font-semibold tracking-[-0.01em]">GrindsAI</span>
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Back to app
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-16 pb-20 bg-gray-50">
        <div className="max-w-[1140px] mx-auto flex flex-col items-center">
          <div className="animate-fade-up text-center max-w-[600px]">
            <div className="text-xs text-emerald-700 uppercase tracking-[0.08em] font-mono mb-3">Pricing</div>
            <h1 className="font-heading text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] m-0 leading-[1.05]">
              Less than 30 minutes<br /> of a real grind.
            </h1>
            <p className="mt-[18px] text-gray-500 text-[17px] leading-relaxed">
              One real grinds session costs{" "}
              <span className="text-gray-700 font-medium">EUR40-50</span>. This is your tutor for the whole year.
            </p>
          </div>

          <div className="animate-fade-up-2 mt-10">
            <PricingCard checkoutCta />
          </div>

          <Comparison />
          <FAQ />
        </div>
      </main>
    </div>
  );
}
