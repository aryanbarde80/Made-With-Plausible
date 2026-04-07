import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function InvitesPage() {
  return <GenericListPage title="Pending invites" description="Track outstanding invites and resend expiring magic links." items={["maya@acme.dev", "arjun@acme.dev"]} />;
}

