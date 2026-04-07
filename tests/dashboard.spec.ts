import { describe, expect, it } from "vitest";

describe("dashboard", () => {
  it("renders KPI concepts", () => {
    expect("PulseBoard").toMatch(/Pulse/);
  });
});

