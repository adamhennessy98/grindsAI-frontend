"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "grindsai_analytics_consent";
type Consent = "accepted" | "essential" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

export function CookiePreferencesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("grindsai:open-cookie-preferences"))} className="transition-colors hover:text-gray-900">Cookie preferences</button>;
}

export function AnalyticsConsent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<Consent>(() => typeof window === "undefined" || !measurementId ? null : readConsent());
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    if (!measurementId) return;
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener("grindsai:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("grindsai:open-cookie-preferences", openPreferences);
  }, [measurementId]);

  if (!measurementId) return null;

  const saveConsent = (nextConsent: Exclude<Consent, null>) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextConsent);
    } catch {
      // Consent still applies for this visit when browser storage is unavailable.
    }
    setConsent(nextConsent);
    setPreferencesOpen(false);
  };

  const analyticsEnabled = consent === "accepted";
  const showBanner = consent === null || preferencesOpen;

  return <>
    {analyticsEnabled && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="grindsai-google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}', { anonymize_ip: true });`}</Script>
    </>}
    {showBanner && <section role="dialog" aria-modal="true" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[620px] rounded-xl border border-gray-200 bg-[#fbfaf6] p-4 shadow-[0_22px_48px_-28px_rgba(15,23,42,.45)] sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="m-0 text-[15px] font-semibold text-gray-900">Analytics preferences</h2><p className="m-0 mt-1 max-w-[420px] text-[12.5px] leading-relaxed text-gray-600">We use optional Google Analytics to understand which public pages are useful. It stays off unless you accept. Essential account and security storage still applies.</p></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={() => saveConsent("essential")} className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-[12.5px] font-semibold text-gray-700 hover:border-gray-400">Essential only</button><button type="button" onClick={() => saveConsent("accepted")} className="h-9 rounded-lg bg-cyan-600 px-3 text-[12.5px] font-semibold text-white hover:bg-cyan-700">Accept analytics</button></div></div></section>}
  </>;
}
