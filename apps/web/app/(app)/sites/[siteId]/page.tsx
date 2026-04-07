import { BreakdownTable } from "../../../../components/dashboard/breakdown-table";
import { StatCard } from "../../../../components/dashboard/stat-card";
import { AnalyticsOverview } from "../../../../components/charts/analytics-overview";
import { breakdownRows, statsCards, trafficSeries } from "../../../../lib/mock-data";

export default function SiteAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statsCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
      <AnalyticsOverview series={trafficSeries} />
      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownTable title="Top pages" rows={breakdownRows} />
        <BreakdownTable title="Sources" rows={breakdownRows} />
      </div>
    </div>
  );
}

