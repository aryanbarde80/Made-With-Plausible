import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-semibold text-zinc-950">PulseBoard</Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/pricing">Pricing</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/open">Open</Link>
          <Link href="/login" className="rounded-full bg-zinc-950 px-4 py-2 text-white">Launch App</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

