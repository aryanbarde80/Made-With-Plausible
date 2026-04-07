import Link from "next/link";
import { BarChart3, Bot, LayoutDashboard, Plug, Settings, Shield, Zap } from "lucide-react";

export function AppShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const nav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/sites/demo-site", label: "Analytics", icon: BarChart3 },
    { href: "/sites/demo-site/realtime", label: "Realtime", icon: Zap },
    { href: "/sites/demo-site/ai", label: "AI Insights", icon: Bot },
    { href: "/settings/plugins", label: "Plugins", icon: Plug },
    { href: "/settings/organization", label: "Settings", icon: Settings },
    { href: "/superadmin", label: "Superadmin", icon: Shield }
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-white/10 bg-zinc-950 px-6 py-8 text-zinc-100">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 font-semibold text-white">
            P
          </div>
          <div>
            <p className="text-lg font-semibold">PulseBoard</p>
            <p className="text-sm text-zinc-400">Analytics OS</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="px-5 py-6 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-200/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">PulseBoard Workspace</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-zinc-600">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">Acme Labs</div>
            <div className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white">You + 2 teammates viewing</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

