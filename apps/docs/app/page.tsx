import Link from "next/link";

export default function DocsHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">PulseBoard Docs</p>
      <h1 className="mt-4 text-5xl font-semibold">Build, operate, and extend PulseBoard.</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">The docs site is wired for MDX and product documentation, with room for plugin authoring guides and deployment playbooks.</p>
      <div className="mt-10">
        <Link href="/docs/getting-started" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950">
          Getting started
        </Link>
      </div>
    </main>
  );
}

