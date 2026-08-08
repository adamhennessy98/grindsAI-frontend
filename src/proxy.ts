import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ONBOARDING_COOKIE = "grindsai_onboarding";
const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyOnboardingCookie(response: NextResponse, complete: boolean) {
  if (complete) {
    response.cookies.set(ONBOARDING_COOKIE, "1", {
      path: "/",
      maxAge: ONBOARDING_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  } else {
    response.cookies.set(ONBOARDING_COOKIE, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  }
  return response;
}

async function readOnboardingComplete(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  cookieFallback: boolean,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) return cookieFallback;
    return Boolean(data?.onboarding_completed_at);
  } catch {
    return cookieFallback;
  }
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
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

  const { pathname } = request.nextUrl;
  const cookieComplete = request.cookies.get(ONBOARDING_COOKIE)?.value === "1";
  const onboardingComplete = user
    ? await readOnboardingComplete(supabase, user.id, cookieComplete)
    : false;

  // /login and /signup always render — "Sign in" / "Get started" must not bounce
  // past the auth forms just because a session cookie is still present.

  if (user && pathname.startsWith("/chat") && !onboardingComplete) {
    const redirect = NextResponse.redirect(new URL("/onboarding", request.url));
    return applyOnboardingCookie(redirect, false);
  }

  if (user && pathname === "/onboarding" && onboardingComplete && !request.nextUrl.searchParams.has("edit")) {
    const redirect = NextResponse.redirect(new URL("/chat", request.url));
    return applyOnboardingCookie(redirect, true);
  }

  if (!user && pathname.startsWith("/onboarding")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
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
