"use client";

import { useState } from "react";

/** Local support note until learner-context persistence is available. */
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
    <div className="border-l-2 border-cyan-500 pl-3">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <span><span className="block text-[13px] font-medium text-gray-800 dark:text-slate-100">Add a study note</span><span className="mt-0.5 block text-[12px] text-gray-500">Share anything that will make support more useful.</span></span>
        <span className="shrink-0 text-[12px] font-medium text-cyan-700 dark:text-cyan-300">{open ? "Close" : "Add note"}</span>
      </button>
      {open && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11.5px] text-gray-500">For example: a topic you missed in class, a test that is coming up, or how you prefer to learn.</p>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} maxLength={2000} placeholder='e.g. "I missed the first week of calculus"' className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          <div className="mt-2 flex items-center gap-2">
            <button type="button" disabled={!text.trim() || status === "saving"} onClick={() => void submit()} className="h-8 rounded-md bg-cyan-600 px-3 text-xs font-medium text-white hover:bg-cyan-700 disabled:bg-gray-200 dark:disabled:bg-slate-700">{status === "saving" ? "Saving..." : "Save note"}</button>
            {status === "saved" && <span className="text-[11px] text-emerald-600">Saved</span>}
            {status === "error" && <span className="text-[11px] text-red-600">Could not save</span>}
          </div>
        </div>
      )}
    </div>
  );
}
