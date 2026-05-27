"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { BETA_FEEDBACK_EMAIL, IS_BETA } from "@/lib/beta";

const launchItems = [
  { q: "Can I cancel any time?", a: "Yes. Cancel from your account settings in two clicks - no email back-and-forth, no end-of-term lock-in." },
  { q: "Is this just ChatGPT in a wrapper?", a: "No. GrindsAI is constrained to the Irish Leaving Cert syllabus and trained to teach Socratically - it deliberately won't hand you the answer." },
  { q: "What subjects are supported?", a: "Maths, Biology and Chemistry at both Higher and Ordinary Level today. Physics, English, Irish, History and Geography are arriving over the next few months." },
  { q: "Will my school know I'm using it?", a: "Only if you tell them. Your conversations are private to you." },
];

const betaItems = [
  {
    q: "Is it really free?",
    a: "Yes — while we're in beta, Leaving Cert students can use GrindsAI at no cost. We're not charging cards or running subscriptions during this preview.",
  },
  {
    q: "Why is it called beta?",
    a: "The product is still being built and tested. You might hit bugs, missing topics, or answers that need checking. We want your feedback before a full launch.",
  },
  {
    q: "Is this just ChatGPT in a wrapper?",
    a: "No. GrindsAI is focused on the Irish Leaving Cert and taught to guide you with questions — it won't always hand you the answer on purpose.",
  },
  {
    q: "How do I report a problem?",
    a: `Email us at ${BETA_FEEDBACK_EMAIL} with what you were studying and what went wrong. Screenshots help.`,
  },
];

const items = IS_BETA ? betaItems : launchItems;

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-16 w-full max-w-[720px]">
      <h2 className="font-heading text-[18px] font-semibold text-center mb-[18px] tracking-[-0.01em]">Common questions</h2>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full text-left px-5 py-4 flex flex-col gap-2 border-b border-[#eef0f3] last:border-none"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-medium text-gray-900">{it.q}</span>
              <span
                className="text-gray-400 transition-transform duration-[180ms]"
                style={{ transform: open === i ? "rotate(180deg)" : "none" }}
              >
                <ChevronDownIcon size={14} />
              </span>
            </div>
            <div
              className="text-sm leading-relaxed text-gray-500 overflow-hidden transition-[max-height] duration-[220ms]"
              style={{ maxHeight: open === i ? 200 : 0 }}
            >
              {it.a}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
