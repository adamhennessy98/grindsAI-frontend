"use client";
import { useEffect, useState } from "react";

export function LoadingWaitNote() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setSlow(true), 20_000); return () => window.clearTimeout(timer); }, []);
  return slow ? <p role="status" className="mt-3 text-sm text-gray-600 dark:text-slate-300">Still working on it. This is taking a little longer than usual; your settings are kept.</p> : null;
}
