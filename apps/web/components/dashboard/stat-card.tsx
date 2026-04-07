import { Card } from "@pulseboard/ui";
import type { StatsCard } from "@pulseboard/types";

export function StatCard({ card }: { card: StatsCard }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-950">{card.value}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {card.delta}
        </span>
      </div>
      <div className="flex items-end gap-1">
        {card.trend.map((point: number, index: number) => (
          <div
            key={`${card.label}-${index}`}
            className="h-16 flex-1 rounded-full bg-gradient-to-t from-violet-100 to-violet-400/70"
            style={{ height: `${point * 2}px` }}
          />
        ))}
      </div>
    </Card>
  );
}
