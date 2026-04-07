import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function DashboardsPage() {
  return (
    <GenericListPage
      title="Dashboards"
      description="Compose widget-driven dashboards and share live read-only links with stakeholders."
      items={["Executive Overview", "Growth Team Ops", "Content Performance", "Revenue Funnel"]}
    />
  );
}

