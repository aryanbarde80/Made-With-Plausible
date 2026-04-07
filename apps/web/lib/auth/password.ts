import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, saved] = storedHash.split(":");
  const derived = scryptSync(password, salt, KEY_LENGTH);
  const savedBuffer = Buffer.from(saved, "hex");

  if (derived.length !== savedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derived, savedBuffer);
}

