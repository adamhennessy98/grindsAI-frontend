"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";

const items = [
  { q: "How much does GrindsAI cost?", a: "Your first subject is €10 per month, with additional subjects at €5 each up to four subjects. The up-to-seven-subject plan is €25 per month, or choose unlimited subjects for €30 per month." },
  { q: "Can I cancel any time?", a: "Yes. There is no end-of-term contract. You can manage or cancel your subscription through billing." },
  { q: "What subjects are supported?", a: "Currently supported: Accounting, Applied Maths, Biology, Business, Chemistry, Computer Science, Economics, English, French, Geography, German, History, Irish, Maths, Physics, Spanish and Technology. Choose the subjects you take during setup; each gets its own workspace, Tutor context, Topic Checks, exam practice and progress record." },
  { q: "How is it relevant to my Leaving Cert?", a: "GrindsAI is built around the relevant curriculum, subject specifications, level, topics, past papers and marking schemes. It is designed to keep revision close to the subject you are actually sitting." },
  { q: "Is GrindsAI made with teachers?", a: "Yes. It is developed and maintained with active Irish secondary school teachers, helping keep the experience grounded in classroom learning and Leaving Cert assessment." },
  { q: "How is my information used?", a: "Your account details and study activity help provide the service and make your subject support more relevant. Read the Privacy Policy for the full explanation." },
];

export function FAQ({ id }: { id?: string }) {
  const [open, setOpen] = useState(0);
  return <section id={id} className="mt-16 w-full max-w-[720px] scroll-mt-24"><h2 className="font-heading mb-[18px] text-center text-[18px] font-semibold tracking-[-0.01em]">Common questions</h2><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">{items.map((item, index) => <article key={item.q} className="border-b border-[#eef0f3] last:border-none"><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"><span className="text-[15px] font-medium text-gray-900">{item.q}</span><span className="text-gray-400 transition-transform duration-[180ms]" style={{ transform: open === index ? "rotate(180deg)" : "none" }}><ChevronDownIcon size={14} /></span></button><div className="overflow-hidden px-5 text-sm leading-relaxed text-gray-500 transition-[max-height,opacity,padding] duration-[220ms]" style={{ maxHeight: open === index ? 220 : 0, opacity: open === index ? 1 : 0, paddingBottom: open === index ? 16 : 0 }}>{item.q === "How is my information used?" ? <><span>{item.a.replace(" Read the Privacy Policy for the full explanation.", "")}</span> <Link href="/privacy" className="font-medium text-cyan-700 hover:underline">Read the Privacy Policy.</Link></> : item.a}</div></article>)}</div></section>;
}
