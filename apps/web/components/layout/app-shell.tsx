"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, LayoutDashboard, Plug, Settings, Shield, Zap } from "lucide-react";

export function AppShell({
  children,
  title,
  subtitle,
  userName,
  logoutSlot
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  userName?: string | null;
  logoutSlot?: React.ReactNode;
}) {
  const pathname = usePathname();
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
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-[300px_1fr]">
      <aside className="relative border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_30%),linear-gradient(180deg,#09090b_0%,#111827_55%,#0f172a_100%)] px-6 py-8 text-zinc-100">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30" />
        <div className="relative">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 font-semibold text-white">
            P
          </div>
          <div>
            <p className="text-lg font-semibold">PulseBoard</p>
            <p className="text-sm text-zinc-400">Analytics OS</p>
          </div>
        </Link>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Trust Layer</p>
          <div className="mt-4 grid gap-3">
            {[
              ["Realtime synced", "Ably collaboration is live-ready"],
              ["Secure by default", "Headers, session guards, and rate limits"],
              ["AI multi-provider", "Ollama, Groq, DeepSeek, OpenAI"]
            ].map(([label, copy]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-1 text-xs text-zinc-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <nav className="mt-10 space-y-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "bg-white text-zinc-950 shadow-lg shadow-sky-500/10"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        </div>
      </aside>
      <main className="relative px-5 py-6 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.10),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,#fcfcfd_0%,#f8fafc_28%,#ffffff_100%)]" />
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-200/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">PulseBoard Workspace</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-zinc-600">{subtitle}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Private analytics", "Multi-tenant SaaS", "Production-ready workflows"].map((chip) => (
                <span key={chip} className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {userName ? (
              <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
                {userName}
              </div>
            ) : null}
            <div className="rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20">You + 2 teammates viewing</div>
            {logoutSlot}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
