import { GenericListPage } from "../../../../components/layout/generic-list-page";

export default function ProfileSettingsPage() {
  return <GenericListPage title="Profile settings" description="Update identity, password, avatar, and 2FA preferences." items={["Display name", "Password", "Avatar", "Two-factor authentication"]} />;
}

