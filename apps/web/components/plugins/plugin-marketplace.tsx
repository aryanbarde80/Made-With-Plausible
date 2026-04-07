import { Card } from "@pulseboard/ui";

export function PluginMarketplace() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[
        ["UTM Builder", "Generate campaign links with built-in QA."],
        ["Competitor Benchmark", "Overlay your traffic trend against static industry baselines."],
        ["Content Score", "Score top pages from depth, time, and conversion behavior."],
        ["Weekly Digest Widget", "Drop a concise executive summary widget into any dashboard."]
      ].map(([name, description]) => (
        <Card key={name} className="space-y-4">
          <p className="text-lg font-semibold text-zinc-950">{name}</p>
          <p className="text-sm text-zinc-600">{description}</p>
          <button className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white">Install plugin</button>
        </Card>
      ))}
    </div>
  );
}

