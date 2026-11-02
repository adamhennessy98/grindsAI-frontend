"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";

const CONSENT_KEY = "grindsai_analytics_consent";
type Consent = "accepted" | "essential" | null;
const CHANGE_EVENT = "grindsai:analytics-consent-changed";

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

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function setTrackingEnabled(measurementId: string | undefined, enabled: boolean) {
  if (!measurementId) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !enabled;
  window.gtag?.("consent", "update", { analytics_storage: enabled ? "granted" : "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
}

export function AnalyticsConsent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const openPreferences = () => { if (!dialog.current?.open) dialog.current?.showModal(); };
    window.addEventListener("grindsai:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("grindsai:open-cookie-preferences", openPreferences);
  }, []);

  useEffect(() => {
    setTrackingEnabled(measurementId, consent === "accepted");
    if (measurementId && consent === null && !dialog.current?.open) dialog.current?.showModal();
  }, [consent, measurementId]);

  const saveConsent = (nextConsent: Exclude<Consent, null>) => {
    setTrackingEnabled(measurementId, nextConsent === "accepted");
    try {
      window.localStorage.setItem(CONSENT_KEY, nextConsent);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Without durable browser storage, keep optional tracking disabled.
      setTrackingEnabled(measurementId, false);
    }
    dialog.current?.close();
  };

  const analyticsEnabled = Boolean(measurementId) && consent === "accepted";

  return <>
    {analyticsEnabled && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="grindsai-google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} if (localStorage.getItem('${CONSENT_KEY}') === 'accepted') { gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); gtag('js', new Date()); gtag('config', '${measurementId}', { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false }); }`}</Script>
    </>}
    <dialog ref={dialog} aria-labelledby="cookie-title" aria-describedby="cookie-description" className="fixed inset-0 m-auto w-[calc(100%-24px)] max-w-[560px] rounded-xl border border-gray-200 bg-[#fbfaf6] p-5 text-gray-900 shadow-xl backdrop:bg-slate-950/35 sm:p-6">
      <h2 id="cookie-title" className="m-0 text-lg font-semibold">Cookie preferences</h2>
      <p id="cookie-description" className="mt-3 text-sm leading-relaxed text-gray-600">{measurementId ? "Optional Google Analytics helps us understand how the website is used. It stays off unless you accept. You can change your choice here at any time." : "Only essential account, security and preference storage is currently in use. Optional analytics is not enabled."}</p>
      <p className="text-sm leading-relaxed text-gray-600">Essential storage keeps account features working. Read our <Link href="/consent" className="font-medium text-cyan-700 underline">Consent and cookies</Link> information.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {measurementId ? <>
          <button type="button" onClick={() => saveConsent("essential")} className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:border-cyan-600">Essential only</button>
          <button type="button" onClick={() => saveConsent("accepted")} className="min-h-11 rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Accept analytics</button>
        </> : <button type="button" onClick={() => dialog.current?.close()} className="min-h-11 rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Done</button>}
      </div>
    </dialog>
  </>;
}
