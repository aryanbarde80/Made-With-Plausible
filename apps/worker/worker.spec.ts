import { describe, expect, it } from "vitest";

import { runAlertChecker } from "./jobs/alert-checker";

describe("worker jobs", () => {
  it("returns an alert-check summary", async () => {
    await expect(runAlertChecker()).resolves.toEqual({
      checked: true,
      alertsEvaluated: 3
    });
  });
});

