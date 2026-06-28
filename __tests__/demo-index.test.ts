import { describe, it, expect, vi, beforeEach } from "vitest";

describe("isDemoMode", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("returns true when NEXT_PUBLIC_DEMO_MODE is 'true'", async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "true";
    const { isDemoMode } = await import("@/lib/demo/index");
    expect(isDemoMode()).toBe(true);
  });

  it("returns false when NEXT_PUBLIC_DEMO_MODE is 'false'", async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "false";
    const { isDemoMode } = await import("@/lib/demo/index");
    expect(isDemoMode()).toBe(false);
  });

  it("returns false when NEXT_PUBLIC_DEMO_MODE is undefined", async () => {
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    const { isDemoMode } = await import("@/lib/demo/index");
    expect(isDemoMode()).toBe(false);
  });

  it("returns false when NEXT_PUBLIC_DEMO_MODE is an empty string", async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "";
    const { isDemoMode } = await import("@/lib/demo/index");
    expect(isDemoMode()).toBe(false);
  });

  it("returns false for case-mismatched values like 'True'", async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "True";
    const { isDemoMode } = await import("@/lib/demo/index");
    expect(isDemoMode()).toBe(false);
  });
});
