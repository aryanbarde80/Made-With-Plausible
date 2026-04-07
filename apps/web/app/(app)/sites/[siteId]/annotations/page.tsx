import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function AnnotationsPage() {
  return (
    <GenericListPage
      title="Annotations"
      description="Timeline notes land on charts and are broadcast in realtime to collaborators on the same site."
      items={["Homepage redesign shipped", "Campaign launch: Spring 2026", "Pricing experiment A/B test"]}
    />
  );
}

