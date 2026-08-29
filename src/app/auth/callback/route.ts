import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSiteUrl, safeNextPath } from "@/lib/site-url";
import { hasAcceptedCurrentLegalDocuments, LEGAL_DOCUMENT_VERSION } from "@/lib/legal-consent";

function errorRedirect(origin: string, reason: string) {
  const url = new URL("/auth/auth-code-error", getSiteUrl(origin));
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const authError = searchParams.get("error") ?? searchParams.get("error_code");
  const next = safeNextPath(searchParams.get("next"));

  if (authError) {
    console.warn("[auth] Supabase callback returned an error:", authError);
    return errorRedirect(origin, "provider");
  }

  if (code) {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.redirect(new URL("/login?error=config", getSiteUrl(origin)));
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* ignore */
          }
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const acceptedDuringOauthSignup = searchParams.get("legal-document-version") === LEGAL_DOCUMENT_VERSION;
      if (user && (hasAcceptedCurrentLegalDocuments(user.user_metadata) || acceptedDuringOauthSignup)) {
        const { error: acceptanceError } = await supabase.rpc("record_current_legal_acceptance", {
          p_source: "signup",
        });
        if (acceptanceError) {
          console.error("[auth] Could not record legal acceptance:", acceptanceError);
        }
      }

      const { data: hasAccepted, error: acceptanceStatusError } = await supabase.rpc("has_current_legal_acceptance");
      if (acceptanceStatusError || !hasAccepted) {
        const confirmUrl = new URL("/consent/confirm", getSiteUrl(origin));
        confirmUrl.searchParams.set("next", next);
        return NextResponse.redirect(confirmUrl);
      }
      return NextResponse.redirect(new URL(next, getSiteUrl(origin)));
    }
    console.warn("[auth] Could not exchange Supabase auth code:", error.message);
  }

  return errorRedirect(origin, "expired");
}
