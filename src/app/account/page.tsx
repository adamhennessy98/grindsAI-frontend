import { redirect } from "next/navigation";
import { AccountPageClient } from "./account-page-client";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account and data",
  description: "Manage your GrindsAI account, study data, and billing.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=config");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");
  return <AccountPageClient email={user.email ?? ""} />;
}
