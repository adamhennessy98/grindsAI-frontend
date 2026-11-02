export const LEGAL_DOCUMENT_VERSION = "2026-08-29";

export const LEGAL_DOCUMENTS = ["terms", "privacy", "consent"] as const;

export type LegalAcceptanceSource = "signup" | "reacceptance";

// Keep local sign-in usable before the migration; production always fails closed.
export function isLegalMigrationMissingInDevelopment(error: { code?: string } | null) {
  return process.env.NODE_ENV !== "production" && error?.code === "PGRST202";
}
