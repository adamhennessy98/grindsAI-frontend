"use client";

import { useEffect, useState } from "react";
import { BETA_FEEDBACK_EMAIL, IS_BETA } from "@/lib/beta";

const STORAGE_KEY = "grindsai-beta-banner-dismissed";

export function ChatBetaBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!IS_BETA || dismissed) return null;

  return (
    <div className="px-4 sm:px-6 py-2.5 text-sm text-amber-950 bg-amber-50 border-b border-amber-100 flex items-start sm:items-center justify-between gap-3 shrink-0">
      <span className="leading-snug">
        <strong className="font-medium">Beta preview</strong> — features and answers are still a work in progress. If
        something&apos;s off, email{" "}
        <a href={`mailto:${BETA_FEEDBACK_EMAIL}`} className="underline font-medium hover:text-amber-900">
          {BETA_FEEDBACK_EMAIL}
        </a>
        .
      </span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
        className="text-amber-900 hover:text-amber-950 text-xs font-medium shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
}
