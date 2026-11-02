import { Suspense } from "react";
import type { Metadata } from "next";
import { ConsentConfirmClient } from "./consent-confirm-client";

export const metadata: Metadata = {
  title: "Review legal information",
  robots: { index: false, follow: false },
};

export default function ConsentConfirmPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f8f7]" />}>
      <ConsentConfirmClient />
    </Suspense>
  );
}
