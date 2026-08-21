import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/icons";
import { PricingOptions } from "@/components/landing/pricing-teaser";
import { ManageBillingButton } from "@/components/pricing/manage-billing-button";
import { FAQ } from "@/components/pricing/faq";
import { getSubscriptionAccess } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose a flexible GrindsAI plan for one, up to seven, or unlimited Leaving Cert subjects.",
  alternates: { canonical: "/pricing" },
};

const rows = [
  ["", "Private grinds", "GrindsAI"],
  ["Monthly cost", "€40-50 per hour", "From €10"],
  ["Available 24/7", "No", "Yes"],
  ["Curriculum-aligned", "Sometimes", "Always"],
  ["Travels with you", "No", "Yes"],
  ["Cancellable any time", "No", "Yes"],
];

function Comparison() {
  return (
    <section className="mt-16 w-full max-w-[720px]">
      <h2 className="font-heading mb-[18px] text-center text-[18px] font-semibold tracking-[-0.01em]">Side by side</h2>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white" style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 1px 1px rgba(17,24,39,0.03)" }}>
        {rows.map((row, index) => (
          <div key={row[0] || "heading"} className={["grid px-5 py-3.5 text-sm", index < rows.length - 1 ? "border-b border-[#eef0f3]" : "", index === 0 ? "bg-gray-50 font-medium text-gray-500" : "bg-white text-gray-900"].join(" ")} style={{ gridTemplateColumns: "1.4fr 1fr 1fr" }}>
            <div>{row[0]}</div>
            <div className="text-gray-500">{row[1]}</div>
            <div className={index === 0 ? "text-gray-500" : "font-medium text-emerald-700"}>{row[2]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BillingNotice({ required, checkout, billing, active, canManage }: { required: boolean; checkout?: string; billing: boolean; active: boolean; canManage: boolean }) {
  if (!required && !checkout && !billing && !active) return null;
  const message = checkout === "success"
    ? "Thanks. Your subscription is being confirmed. You can continue to your study workspace once it is active."
    : checkout === "cancelled"
      ? "Checkout was cancelled. You can choose a plan whenever you are ready."
      : required
        ? "Choose a plan to continue using your GrindsAI study workspace."
        : active
          ? "Your GrindsAI subscription is active."
          : "Manage your GrindsAI subscription here.";
  return (
    <section role="status" className="mb-8 w-full max-w-[720px] rounded-xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-center">
      <p className="m-0 text-sm font-medium text-cyan-950">{message}</p>
      {canManage && <div className="mt-3"><ManageBillingButton /></div>}
    </section>
  );
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const required = params.required === "1";
  const checkout = typeof params.checkout === "string" ? params.checkout : undefined;
  const billing = params.billing === "1";

  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const access = user && supabase ? await getSubscriptionAccess(supabase, user.id, user.email) : null;
  const active = Boolean(access?.ok && access.source === "subscription");
  const { data: billingProfile } = user && supabase
    ? await supabase.from("profiles").select("subscription_status, stripe_customer_id").eq("id", user.id).maybeSingle()
    : { data: null };
  const canManage = Boolean(
    billingProfile?.stripe_customer_id &&
      ["active", "trialing", "past_due"].includes(billingProfile.subscription_status ?? ""),
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-6">
          <Link href="/" className="inline-flex items-center" aria-label="GrindsAI home"><BrandLogo height={36} /></Link>
          <Link href={user ? "/chat" : "/login?next=/pricing"} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
            {user ? "Back to app" : "Sign in"}
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 px-6 py-16 pb-20">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center">
          <div className="animate-fade-up max-w-[600px] text-center">
            <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">Pricing</div>
            <h1 className="font-heading m-0 text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em]">Less than 30 minutes of a real grind.</h1>
            <p className="mt-[18px] text-[17px] leading-relaxed text-gray-500">One real grinds session costs <span className="font-medium text-gray-700">€40-50</span>. This is your tutor for the whole year.</p>
          </div>

          <BillingNotice required={required} checkout={checkout} billing={billing} active={active} canManage={canManage} />
          <div className="animate-fade-up-2 mt-10 w-full"><PricingOptions /></div>
          <Comparison />
          <FAQ />
        </div>
      </main>
    </div>
  );
}
