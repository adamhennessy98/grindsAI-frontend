"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Keep diagnostics out of the student-facing UI. Connect an error service here before launch.
    console.error("[app-error]", error);
  }, [error]);

  return <main className="grid min-h-screen place-items-center bg-[#eef4f1] px-5 text-center text-slate-900 dark:bg-slate-950 dark:text-white"><section className="max-w-[440px]"><p className="m-0 text-[12px] font-semibold uppercase tracking-[.1em] text-cyan-700 dark:text-cyan-300">GrindsAI</p><h1 className="font-heading m-0 mt-2 text-3xl font-semibold tracking-[-.03em]">Something did not load properly.</h1><p className="m-0 mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Your work has not been changed. Try again, or return to your study workspace.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={unstable_retry} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Try again</button><a href="/chat" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-500 dark:border-slate-700 dark:text-white">Study workspace</a></div></section></main>;
}
