"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoIcon, GoogleIcon, EyeIcon } from "@/components/icons";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/site-url";

type Mode = "login" | "signup";

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between items-center text-[12.5px] text-gray-700 font-medium">
        {label}
        {right}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm outline-none transition-[border-color,box-shadow] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08]";

function mapAuthMessage(message: string): string {
  if (message.includes("Invalid login credentials")) return "Email or password is incorrect.";
  if (message.includes("Email not confirmed")) return "Confirm your email first — check your inbox for the link from GrindsAI.";
  if (message.includes("User already registered")) return "An account with this email already exists. Try signing in.";
  if (message.includes("Unsupported provider")) return "Google sign-in is not enabled yet. Please use email and password.";
  return message;
}

const googleAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

export function AuthForm({ initialMode, authError }: { initialMode: Mode; authError?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) return n;
    return "/chat";
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const bannerError = authError === "config" ? "Server auth is not configured yet." : authError === "auth" ? "Something went wrong signing you in." : authError ? "Sign-in failed." : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectTo = getAuthCallbackUrl(nextPath, window.location.origin);
        const { data, error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: name.trim() || undefined },
          },
        });
        if (signErr) {
          setError(mapAuthMessage(signErr.message));
          return;
        }
        if (data.session) {
          router.push(nextPath);
          router.refresh();
          return;
        }
        setInfo("Account created. Check your email for a confirmation link, then sign in.");
        return;
      }

      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) {
        setError(mapAuthMessage(signErr.message));
        return;
      }
      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError("");
    setInfo("");
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Auth is not configured. Add Supabase keys to .env.local.");
      return;
    }
    setLoading(true);
    const redirectTo = getAuthCallbackUrl(nextPath, window.location.origin);
    const { error: oAuthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    setLoading(false);
    if (oAuthErr) setError(mapAuthMessage(oAuthErr.message));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-5 pt-10 pb-6">
      <Link href="/" className="flex items-center gap-2.5 mb-7">
        <LogoIcon size={32} />
        <span className="text-[18px] font-semibold tracking-[-0.01em]">GrindsAI</span>
      </Link>

      <div
        className="animate-fade-up w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl p-7"
        style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.08)" }}
      >
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] m-0">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 mb-[22px] text-gray-500 text-sm">
          {mode === "signup"
            ? "Set up your personalised Leaving Cert study workspace."
            : "Sign in to continue your study session."}
        </p>
        {false && (
          <p className="-mt-3 mb-[18px] text-[12.5px] text-amber-900 bg-amber-50 border border-amber-100 px-2.5 py-2 rounded-lg leading-relaxed">
            This is an early preview — some subjects and features are still being built. Always double-check important
            work with your teacher or textbook.
          </p>
        )}

        {bannerError && (
          <div className="mb-4 text-[13px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-2 rounded-lg">
            {bannerError}
          </div>
        )}

        {info && (
          <div className="mb-4 text-[13px] text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-2 rounded-lg">
            {info}
          </div>
        )}

        {googleAuthEnabled && (
          <>
            <button
              type="button"
              onClick={() => void google()}
              disabled={loading}
              className="w-full h-[42px] flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <GoogleIcon size={16} />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 uppercase tracking-[0.06em] font-mono">or with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </>
        )}

        <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-3">
          {mode === "signup" && (
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student name"
                className={inputCls}
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ie"
              className={inputCls}
              autoComplete="email"
            />
          </Field>
          <Field
            label="Password"
            right={
              mode === "login" ? (
                <Link href="/reset-password" className="text-xs text-gray-500 hover:text-gray-700">
                  Forgot?
                </Link>
              ) : undefined
            }
          >
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className={`${inputCls} pr-10`}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 p-1.5 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                <EyeIcon size={16} />
              </button>
            </div>
          </Field>

          {error && (
            <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 px-2.5 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full h-[42px] rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shadow-[inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(16,185,129,0.25)] disabled:shadow-none flex items-center justify-center gap-1"
          >
            {loading ? (
              <>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </>
            ) : mode === "signup" ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-5 mb-0 text-[13.5px] text-gray-500 text-center">
          {mode === "signup" ? "Already have an account?" : "New to GrindsAI?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
              setInfo("");
            }}
            className="text-emerald-700 font-medium hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center max-w-[360px]">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline hover:text-gray-600">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
