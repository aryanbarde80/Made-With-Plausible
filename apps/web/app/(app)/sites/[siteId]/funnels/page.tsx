import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function FunnelsPage() {
  return (
    <GenericListPage
      title="Funnels"
      description="Visualize drop-off between core milestones and expose conversion bottlenecks."
      items={["Landing → Pricing → Sign Up", "Docs → Demo Request → Closed Won"]}
    />
  );
}

