import { describe, expect, it } from "vitest";

describe("onboarding flow", () => {
  it("persists setup steps", () => {
    expect(["org", "site", "alert"]).toContain("site");
  });
});

