import { Card } from "@pulseboard/ui";

export default function DashboardBuilderPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <Card className="grid min-h-[620px] grid-cols-2 gap-4 bg-zinc-100 p-4">
        {["STAT_CARD", "LINE_CHART", "BAR_CHART", "TABLE"].map((widget) => (
          <div key={widget} className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-5">
            <p className="text-sm text-zinc-500">{widget}</p>
            <p className="mt-3 text-lg font-semibold text-zinc-900">Drag-ready widget zone</p>
          </div>
        ))}
      </Card>
      <Card className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-950">Add widget</h3>
        {["STAT_CARD", "LINE_CHART", "BAR_CHART", "TABLE", "FUNNEL", "GOAL_PROGRESS", "MAP", "TEXT"].map((widget) => (
          <button key={widget} className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm text-zinc-700">
            {widget}
          </button>
        ))}
      </Card>
    </div>
  );
}

