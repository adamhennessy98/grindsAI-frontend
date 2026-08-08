"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/icons";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/site-url";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Auth is not configured. Add Supabase keys to .env.local.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl("/chat", window.location.origin),
    });
    setLoading(false);
    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-5 pt-10 pb-6">
      <Link href="/" className="mb-7 inline-flex items-center" aria-label="GrindsAI home">
        <BrandLogo height={42} />
      </Link>
      <div
        className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl p-7"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.08)" }}
      >
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] m-0">Reset password</h1>
        <p className="mt-1.5 mb-5 text-gray-500 text-sm">We will email you a link to choose a new password.</p>
        {sent ? (
          <p className="text-sm text-gray-700">Check your inbox for the reset link.</p>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] text-gray-700 font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]"
                autoComplete="email"
              />
            </label>
            {error && (
              <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 px-2.5 py-2 rounded-lg">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full h-[42px] rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-500 mb-0">
          <Link href="/login" className="text-emerald-700 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
