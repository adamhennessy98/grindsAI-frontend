"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => { console.error("[global-error]", error); }, [error]);
  return <html lang="en"><body><main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "24px", background: "#eef4f1", color: "#0f172a", fontFamily: "Arial, sans-serif", textAlign: "center" }}><section style={{ maxWidth: "440px" }}><p style={{ margin: 0, color: "#0e7490", fontWeight: 700, fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase" }}>GrindsAI</p><h1 style={{ margin: "12px 0 0", fontSize: "30px" }}>Something went wrong.</h1><p style={{ margin: "12px 0 0", lineHeight: 1.5 }}>Please try again. If this continues, contact support.</p><button type="button" onClick={unstable_retry} style={{ marginTop: "24px", border: 0, borderRadius: "10px", background: "#0891b2", color: "white", padding: "12px 18px", fontWeight: 700, cursor: "pointer" }}>Try again</button></section></main></body></html>;
}
