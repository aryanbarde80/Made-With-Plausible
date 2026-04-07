import { db, OrgPlan, Role } from "../src";

async function main() {
  const user = await db.user.upsert({
    where: { email: "admin@pulseboard.dev" },
    update: {},
    create: {
      email: "admin@pulseboard.dev",
      name: "PulseBoard Admin",
      role: Role.SUPERADMIN,
      hashedPassword: "demo-password-hash"
    }
  });

  const org = await db.organization.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo",
      plan: OrgPlan.PRO,
      ownerId: user.id,
      pageviewLimit: 1000000,
      siteLimit: 5,
      memberLimit: 20
    }
  });

  await db.organizationMember.upsert({
    where: {
      orgId_userId: {
        orgId: org.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      orgId: org.id,
      userId: user.id,
      role: "OWNER"
    }
  });

  const site = await db.site.upsert({
    where: { id: "demo-site" },
    update: {},
    create: {
      id: "demo-site",
      domain: "demo.pulseboard.dev",
      orgId: org.id,
      timezone: "Asia/Kolkata",
      isVerified: true,
      verificationToken: "pulse-demo",
      plausibleSiteId: "demo-site"
    }
  });

  await db.dashboard.upsert({
    where: { id: "default-dashboard" },
    update: {},
    create: {
      id: "default-dashboard",
      name: "Executive Overview",
      siteId: site.id,
      orgId: org.id,
      createdById: user.id,
      isDefault: true,
      isShared: true,
      shareToken: "demo-dashboard",
      layout: []
    }
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });

