import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center justify-center px-6 py-16 text-center">
      <Link href="/" className="flex items-center gap-2.5 mb-10 text-gray-900">
        <LogoIcon size={32} />
        <span className="text-[18px] font-semibold tracking-[-0.01em]">GrindsAI</span>
      </Link>
      <p className="text-xs text-emerald-700 uppercase tracking-[0.08em] font-mono mb-3">404</p>
      <h1 className="text-2xl font-semibold tracking-[-0.02em] m-0">Page not found</h1>
      <p className="mt-3 text-gray-500 max-w-md">
        That link may be out of date, or the page may have moved. Head back to the homepage or open the app.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/chat"
          className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Open app
        </Link>
      </div>
    </div>
  );
}
