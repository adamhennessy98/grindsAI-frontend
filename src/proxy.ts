import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/site-url";
import { getSubscriptionAccess } from "@/lib/subscription";

const ONBOARDING_COOKIE = "grindsai_onboarding";
const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyOnboardingCookie(response: NextResponse, complete: boolean) {
  if (complete) {
    response.cookies.set(ONBOARDING_COOKIE, "1", {
      path: "/",
      maxAge: ONBOARDING_COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    response.cookies.set(ONBOARDING_COOKIE, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

async function readOnboardingComplete(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) return false;
    return Boolean(data?.onboarding_completed_at);
  } catch {
    return false;
  }
}

async function readCurrentLegalAcceptance(
  supabase: ReturnType<typeof createServerClient>,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("has_current_legal_acceptance");
    return !error && data === true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    if (pathname.startsWith("/chat") || pathname.startsWith("/onboarding") || pathname.startsWith("/account")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "config");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const onboardingComplete = user
    ? await readOnboardingComplete(supabase, user.id)
    : false;
  const legalAcceptanceRequired =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/billing") ||
    (pathname.startsWith("/api/") && pathname !== "/api/legal/acceptance");
  const hasCurrentLegalAcceptance = user && legalAcceptanceRequired
    ? await readCurrentLegalAcceptance(supabase)
    : true;

  // /login and /signup always render — "Sign in" / "Get started" must not bounce
  // past the auth forms just because a session cookie is still present.

  if (user && legalAcceptanceRequired && !hasCurrentLegalAcceptance) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Accept the current legal information before using this feature." }, { status: 428 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/consent/confirm";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/chat") && !onboardingComplete) {
    const redirect = NextResponse.redirect(new URL("/onboarding", request.url));
    return applyOnboardingCookie(redirect, false);
  }

  if (user && pathname === "/onboarding" && onboardingComplete && !request.nextUrl.searchParams.has("edit")) {
    const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
    const destination = nextPath === "/onboarding" ? "/chat" : nextPath;
    const redirect = NextResponse.redirect(new URL(destination, request.url));
    return applyOnboardingCookie(redirect, true);
  }

  if (!user && (pathname.startsWith("/onboarding") || pathname.startsWith("/account") || pathname === "/consent/confirm")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (!user && pathname === "/update-password") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  if (!user && pathname.startsWith("/chat")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && (pathname === "/api/chat" || pathname.startsWith("/api/learning"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user && pathname.startsWith("/chat") && onboardingComplete) {
    const access = await getSubscriptionAccess(supabase, user.id, user.email);
    if (!access.ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/pricing";
      url.searchParams.set("required", "1");
      return NextResponse.redirect(url);
    }
  }

  if (user) {
    applyOnboardingCookie(supabaseResponse, onboardingComplete);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
