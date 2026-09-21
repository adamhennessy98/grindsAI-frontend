export const LEGAL_DOCUMENT_VERSION = "2026-08-29";

export const LEGAL_DOCUMENTS = ["terms", "privacy", "consent"] as const;

export type LegalAcceptanceSource = "signup" | "reacceptance";

export function hasAcceptedCurrentLegalDocuments(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object") return false;
  const values = metadata as Record<string, unknown>;
  return (
    values.legal_document_version === LEGAL_DOCUMENT_VERSION &&
    values.legal_documents_accepted === true
  );
}
