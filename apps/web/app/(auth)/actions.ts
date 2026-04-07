"use server";

import { randomBytes } from "node:crypto";

import { redirect } from "next/navigation";
import { rateLimitCheck } from "@pulseboard/cache";

import { db } from "@pulseboard/db";
import { sendEmail } from "@pulseboard/email";

import { hashPassword, verifyPassword } from "../../lib/auth/password";
import { logger } from "../../lib/logger";
import {
  hashForLogs,
  loginSchema,
  magicLinkSchema,
  redactEmail,
  registerSchema,
  sanitizeToken
} from "../../lib/security";
import { bootstrapUserWorkspace, createSession } from "../../lib/auth/session";
import { getAppUrl } from "../../lib/env";

async function enforceRateLimit(key: string, limit: number, windowSeconds: number, error: string) {
  const result = await rateLimitCheck(key, limit, windowSeconds);

  if (!result.allowed) {
    logger.warn("auth.rate_limit.blocked", {
      key,
      remaining: result.remaining
    });
    redirect(error);
  }
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? "")
  });

  if (!parsed.success) {
    redirect("/login?error=invalid_credentials");
  }

  const { email, password } = parsed.data;
  await enforceRateLimit(`login:${hashForLogs(email)}`, 10, 60 * 10, "/login?error=too_many_attempts");

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user || !verifyPassword(password, user.hashedPassword)) {
    logger.warn("auth.login.failed", {
      email: redactEmail(email)
    });
    redirect("/login?error=invalid_credentials");
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date()
    }
  });

  logger.info("auth.login.succeeded", {
    userId: user.id,
    email: redactEmail(email)
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? "")
  });

  if (!parsed.success) {
    redirect("/register?error=invalid_input");
  }
  
  const { name, email, password } = parsed.data;
  await enforceRateLimit(`register:${hashForLogs(email)}`, 5, 60 * 15, "/register?error=too_many_attempts");

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    logger.warn("auth.register.duplicate", {
      email: redactEmail(email)
    });
    redirect("/register?error=email_exists");
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      hashedPassword: hashPassword(password)
    }
  });

  await bootstrapUserWorkspace(user.id, `${name.split(" ")[0] ?? "My"} Workspace`);
  logger.info("auth.register.succeeded", {
    userId: user.id,
    email: redactEmail(email)
  });
  await createSession(user.id);
  redirect("/onboarding");
}

export async function sendMagicLinkAction(formData: FormData) {
  const parsed = magicLinkSchema.safeParse({
    email: String(formData.get("email") ?? "")
  });

  if (!parsed.success) {
    redirect("/login?error=missing_email");
  }
  
  const { email } = parsed.data;
  await enforceRateLimit(`magic-link:${hashForLogs(email)}`, 5, 60 * 15, "/login?error=too_many_attempts");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await db.magicLink.create({
    data: {
      email,
      token,
      expiresAt
    }
  });

  const verifyUrl = `${getAppUrl()}/verify?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    await sendEmail({
      to: email,
      subject: "Your PulseBoard sign-in link",
      html: `<p>Sign in to PulseBoard:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
    });
  }

  logger.info("auth.magic_link.sent", {
    email: redactEmail(email)
  });
  redirect(`/verify?sent=1&email=${encodeURIComponent(email)}${process.env.RESEND_API_KEY ? "" : `&token=${token}`}`);
}

export async function verifyMagicLinkAction(token: string) {
  const sanitizedToken = sanitizeToken(token);
  await enforceRateLimit(`verify-magic-link:${hashForLogs(sanitizedToken)}`, 15, 60 * 15, "/verify?error=too_many_attempts");

  const magicLink = await db.magicLink.findUnique({
    where: { token: sanitizedToken }
  });

  if (!magicLink || magicLink.usedAt || magicLink.expiresAt < new Date()) {
    logger.warn("auth.magic_link.invalid", {
      tokenHash: hashForLogs(sanitizedToken)
    });
    redirect("/verify?error=invalid_token");
  }

  let user = await db.user.findUnique({
    where: { email: magicLink.email }
  });

  if (!user) {
    user = await db.user.create({
      data: {
        email: magicLink.email,
        name: magicLink.email.split("@")[0]
      }
    });

    await bootstrapUserWorkspace(user.id, `${user.name ?? "New"} Workspace`);
  }

  await db.magicLink.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() }
  });

  logger.info("auth.magic_link.verified", {
    userId: user.id,
    email: redactEmail(user.email)
  });
  await createSession(user.id);
  redirect("/dashboard");
}
