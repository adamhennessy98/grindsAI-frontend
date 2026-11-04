"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeNextPath } from "@/lib/site-url";
import { LEGAL_DOCUMENT_VERSION } from "@/lib/legal-consent";

export function ConsentConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    if (!accepted || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/legal/acceptance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "reacceptance", accepted: true, version: LEGAL_DOCUMENT_VERSION }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "We could not record your acceptance. Please try again.");
        return;
      }
      const next = safeNextPath(searchParams.get("next"));
      router.replace(next.startsWith("/consent/confirm") ? "/chat" : next);
      router.refresh();
    } catch {
      setError("We could not record your acceptance. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f7] px-5 py-12 sm:py-20">
      <section className="mx-auto max-w-[560px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(15,23,42,.45)] sm:p-8">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">One quick step</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Review and accept the current terms</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We have updated the legal information for GrindsAI. Please read the documents below before continuing to your
          study workspace.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link href="/terms" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50">Terms</Link>
          <Link href="/privacy" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50">Privacy</Link>
          <Link href="/consent" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50">Consent</Link>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
          <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600" />
          <span>I agree to the Terms of use and acknowledge the Privacy Policy and Consent and cookies information. Optional analytics remains a separate choice.</span>
        </label>

        {error ? <p role="alert" className="mt-4 text-sm text-red-700">{error}</p> : null}
        <button type="button" onClick={() => void confirm()} disabled={!accepted || saving} className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          {saving ? "Saving your choice..." : "Accept and continue"}
        </button>
        <p className="mt-5 text-sm text-slate-600">You can still <Link href="/account" className="font-medium text-emerald-700 underline">manage your account and data</Link> or <Link href="/pricing?billing=1" className="font-medium text-emerald-700 underline">manage billing</Link>.</p>
      </section>
    </main>
  );
}
