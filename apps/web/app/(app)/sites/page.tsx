import Link from "next/link";
import { Card } from "@pulseboard/ui";

import { db } from "@pulseboard/db";

import { requireSession } from "../../../lib/auth/session";

type SiteRecord = Awaited<ReturnType<typeof db.site.findMany>>[number];

export default async function SitesPage() {
  const session = await requireSession();
  const sites = (session.org
    ? await db.site.findMany({
        where: { orgId: session.org.id },
        orderBy: { createdAt: "desc" }
      })
    : []) as Awaited<ReturnType<typeof db.site.findMany>>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-950">Sites</h2>
          <p className="text-zinc-600">Manage domains, verification state, and traffic rollups.</p>
        </div>
        <Link href="/sites/new" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white">Add site</Link>
      </div>
      <div className="grid gap-4">
        {sites.length ? (
          sites.map((site: SiteRecord) => (
            <Card key={site.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-semibold text-zinc-950">{site.domain}</p>
                <p className="text-sm text-zinc-500">{site.timezone}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                <span>{site.isVerified ? "Verified" : "Pending verification"}</span>
                <span>{site.isPublic ? "Public" : "Private"}</span>
              </div>
              <Link href={`/sites/${site.id}`} className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
                Open site
              </Link>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-lg font-medium text-zinc-900">No sites yet</p>
            <p className="mt-2 text-zinc-600">Create your first site to start tracking traffic and collaboration.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
