"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function AccountPageClient({ email }: { email: string }) {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const exportData = async () => {
    setExporting(true); setMessage("");
    try {
      const response = await fetch("/api/account/export", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not prepare your data export.");
      const href = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = href; anchor.download = "grindsai-account-data.json";
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(href);
      setMessage("Your account data download has started.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not prepare your data export."); } finally { setExporting(false); }
  };

  const deleteAccount = async () => {
    setDeleting(true); setMessage("");
    try {
      const response = await fetch("/api/account", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation }) });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? "Could not delete your account.");
      await getBrowserSupabase()?.auth.signOut();
      router.replace("/");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not delete your account."); setDeleting(false); }
  };

  return <main className="min-h-screen bg-[#eef4f1] px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6"><div className="mx-auto max-w-[720px]">
    <Link href="/chat" className="text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Back to study workspace</Link>
    <header className="mt-5"><p className="m-0 text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-700 dark:text-cyan-300">Account</p><h1 className="font-heading m-0 mt-1 text-3xl font-semibold tracking-[-.025em]">Your account and data</h1><p className="m-0 mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Manage your study profile, subscription and the information saved to your account.</p></header>
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_42px_-35px_rgba(15,23,42,.5)] dark:border-slate-800 dark:bg-slate-900"><h2 className="m-0 text-lg font-semibold">Study profile</h2><p className="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">{email || "Signed-in student"}</p><Link href="/onboarding?edit=1" className="mt-4 inline-flex rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Edit subjects and study profile</Link></section>
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_42px_-35px_rgba(15,23,42,.5)] dark:border-slate-800 dark:bg-slate-900"><h2 className="m-0 text-lg font-semibold">Subscription</h2><p className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Change or cancel an active plan before deleting your account.</p><Link href="/pricing?billing=1" className="mt-4 inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-500 dark:border-slate-700 dark:text-slate-100">Manage billing</Link></section>
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_42px_-35px_rgba(15,23,42,.5)] dark:border-slate-800 dark:bg-slate-900"><h2 className="m-0 text-lg font-semibold">Download your data</h2><p className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Download the account, study profile, saved progress, Tutor conversations and learning records currently stored by GrindsAI.</p><button type="button" disabled={exporting} onClick={() => void exportData()} className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-800 hover:border-cyan-500 disabled:opacity-60 dark:border-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-200">{exporting ? "Preparing download…" : "Download my data"}</button></section>
    <section className="mt-4 rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-950 dark:bg-red-950/20"><h2 className="m-0 text-lg font-semibold text-red-950 dark:text-red-100">Delete account</h2><p className="m-0 mt-1 text-sm leading-relaxed text-red-900/80 dark:text-red-200">This permanently removes your account and study records. You must cancel an active subscription first.</p>{!deleteOpen ? <button type="button" onClick={() => setDeleteOpen(true)} className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:border-red-500 dark:border-red-900 dark:bg-slate-950 dark:text-red-200">Delete my account</button> : <div className="mt-4"><label className="block text-sm font-medium text-red-950 dark:text-red-100">Type DELETE to confirm<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-red-900 dark:bg-slate-950 dark:text-white" /></label><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={confirmation !== "DELETE" || deleting} onClick={() => void deleteAccount()} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{deleting ? "Deleting…" : "Permanently delete"}</button><button type="button" disabled={deleting} onClick={() => { setDeleteOpen(false); setConfirmation(""); }} className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-slate-950 dark:text-red-200">Cancel</button></div></div>}</section>
    {message && <p role="status" className="mt-4 text-sm text-slate-700 dark:text-slate-200">{message}</p>}
    <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Questions about your data? <Link href="/privacy" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Read the Privacy Policy</Link> or email <a href="mailto:privacy@grindsai.ie" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">privacy@grindsai.ie</a>.</p>
  </div></main>;
}
