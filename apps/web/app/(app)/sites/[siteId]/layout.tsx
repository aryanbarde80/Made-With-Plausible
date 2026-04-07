import { AppShell } from "../../../../components/layout/app-shell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="demo.pulseboard.dev"
      subtitle="Date ranges, saved filters, exports, annotations, AI, dashboards, and plugins all live inside the site workspace."
    >
      {children}
    </AppShell>
  );
}

