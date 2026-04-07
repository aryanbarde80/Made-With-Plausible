import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function SuperadminOrgsPage() {
  return <GenericListPage title="All organizations" description="Inspect plan, site count, member count, and impersonation controls." items={["Acme Labs", "Northstar Ventures", "PulseBoard Demo"]} />;
}

