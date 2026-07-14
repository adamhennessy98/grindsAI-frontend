"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/icons";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className="sticky top-0 z-50 transition-all duration-200" style={{ background: scrolled ? "rgba(244,248,246,.9)" : "rgba(244,248,246,.65)", backdropFilter: "saturate(180%) blur(10px)", borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent" }}><div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-6"><Link href="/" className="flex items-center gap-2.5"><LogoIcon size={28} /><span className="font-heading text-[17px] font-semibold tracking-[-.01em]">GrindsAI</span></Link><nav className="hidden gap-8 text-sm text-gray-500 md:flex"><a href="#how" className="transition-colors hover:text-gray-900">How it works</a><a href="#features" className="transition-colors hover:text-gray-900">Features</a><a href="#pricing" className="transition-colors hover:text-gray-900">Pricing</a><Link href="/chat" className="transition-colors hover:text-gray-900">Demo</Link></nav><div className="flex items-center gap-2"><Link href="/login" className="hidden h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 md:inline-flex">Sign in</Link><Link href="/signup" className="inline-flex h-10 items-center rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white shadow-[inset_0_-1px_0_rgba(0,0,0,.15),0_1px_2px_rgba(16,185,129,.25)] transition-colors hover:bg-emerald-600">Get started</Link></div></div></header>;
}
