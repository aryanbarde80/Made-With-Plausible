"use server";

import { redirect } from "next/navigation";

import { db } from "@pulseboard/db";

import { destroySession, requireSession } from "../../lib/auth/session";

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function createSiteAction(formData: FormData) {
  const session = await requireSession();
  const domain = String(formData.get("domain") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "UTC").trim();

  if (!session.org || !domain) {
    redirect("/sites/new?error=invalid_input");
  }

  const existingSite = await db.site.findFirst({
    where: {
      orgId: session.org.id,
      domain
    }
  });

  if (existingSite) {
    redirect(`/sites/${existingSite.id}`);
  }

  const site = await db.site.create({
    data: {
      domain,
      orgId: session.org.id,
      timezone,
      verificationToken: crypto.randomUUID(),
      settings: {}
    }
  });

  await db.dashboard.create({
    data: {
      name: "Default Dashboard",
      siteId: site.id,
      orgId: session.org.id,
      createdById: session.user.id,
      isDefault: true,
      layout: []
    }
  });

  redirect(`/sites/${site.id}`);
}
