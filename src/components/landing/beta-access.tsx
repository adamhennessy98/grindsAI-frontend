import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { BETA_FEEDBACK_EMAIL } from "@/lib/beta";
import { SectionHeader } from "./how-it-works";

const INCLUDED = [
  "Socratic tutoring chat for LC subjects we support today",
  "Higher & Ordinary Level where available",
  "Past paper context where indexed",
  "Saved chat history on your account",
  "Works on phone, tablet & laptop",
];

const EXPECT = [
  "Some topics and subjects are still being added",
  "Answers can be wrong — always check against your textbook or teacher",
  "Features and layout may change week to week",
];

export function BetaAccessCard() {
  return (
    <div
      className="w-full max-w-[480px] bg-white border border-gray-200 rounded-[18px] p-7"
      style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.08)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-[-0.01em] m-0">Leaving Cert beta</h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200 shrink-0">
          Free access
        </span>
      </div>
      <div className="mt-[18px] flex items-baseline gap-1.5">
        <span className="text-[48px] font-semibold tracking-[-0.04em]">EUR0</span>
        <span className="text-gray-500 text-[15px]">while in beta</span>
      </div>
      <p className="text-gray-500 text-[13.5px] mt-1 mb-0 leading-relaxed">
        For current Leaving Cert students only. No card, no subscription — we want your honest feedback before we launch
        properly.
      </p>
      <Link
        href="/signup"
        className="mt-5 flex items-center justify-center h-12 w-full rounded-[10px] text-[15px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)]"
      >
        Create a free beta account
      </Link>
      <p className="mt-4 mb-0 text-[13px] text-gray-500 text-center">
        Questions or bugs?{" "}
        <a href={`mailto:${BETA_FEEDBACK_EMAIL}`} className="text-emerald-700 font-medium hover:underline">
          {BETA_FEEDBACK_EMAIL}
        </a>
      </p>
      <ul className="list-none p-0 mt-6 flex flex-col gap-2.5 m-0">
        {INCLUDED.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
            <span className="text-emerald-500 mt-0.5 shrink-0">
              <CheckIcon size={16} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-5 border-t border-[#eef0f3]">
        <p className="m-0 text-xs font-medium text-gray-700 uppercase tracking-[0.05em]">What to expect in beta</p>
        <ul className="list-none p-0 mt-3 flex flex-col gap-2 m-0">
          {EXPECT.map((item) => (
            <li key={item} className="text-[13px] text-gray-500 leading-relaxed pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-amber-600">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BetaAccessTeaser() {
  return (
    <section id="beta" className="py-24 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader
          eyebrow="Beta access"
          title="Free for Leaving Cert students — for now."
          subtitle="We're building in the open with real 5th and 6th years. Use it, break it, tell us what would actually help you study."
        />
        <div className="mt-10 grid place-items-center">
          <BetaAccessCard />
        </div>
        <div className="mt-12 max-w-[640px] mx-auto">
          <BetaFaqInline />
        </div>
      </div>
    </section>
  );
}

function BetaFaqInline() {
  const items = [
    {
      q: "Who can join?",
      a: "Current Leaving Cert students (5th or 6th year). We may ask for feedback by email — that's how we improve before launch.",
    },
    {
      q: "Will I be charged later?",
      a: "Not during beta. If we introduce paid plans after launch, we'll be upfront about it — nothing will charge your card in this preview.",
    },
    {
      q: "Can I trust the answers?",
      a: "Treat it like a study buddy, not an examiner. Always verify important steps with your textbook, class notes, or teacher.",
    },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <h3 className="m-0 text-[15px] font-semibold text-gray-900 text-center">Beta FAQ</h3>
      <dl className="mt-4 flex flex-col gap-4 m-0">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-medium text-gray-900">{item.q}</dt>
            <dd className="mt-1 mb-0 text-sm text-gray-500 leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
