import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid billing request." }, { status: 403 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Billing is temporarily unavailable." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load your billing details." }, { status: 500 });
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe subscription was found for this account." }, { status: 409 });
  }

  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${getSiteUrl(new URL(request.url).origin)}/pricing?billing=1`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (portalError) {
    console.error("[billing-portal] Stripe portal creation failed:", portalError);
    return NextResponse.json({ error: "Could not open billing settings. Please try again." }, { status: 500 });
  }
}
