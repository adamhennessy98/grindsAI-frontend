import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "GrindsAI - Your personal Leaving Cert tutor",
  description: "A personalised Leaving Cert study workspace for exam questions, step-by-step tutoring, and focused improvement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}><body className="h-full bg-background text-foreground">{children}</body></html>;
}
