import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to your GrindsAI study workspace.", robots: { index: false, follow: false } };

function AuthFormFallback({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5 text-sm text-gray-500">
      Loading {mode === "login" ? "sign in" : "sign up"}...
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.error;
  const authError = Array.isArray(raw) ? raw[0] : raw;

  return (
    <Suspense fallback={<AuthFormFallback mode="login" />}>
      <AuthForm initialMode="login" authError={authError} />
    </Suspense>
  );
}
