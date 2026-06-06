"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export function OnboardingPageClient() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";

  return <OnboardingFlow editMode={editMode} />;
}
