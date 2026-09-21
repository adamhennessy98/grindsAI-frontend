#!/usr/bin/env node
/**
 * Grant (or revoke) a no-card free trial to a user by email. Sets
 * profiles.trial_ends_at, which src/lib/subscription.ts treats as full
 * access for as long as it's in the future — independent of Stripe.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node --env-file=.env.local scripts/grant-free-trial.mjs user@example.com
 *   node --env-file=.env.local scripts/grant-free-trial.mjs user@example.com --days 90
 *   node --env-file=.env.local scripts/grant-free-trial.mjs user@example.com --revoke
 */
import { createClient } from "@supabase/supabase-js";

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  return idx === -1 ? null : (process.argv[idx + 1] ?? null);
}

const email = process.argv[2];
const days = Number(argValue("--days") ?? "90");
const revoke = process.argv.includes("--revoke");

if (!email || email.startsWith("--")) {
  console.error("Usage: node --env-file=.env.local scripts/grant-free-trial.mjs <email> [--days 90] [--revoke]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function findUserIdByEmail(targetEmail) {
  const normalised = targetEmail.trim().toLowerCase();
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === normalised);
    if (match) return match.id;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

const userId = await findUserIdByEmail(email);
if (!userId) {
  console.error(`No auth user found for ${email}`);
  process.exit(1);
}

const trialEndsAt = revoke ? null : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const { error } = await supabase.from("profiles").update({ trial_ends_at: trialEndsAt }).eq("id", userId);
if (error) {
  console.error("Failed to update profile:", error.message);
  process.exit(1);
}

console.log(
  revoke
    ? `Revoked free trial for ${email}.`
    : `Granted ${email} a free trial until ${trialEndsAt} (${days} days), no card required.`,
);
