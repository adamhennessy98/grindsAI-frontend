import Link from "next/link";
import { CookiePreferencesButton } from "@/components/analytics-consent";
import { LogoIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t border-cyan-100 bg-[#eef4f2] py-8">
      <div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-gray-500">
          <LogoIcon size={22} />
          <span>Copyright 2026 GrindsAI / Made in Dublin</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-500">
          <Link href="/#how" className="transition-colors hover:text-gray-900">How it works</Link>
          <Link href="/#pricing" className="transition-colors hover:text-gray-900">Pricing</Link>
          <Link href="/#faq" className="transition-colors hover:text-gray-900">FAQ</Link>
          <Link href="/privacy" className="transition-colors hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-gray-900">
            Terms
          </Link>
          <a href="mailto:hello@grindsai.ie" className="transition-colors hover:text-gray-900">
            Contact
          </a>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  );
}
