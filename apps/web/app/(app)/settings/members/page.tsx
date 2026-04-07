import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function MembersPage() {
  return <GenericListPage title="Members" description="Invite teammates, change roles, and manage workspace access." items={["Owner", "Admin", "Analyst", "Viewer"]} />;
}

