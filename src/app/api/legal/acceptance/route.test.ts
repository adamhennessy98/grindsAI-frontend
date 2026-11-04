import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { LEGAL_DOCUMENT_VERSION } from "@/lib/legal-consent";

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), getUser: vi.fn(), rpc: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));

const valid = { source: "reacceptance", accepted: true, version: LEGAL_DOCUMENT_VERSION };
function request(body: unknown, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/legal/acceptance", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.createClient.mockResolvedValue({ auth: { getUser: mocks.getUser }, rpc: mocks.rpc });
  mocks.getUser.mockResolvedValue({ data: { user: { id: "account-from-session" } } });
  mocks.rpc.mockResolvedValue({ error: null });
});

describe("legal acceptance API", () => {
  it("rejects cross-origin acceptance before any database call", async () => {
    expect((await POST(request(valid, "https://untrusted.example"))).status).toBe(403);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
  it.each([null, {}, { ...valid, accepted: false }, { ...valid, version: "outdated" }])("requires explicit acceptance of the current version: %j", async body => {
    expect((await POST(request(body))).status).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("requires an authenticated session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    expect((await POST(request(valid))).status).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("delegates user identity, timestamp and versions to the database rather than the caller", async () => {
    const response = await POST(request({ ...valid, user_id: "another-user", accepted_at: "1999-01-01" }));
    expect(response.status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith("record_current_legal_acceptance", { p_source: "reacceptance" });
  });
  it("never reports success when persistence fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.rpc.mockResolvedValue({ error: { code: "PGRST202" } });
    expect((await POST(request(valid))).status).toBe(503);
    vi.restoreAllMocks();
  });
});
