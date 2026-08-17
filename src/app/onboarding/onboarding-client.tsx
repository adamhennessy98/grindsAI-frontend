"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { safeNextPath } from "@/lib/site-url";

export function OnboardingPageClient() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const nextPath = safeNextPath(searchParams.get("next"));

  return <OnboardingFlow editMode={editMode} nextPath={nextPath === "/onboarding" ? "/chat" : nextPath} />;
}
