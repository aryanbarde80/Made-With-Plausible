import { BreakdownTable } from "../../../components/dashboard/breakdown-table";
import { StatCard } from "../../../components/dashboard/stat-card";
import { AnalyticsOverview } from "../../../components/charts/analytics-overview";
import { PageHero } from "../../../components/layout/page-hero";
import { breakdownRows, statsCards, trafficSeries } from "../../../lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Org Summary"
        title="Everything your team cares about, in one view."
        description="Cross-site performance, saved filters, collaboration presence, and AI recommendations roll into a single executive dashboard."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statsCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
      <AnalyticsOverview series={trafficSeries} />
      <BreakdownTable title="Acquisition breakdown" rows={breakdownRows} />
    </div>
  );
}

