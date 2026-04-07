import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function ApiKeysPage() {
  return <GenericListPage title="API keys" description="Create scoped API credentials with plan-aware rate limits and expiration." items={["Production reporting key", "Internal BI sync key"]} />;
}

