import Link from "next/link";
import { SUBJECTS } from "@/lib/constants";
import { ArrowRightIcon } from "@/components/icons";

export function Subjects() {
  return <section id="subjects" className="border-y border-[#dfe7e1] bg-[#f4f8f6] py-16 sm:py-20"><div className="mx-auto max-w-[1140px] px-6"><div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><div className="text-xs font-semibold text-cyan-700">Your subjects</div><h2 className="font-heading m-0 mt-3 max-w-[520px] text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] tracking-[-.03em] text-gray-950">A separate study workspace for every subject you take.</h2></div><div><p className="m-0 max-w-[570px] text-[15px] leading-relaxed text-gray-600">Choose your Leaving Cert subjects during setup. Each one keeps its own level, topic context, practice, progress and Tutor history, so your revision stays relevant.</p><Link href="/signup" className="mt-5 inline-flex h-10 items-center gap-2 text-[13.5px] font-semibold text-cyan-700 hover:text-cyan-800">Choose your subjects <ArrowRightIcon size={15} /></Link></div></div><ul className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">{SUBJECTS.map((subject) => <li key={subject.id} className="rounded-md border border-[#d7e4df] bg-[#fbfaf6] px-3 py-2 text-[12.5px] font-medium text-gray-700">{subject.name}</li>)}</ul></div></section>;
}
