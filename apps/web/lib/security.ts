import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { z } from "zod";

const REDACTED = "[redacted]";

function cleanText(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export function sanitizeText(value: string, maxLength = 120) {
  return cleanText(value).replace(/\s+/g, " ").slice(0, maxLength);
}

export function sanitizeEmail(value: string) {
  return cleanText(value).toLowerCase().slice(0, 320);
}

export function sanitizeToken(value: string) {
  return cleanText(value).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 256);
}

export function redactEmail(email: string) {
  const [localPart, domain] = sanitizeEmail(email).split("@");

  if (!localPart || !domain) {
    return REDACTED;
  }

  const visible = localPart.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(localPart.length - 2, 2))}@${domain}`;
}

export function hashForLogs(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function getEncryptionKey() {
  const source = process.env.NEXTAUTH_SECRET ?? "pulseboard-dev-secret";
  return createHash("sha256").update(source).digest();
}

export function encryptText(plainText: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decryptText(payload: string) {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");

  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

export const loginSchema = z.object({
  email: z.string().email().max(320).transform(sanitizeEmail),
  password: z.string().min(8).max(128)
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80).transform((value) => sanitizeText(value, 80)),
  email: z.string().email().max(320).transform(sanitizeEmail),
  password: z.string().min(8).max(128)
});

export const magicLinkSchema = z.object({
  email: z.string().email().max(320).transform(sanitizeEmail)
});
