import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export function Footer() {
  return <footer className="border-t border-gray-200 bg-white py-8"><div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-4 px-6"><div className="flex items-center gap-2.5 text-[13px] text-gray-500"><LogoIcon size={20} /><span>Copyright 2026 GrindsAI / Made in Dublin</span></div><div className="flex gap-6 text-[13px] text-gray-500"><Link href="/privacy" className="transition-colors hover:text-gray-900">Privacy</Link><Link href="/terms" className="transition-colors hover:text-gray-900">Terms</Link><a href="mailto:hello@grindsai.ie" className="transition-colors hover:text-gray-900">Contact</a></div></div></footer>;
}
