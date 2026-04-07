import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function GoalsPage() {
  return (
    <GenericListPage
      title="Goals"
      description="Event and pageview goals connect Plausible data to funnels, alerts, and AI context."
      items={["Newsletter signup", "Demo booked", "Pricing page reach", "Checkout complete"]}
    />
  );
}

