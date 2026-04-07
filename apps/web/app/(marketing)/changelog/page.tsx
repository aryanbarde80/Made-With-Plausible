import { Card } from "@pulseboard/ui";

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-5xl font-semibold text-zinc-950">Changelog</h1>
      <div className="mt-10 space-y-6">
        {[
          "Introduced live collaboration channels for dashboards and annotations.",
          "Added AI insight chat with self-hosted Ollama fallback.",
          "Shipped plugin runtime and built-in marketplace widgets."
        ].map((item, index) => (
          <Card key={item}>
            <p className="text-sm text-zinc-500">Release #{index + 1}</p>
            <p className="mt-3 text-lg text-zinc-800">{item}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}

