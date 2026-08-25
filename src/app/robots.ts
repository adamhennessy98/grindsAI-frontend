import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/account/", "/auth/", "/billing/", "/chat/", "/login", "/onboarding/", "/reset-password", "/signup", "/thanks", "/update-password"] }, sitemap: `${site}/sitemap.xml` };
}
