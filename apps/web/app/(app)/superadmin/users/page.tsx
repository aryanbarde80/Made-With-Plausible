import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function SuperadminUsersPage() {
  return <GenericListPage title="All users" description="Audit user activity, reset passwords, and disable accounts when necessary." items={["admin@pulseboard.dev", "maya@acme.dev", "arjun@acme.dev"]} />;
}

