import { breakdownRows, statsCards } from "../../../lib/mock-data";
import { BreakdownTable } from "../../../components/dashboard/breakdown-table";
import { StatCard } from "../../../components/dashboard/stat-card";

export default function OpenAnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-5xl font-semibold text-zinc-950">PulseBoard open analytics</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statsCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
      <div className="mt-10">
        <BreakdownTable title="Top sources" rows={breakdownRows} />
      </div>
    </main>
  );
}

