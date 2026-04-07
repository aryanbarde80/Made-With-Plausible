import { Card } from "@pulseboard/ui";

export function RealtimeBoard() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Current visitors</p>
            <p className="mt-2 text-6xl font-semibold text-zinc-950">28</p>
          </div>
          <div className="flex size-28 items-center justify-center rounded-full border-8 border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700">
            Live
          </div>
        </div>
        <div className="grid h-[320px] place-items-center rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.18),_transparent_55%),linear-gradient(135deg,#0f172a,#111827)] text-white">
          <p className="max-w-md text-center text-lg text-zinc-200">
            World map hotspot layer connects Ably presence with Plausible realtime events and fades visitor dots after 30 seconds.
          </p>
        </div>
      </Card>
      <div className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold text-zinc-950">Live feed</h3>
          {[
            "/pricing · Google · India · Mobile",
            "/blog/launch · X · United States · Desktop",
            "/docs/plugins · Direct · Germany · Desktop"
          ].map((event) => (
            <div key={event} className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
              {event}
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold text-zinc-950">Teammates watching</h3>
          <p className="text-zinc-600">You, Maya, and Arjun are viewing this dashboard right now via `site:demo-site:presence`.</p>
        </Card>
      </div>
    </div>
  );
}

