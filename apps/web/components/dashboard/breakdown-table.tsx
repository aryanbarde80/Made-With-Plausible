import { Card } from "@pulseboard/ui";
import type { BreakdownRow } from "@pulseboard/types";

export function BreakdownTable({
  title,
  rows
}: {
  title: string;
  rows: BreakdownRow[];
}) {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Breakdown</p>
          <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
        </div>
        <button className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          Open in filter
        </button>
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800">{row.label}</span>
              <span className="text-zinc-500">
                {row.value.toLocaleString()} · {row.share}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-sky-400" style={{ width: `${row.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

