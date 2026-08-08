"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/icons";
import { PASSWORD_GUIDANCE, passwordRequirementError } from "@/lib/password-policy";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const passwordError = passwordRequirementError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Password reset is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("We could not update your password. Request a new reset link and try again.");
      return;
    }

    router.replace("/chat");
    router.refresh();
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
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] m-0">Choose a new password</h1>
        <p className="mt-1.5 mb-5 text-gray-500 text-sm">Use a new password that you do not use elsewhere.</p>
        <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-gray-700 font-medium">New password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]"
              autoComplete="new-password"
              aria-describedby="password-guidance"
            />
          </label>
          <p id="password-guidance" className="-mt-1 mb-0 text-xs text-gray-500">
            {PASSWORD_GUIDANCE}
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-gray-700 font-medium">Confirm new password</span>
            <input
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]"
              autoComplete="new-password"
            />
          </label>
          {error && (
            <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 px-2.5 py-2 rounded-lg">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full h-[42px] rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
