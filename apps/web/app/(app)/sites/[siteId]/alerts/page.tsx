import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function AlertsPage() {
  return (
    <GenericListPage
      title="Alerts"
      description="BullMQ checks metrics every five minutes and dispatches email, webhook, or Slack notifications."
      items={["Traffic spike > 100 visitors/hour", "Bounce rate above 60%", "Goal completions drop 20% week over week"]}
    />
  );
}

