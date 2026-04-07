import { AppShell } from "../../components/layout/app-shell";
import { requireSession } from "../../lib/auth/session";
import { logoutAction } from "./actions";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession().catch(() => null);

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell
      title="Workspace"
      subtitle="Multi-tenant analytics, collaboration, plugins, and AI insights running on a modern SaaS backbone."
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
