"use server";

import { randomBytes } from "node:crypto";

import { redirect } from "next/navigation";

import { db } from "@pulseboard/db";
import { sendEmail } from "@pulseboard/email";

import { hashPassword, verifyPassword } from "../../lib/auth/password";
import { bootstrapUserWorkspace, createSession } from "../../lib/auth/session";
import { getAppUrl } from "../../lib/env";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user || !verifyPassword(password, user.hashedPassword)) {
    redirect("/login?error=invalid_credentials");
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date()
    }
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    redirect("/register?error=invalid_input");
  }

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
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
  await createSession(user.id);
  redirect("/onboarding");
}

export async function sendMagicLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect("/login?error=missing_email");
  }

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

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendEmail({
      to: email,
      subject: "Your PulseBoard sign-in link",
      html: `<p>Sign in to PulseBoard:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
    });
  }

  redirect(`/verify?sent=1&email=${encodeURIComponent(email)}${process.env.SMTP_HOST ? "" : `&token=${token}`}`);
}

export async function verifyMagicLinkAction(token: string) {
  const magicLink = await db.magicLink.findUnique({
    where: { token }
  });

  if (!magicLink || magicLink.usedAt || magicLink.expiresAt < new Date()) {
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

  await createSession(user.id);
  redirect("/dashboard");
}

