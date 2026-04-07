import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function OrganizationSettingsPage() {
  return <GenericListPage title="Organization settings" description="Control branding, slug, custom domain, and workspace defaults." items={["Name and slug", "Logo upload", "Custom domain", "Usage and plan"]} />;
}

