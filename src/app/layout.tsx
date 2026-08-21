import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AnalyticsConsent } from "@/components/analytics-consent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://grindsai.ie"),
  title: { default: "GrindsAI | Personalised Leaving Cert tutor", template: "%s | GrindsAI" },
  description: "A personalised Leaving Cert study workspace for exam questions, step-by-step tutoring, Topic Checks and focused improvement.",
  applicationName: "GrindsAI",
  keywords: ["Leaving Cert", "Irish secondary school", "exam questions", "study tutor", "past papers"],
  openGraph: { type: "website", locale: "en_IE", siteName: "GrindsAI", title: "GrindsAI | Personalised Leaving Cert tutor", description: "Subject-aware tutoring, exam questions and a clearer next step for Leaving Cert students." },
  twitter: { card: "summary", title: "GrindsAI | Personalised Leaving Cert tutor", description: "Subject-aware tutoring, exam questions and a clearer next step for Leaving Cert students." },
  icons: {
    icon: "/grindsai-logo-icon-centered.svg",
    apple: "/grindsai-logo-icon-centered.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}><body className="h-full bg-background text-foreground">{children}<AnalyticsConsent /></body></html>;
}
