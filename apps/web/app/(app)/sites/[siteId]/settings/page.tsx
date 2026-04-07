import { GenericListPage } from "../../../../../components/layout/generic-list-page";

export default function SiteSettingsPage() {
  return (
    <GenericListPage
      title="Site settings"
      description="Manage verification, tracking snippets, public sharing, custom properties, and danger-zone actions."
      items={["Verification", "Tracking snippet", "Public sharing", "Danger zone"]}
    />
  );
}

