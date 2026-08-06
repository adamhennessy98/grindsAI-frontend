"use client";

import { useState } from "react";

/** Anytime note — tone + check-queue only; never writes mastery. */
export function FreeTextNote() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const submit = async () => {
    const value = text.trim();
    if (!value) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/learning/free-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      if (!res.ok) throw new Error("save failed");
      setText("");
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-[13px] font-medium text-gray-800">Tell your tutor something</span>
        <span className="text-[11px] text-gray-400">{open ? "Hide" : "Open"}</span>
      </button>
      {open && (
        <div className="mt-2">
          <p className="text-[11.5px] text-gray-500 mb-1.5">
            Anxiety, gaps in teaching, anything else. This adjusts tone and may queue a quick check — it never
            changes mastery scores by itself.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder='e.g. "I get anxious before tests"'
            className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              disabled={!text.trim() || status === "saving"}
              onClick={() => void submit()}
              className="h-8 px-3 rounded-lg text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200"
            >
              {status === "saving" ? "Saving…" : "Save note"}
            </button>
            {status === "saved" && <span className="text-[11px] text-emerald-600">Saved</span>}
            {status === "error" && <span className="text-[11px] text-red-600">Could not save</span>}
          </div>
        </div>
      )}
    </div>
  );
}
