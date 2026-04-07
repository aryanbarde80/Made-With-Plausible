import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./lib/auth/password";

describe("password auth", () => {
  it("hashes and verifies a password", () => {
    const hash = hashPassword("super-secret-password");

    expect(verifyPassword("super-secret-password", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
});

