import { BreakdownTable } from "../../../components/dashboard/breakdown-table";
import { PageHero } from "../../../components/layout/page-hero";
import { breakdownRows } from "../../../lib/mock-data";

export default function SuperadminPage() {
  return (
    <div className="space-y-6">
      <PageHero eyebrow="Platform overview" title="Superadmin control center" description="Watch org growth, plan distribution, plugin adoption, and platform health from one privileged workspace." />
      <BreakdownTable title="Top orgs by pageview volume" rows={breakdownRows} />
    </div>
  );
}

