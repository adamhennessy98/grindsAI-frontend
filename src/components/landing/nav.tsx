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
        background: scrolled ? "rgba(244,248,246,0.9)" : "rgba(244,248,246,0.68)",
        backdropFilter: "saturate(180%) blur(10px)",
        WebkitBackdropFilter: "saturate(180%) blur(10px)",
        borderBottom: scrolled ? "1px solid #dfe7e1" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon size={28} />
          <span className="font-heading text-[17px] font-semibold tracking-[-0.01em]">GrindsAI</span>
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
            className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-white bg-[linear-gradient(135deg,#06b6d4,#84cc16)] hover:brightness-105 transition-[filter,transform] hover:-translate-y-0.5 shadow-[0_14px_30px_-20px_rgba(6,182,212,.9)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
