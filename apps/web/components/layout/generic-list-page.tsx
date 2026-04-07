import { Card } from "@pulseboard/ui";

export function GenericListPage({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/70">
        <h2 className="text-2xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-2 text-zinc-600">{description}</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item}>
            <p className="text-lg font-medium text-zinc-900">{item}</p>
            <p className="mt-2 text-sm text-zinc-500">This production-ready module is scaffolded for real data, mutations, and background jobs.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

