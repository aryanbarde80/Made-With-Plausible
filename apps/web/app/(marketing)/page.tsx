import Link from "next/link";

import { Button, Card } from "@pulseboard/ui";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">
      <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            Plausible-powered analytics for product teams
          </p>
          <h1 className="mt-8 max-w-4xl text-6xl font-semibold tracking-tight text-zinc-950">
            PulseBoard turns raw traffic into a living, collaborative operating system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Self-hosted analytics, multi-tenant workspaces, AI insights, plugins, dashboards, alerts, reports, and live
            collaboration in one opinionated SaaS platform.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register"><Button>Create Workspace</Button></Link>
            <Link href="/open"><Button variant="ghost">View Open Analytics</Button></Link>
          </div>
        </div>
        <Card className="overflow-hidden bg-zinc-950 text-white">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Visitors", "124.3k"],
                ["Pageviews", "420.1k"],
                ["Bounce", "38.4%"],
                ["Realtime", "28"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-zinc-400">{label}</p>
                  <p className="mt-3 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-violet-500/25 via-sky-400/10 to-transparent p-6">
              <p className="text-sm text-zinc-300">AI Insight</p>
              <p className="mt-3 text-lg leading-7 text-zinc-100">
                Organic search is accelerating faster than pageview growth, which suggests better landing page relevance
                and stronger intent alignment.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

