"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const btnCls =
  "mt-5 flex items-center justify-center h-12 w-full rounded-[10px] text-[15px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)] disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed";

export function SubscribeButton({ label = "Subscribe with Stripe" }: { label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Checkout could not start.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("Checkout could not start.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" className={btnCls} disabled={loading} onClick={() => void startCheckout()}>
        {loading ? "Redirecting..." : label}
      </button>
      {error && <p className="mt-2 text-[13px] text-red-600 text-center mb-0">{error}</p>}
    </div>
  );
}
