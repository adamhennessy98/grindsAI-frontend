"use client";

import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openPortal = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) {
        setError(body.error ?? "Could not open billing settings.");
        return;
      }
      window.location.assign(body.url);
    } catch {
      setError("Could not open billing settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button type="button" onClick={() => void openPortal()} disabled={loading} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Opening billing..." : "Manage subscription"}
      </button>
      {error && <p className="mb-0 mt-2 text-[13px] text-red-600">{error}</p>}
    </div>
  );
}
