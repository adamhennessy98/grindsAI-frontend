import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { SocialProof } from "@/components/landing/social-proof";
import { StudySystemDetail } from "@/components/landing/study-system-detail";
import { Footer } from "@/components/landing/footer";
import { FAQ } from "@/components/pricing/faq";
import { Subjects } from "@/components/landing/subjects";
import { MobileStudyCta } from "@/components/landing/mobile-study-cta";

export const metadata: Metadata = {
  title: "Personalised Leaving Cert tutor",
  description: "Subject-aware Leaving Cert tutoring, Topic Checks, unlimited exam questions and progress support that gets more personal as you study.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <div className="min-h-full bg-[#f4f8f6]">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <Subjects />
      <PricingTeaser />
      <SocialProof />
      <StudySystemDetail />
      <div className="bg-[#f4f8f6] px-6 pb-20"><div className="mx-auto flex max-w-[1140px] justify-center"><FAQ id="faq" /></div></div>
      <Footer />
      <MobileStudyCta />
    </div>
  );
}
