import { AppShell } from "../../components/layout/app-shell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="Workspace"
      subtitle="Multi-tenant analytics, collaboration, plugins, and AI insights running on a modern SaaS backbone."
    >
      {children}
    </AppShell>
  );
}

