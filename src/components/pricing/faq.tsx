"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

const items = [
  { q: "Can I cancel any time?", a: "Yes. Cancel from your account settings in two clicks, with no end-of-term lock-in." },
  { q: "Is this just ChatGPT in a wrapper?", a: "No. GrindsAI is built around Leaving Cert subjects, topic-aware guidance, exam practice, and a clear view of what to work on next." },
  { q: "What subjects are supported?", a: "Availability depends on your study profile. Select your subjects during setup and GrindsAI will build your workspace around them." },
  { q: "Will my school know I am using it?", a: "Your study workspace and conversations are private to your account." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="mt-16 w-full max-w-[720px]"><h2 className="font-heading mb-[18px] text-center text-[18px] font-semibold tracking-[-0.01em]">Common questions</h2><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">{items.map((item, index) => <button key={item.q} onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full flex-col gap-2 border-b border-[#eef0f3] px-5 py-4 text-left last:border-none"><span className="flex items-center justify-between gap-3"><span className="text-[15px] font-medium text-gray-900">{item.q}</span><span className="text-gray-400 transition-transform duration-[180ms]" style={{ transform: open === index ? "rotate(180deg)" : "none" }}><ChevronDownIcon size={14} /></span></span><span className="overflow-hidden text-sm leading-relaxed text-gray-500 transition-[max-height] duration-[220ms]" style={{ maxHeight: open === index ? 200 : 0 }}>{item.a}</span></button>)}</div></section>;
}
