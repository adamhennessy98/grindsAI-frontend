"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/icons";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
        backdropFilter: "saturate(180%) blur(10px)",
        WebkitBackdropFilter: "saturate(180%) blur(10px)",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon size={28} />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">GrindsAI</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-gray-500">
          <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <Link href="/chat" className="hover:text-gray-900 transition-colors">Demo</Link>
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
            className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
