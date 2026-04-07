import { AppShell } from "../../../../components/layout/app-shell";
import { db } from "@pulseboard/db";

import { requireSession } from "../../../../lib/auth/session";
import { logoutAction } from "../../actions";

export default async function SiteLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  const session = await requireSession();
  const site = await db.site.findFirst({
    where: {
      id: params.siteId,
      orgId: session.org?.id
    }
  });

  return (
    <AppShell
      title={site?.domain ?? "Site"}
      subtitle="Date ranges, saved filters, exports, annotations, AI, dashboards, and plugins all live inside the site workspace."
      userName={session.user.name ?? session.user.email}
      logoutSlot={
        <form action={logoutAction}>
          <button className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
            Log out
          </button>
        </form>
      }
    >
      {children}
    </AppShell>
  );
}
