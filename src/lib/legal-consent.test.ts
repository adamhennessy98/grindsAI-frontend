import { afterEach, describe, expect, it, vi } from "vitest";
import { isLegalMigrationMissingInDevelopment } from "@/lib/legal-consent";

afterEach(() => vi.unstubAllEnvs());

describe("legal acceptance rollout", () => {
  it("permits local development only when the migration function is missing", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isLegalMigrationMissingInDevelopment({ code: "PGRST202" })).toBe(true);
    expect(isLegalMigrationMissingInDevelopment({ code: "42501" })).toBe(false);
    expect(isLegalMigrationMissingInDevelopment(null)).toBe(false);
  });

  it("never bypasses a missing migration in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isLegalMigrationMissingInDevelopment({ code: "PGRST202" })).toBe(false);
  });
});
