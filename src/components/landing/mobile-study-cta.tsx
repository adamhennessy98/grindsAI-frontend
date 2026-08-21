import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function MobileStudyCta() {
  return <div className="pointer-events-none fixed inset-x-3 bottom-3 z-40 md:hidden"><Link href="/signup" className="pointer-events-auto flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 text-[14px] font-semibold text-white shadow-[0_18px_34px_-20px_rgba(8,145,178,.7)] transition-colors hover:bg-cyan-700">Start studying <ArrowRightIcon size={16} /></Link></div>;
}
