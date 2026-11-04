import Link from "next/link";
import { BrandLogo } from "@/components/icons";

export function LegalDocShell({
  title,
  updated,
  summary,
  children,
}: {
  title: string;
  updated: string;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[720px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center" aria-label="GrindsAI home">
            <BrandLogo height={32} />
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-[760px] mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] m-0">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated {updated}</p>
        {summary ? <p className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm leading-relaxed text-slate-700">{summary}</p> : null}
        <nav aria-label="Legal pages" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-emerald-700">
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/consent" className="hover:underline">Consent and cookies</Link>
        </nav>
        <div className="mt-10 max-w-none text-[15px] leading-relaxed text-gray-700 space-y-4 [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-0 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-7 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1">
          {children}
        </div>
      </main>
    </div>
  );
}
