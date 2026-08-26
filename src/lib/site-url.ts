const LOCAL_SITE_URL = "http://localhost:3000";
const INTERNAL_REDIRECT_ORIGIN = "https://grindsai.internal";

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return withoutTrailingSlash(configured);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return withoutTrailingSlash(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be configured for production deployments.");
  }

  // Request origins are only a safe fallback during local development. Production
  // auth redirects must use an explicitly configured deployment URL.
  if (fallbackOrigin) return withoutTrailingSlash(fallbackOrigin);
  return LOCAL_SITE_URL;
}

export function safeNextPath(nextPath: string | null | undefined) {
  // A leading slash alone is not safe: URL parsers can interpret a backslash as
  // a protocol-relative URL. Parse against an internal origin and retain only
  // same-origin paths.
  if (!nextPath) return "/onboarding";

  try {
    const destination = new URL(nextPath, INTERNAL_REDIRECT_ORIGIN);
    if (destination.origin !== INTERNAL_REDIRECT_ORIGIN) return "/onboarding";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/onboarding";
  }
}

export function getAuthCallbackUrl(nextPath: string, fallbackOrigin?: string) {
  const url = new URL("/auth/callback", getSiteUrl(fallbackOrigin));
  url.searchParams.set("next", safeNextPath(nextPath));
  return url.toString();
}
