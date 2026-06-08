import { Suspense } from "react";
import { OnboardingPageClient } from "./onboarding-client";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-gray-50 text-gray-500 text-sm">Loading...</div>
      }
    >
      <OnboardingPageClient />
    </Suspense>
  );
}
