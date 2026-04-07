import Link from "next/link";
import { Card } from "@pulseboard/ui";
import { sites } from "../../../lib/mock-data";

export default function SitesPage() {
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
        {sites.map((site) => (
          <Card key={site.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-zinc-950">{site.domain}</p>
              <p className="text-sm text-zinc-500">{site.timezone}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
              <span>{site.visitors.toLocaleString()} visitors</span>
              <span>{site.pageviews.toLocaleString()} pageviews</span>
              <span>{site.bounceRate}% bounce</span>
            </div>
            <Link href={`/sites/${site.id}`} className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
              Open site
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

