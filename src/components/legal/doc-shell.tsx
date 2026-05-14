import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export function LegalDocShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[720px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-900">
            <LogoIcon size={24} />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">GrindsAI</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-[720px] mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] m-0">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated {updated}</p>
        <div className="mt-10 max-w-none text-[15px] leading-relaxed text-gray-700 space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
          {children}
        </div>
      </main>
    </div>
  );
}
