import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { SocialProof } from "@/components/landing/social-proof";
import { StudySystemDetail } from "@/components/landing/study-system-detail";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-full bg-[#f4f8f6]">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <PricingTeaser />
      <SocialProof />
      <StudySystemDetail />
      <Footer />
    </div>
  );
}
