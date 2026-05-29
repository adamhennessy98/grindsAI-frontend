import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { BetaAccessTeaser } from "@/components/landing/beta-access";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { SocialProof } from "@/components/landing/social-proof";
import { Footer } from "@/components/landing/footer";
import { IS_BETA } from "@/lib/beta";

export default function LandingPage() {
  return (
    <div className="min-h-full bg-white">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      {IS_BETA ? <BetaAccessTeaser /> : <PricingTeaser />}
      <SocialProof />
      <Footer />
    </div>
  );
}
