const LOCAL_SITE_URL = "http://localhost:3000";

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

  if (fallbackOrigin) return withoutTrailingSlash(fallbackOrigin);
  return LOCAL_SITE_URL;
}

export function safeNextPath(nextPath: string | null | undefined) {
  // Default to onboarding; proxy sends finished students to /chat once the DB says complete.
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) return "/onboarding";
  return nextPath;
}

export function getAuthCallbackUrl(nextPath: string, fallbackOrigin?: string) {
  const url = new URL("/auth/callback", getSiteUrl(fallbackOrigin));
  url.searchParams.set("next", safeNextPath(nextPath));
  return url.toString();
}
