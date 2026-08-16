"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/icons";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // The public landing experience is intentionally light, even after navigating from the signed-in dark theme.
    document.documentElement.classList.remove("dark");

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(244,248,246,0.9)" : "rgba(244,248,246,0.68)",
        backdropFilter: "saturate(180%) blur(10px)",
        WebkitBackdropFilter: "saturate(180%) blur(10px)",
        borderBottom: scrolled ? "1px solid #dfe7e1" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center" aria-label="GrindsAI home">
          <BrandLogo height={42} />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-gray-500">
          <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Why GrindsAI</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white shadow-[0_14px_28px_-22px_rgba(8,145,178,.7)] transition-colors hover:bg-cyan-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
