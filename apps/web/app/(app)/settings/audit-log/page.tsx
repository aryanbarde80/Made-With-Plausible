import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function AuditLogPage() {
  return <GenericListPage title="Audit log" description="Every admin action, plugin install, membership change, and alert acknowledgment is captured here." items={["User invited teammate", "Plugin installed", "API key revoked"]} />;
}

