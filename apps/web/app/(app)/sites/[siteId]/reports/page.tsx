import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function ReportsPage() {
  return (
    <GenericListPage
      title="Reports"
      description="Scheduled daily, weekly, and monthly summaries route through the worker and email package."
      items={["Daily KPI digest", "Monday executive report", "Monthly acquisition review"]}
    />
  );
}

