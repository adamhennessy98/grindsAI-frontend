import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create an account", description: "Create your GrindsAI Leaving Cert study workspace.", robots: { index: false, follow: false } };

function AuthFormFallback({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5 text-sm text-gray-500">
      Loading {mode === "login" ? "sign in" : "sign up"}...
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthFormFallback mode="signup" />}>
      <AuthForm initialMode="signup" />
    </Suspense>
  );
}
