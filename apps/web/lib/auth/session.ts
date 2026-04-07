import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { db } from "@pulseboard/db";

const DEFAULT_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "pulseboard.session";

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });

  cookies().set(DEFAULT_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });

  return token;
}

export async function destroySession() {
  const token = cookies().get(DEFAULT_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({
      where: { token }
    });
  }

  cookies().delete(DEFAULT_COOKIE_NAME);
}

export async function getCurrentSession() {
  const token = cookies().get(DEFAULT_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: {
        include: {
          memberships: {
            include: {
              org: true
            },
            orderBy: {
              invitedAt: "asc"
            }
          }
        }
      }
    }
  });

  if (!session) {
    cookies().delete(DEFAULT_COOKIE_NAME);
    return null;
  }

  const primaryMembership = session.user.memberships[0] ?? null;

  return {
    token: session.token,
    user: session.user,
    org: primaryMembership?.org ?? null,
    membership: primaryMembership
  };
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function bootstrapUserWorkspace(userId: string, orgName: string) {
  const baseSlug = slugify(orgName);
  const slug = await getAvailableSlug(baseSlug);

  const organization = await db.organization.create({
    data: {
      name: orgName,
      slug,
      ownerId: userId,
      pageviewLimit: 10000,
      siteLimit: 1,
      memberLimit: 5
    }
  });

  await db.organizationMember.create({
    data: {
      orgId: organization.id,
      userId,
      role: "OWNER"
    }
  });

  return organization;
}

async function getAvailableSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 1;

  while (await db.organization.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "workspace";
}
