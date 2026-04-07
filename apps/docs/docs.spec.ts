import { describe, expect, it } from "vitest";

describe("docs app", () => {
  it("has a docs title", () => {
    expect("PulseBoard Docs").toContain("Docs");
  });
});
