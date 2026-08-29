import { describe, expect, it } from "vitest";
import { hasAcceptedCurrentLegalDocuments, LEGAL_DOCUMENT_VERSION } from "@/lib/legal-consent";

describe("hasAcceptedCurrentLegalDocuments", () => {
  it("accepts only the current, explicit signup marker", () => {
    expect(
      hasAcceptedCurrentLegalDocuments({
        legal_document_version: LEGAL_DOCUMENT_VERSION,
        legal_documents_accepted: true,
      }),
    ).toBe(true);
  });

  it("rejects missing, outdated, or non-boolean markers", () => {
    expect(hasAcceptedCurrentLegalDocuments(null)).toBe(false);
    expect(hasAcceptedCurrentLegalDocuments({ legal_document_version: "2026-01-01", legal_documents_accepted: true })).toBe(false);
    expect(hasAcceptedCurrentLegalDocuments({ legal_document_version: LEGAL_DOCUMENT_VERSION, legal_documents_accepted: "true" })).toBe(false);
  });
});
