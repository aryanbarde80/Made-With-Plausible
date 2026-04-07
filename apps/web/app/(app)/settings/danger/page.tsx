import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function DangerPage() {
  return <GenericListPage title="Danger zone" description="Export data, rotate credentials, or delete an organization with full audit trails." items={["Export workspace data", "Delete organization"]} />;
}

