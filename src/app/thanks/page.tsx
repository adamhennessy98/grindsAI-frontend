import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo, ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your next step with GrindsAI.",
  robots: { index: false, follow: false },
};

const messages = {
  signup: { title: "Check your inbox", body: "We have sent a confirmation link to your email. Confirm your account, then come back to sign in and set up your subjects.", cta: "Go to sign in", href: "/login" },
  subscription: { title: "Thanks for choosing GrindsAI", body: "Your subscription is being confirmed with Stripe. Once it is active, you can return to your study workspace and begin revising.", cta: "View your study workspace", href: "/chat" },
  feedback: { title: "Thanks for the feedback", body: "Your message has been received. Feedback from students helps us keep GrindsAI useful, clear and relevant to the Leaving Cert.", cta: "Back to home", href: "/" },
} as const;

export default async function ThanksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const raw = Array.isArray(params.for) ? params.for[0] : params.for;
  const message = raw === "signup" || raw === "subscription" || raw === "feedback" ? messages[raw] : messages.signup;
  return <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4f8f6] px-6 py-16 text-center"><Link href="/" className="mb-10 inline-flex" aria-label="GrindsAI home"><BrandLogo height={42} /></Link><div className="max-w-[540px]"><div className="mx-auto h-8 w-0.5 bg-cyan-600" /><h1 className="font-heading m-0 mt-6 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-.035em] text-gray-950">{message.title}</h1><p className="m-0 mt-4 text-[16px] leading-relaxed text-gray-600">{message.body}</p><Link href={message.href} className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-600 px-5 text-[14px] font-semibold text-white shadow-[0_14px_28px_-22px_rgba(8,145,178,.7)] hover:bg-cyan-700">{message.cta} <ArrowRightIcon size={15} /></Link></div></main>;
}
