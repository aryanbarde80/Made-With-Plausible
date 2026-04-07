import { Card } from "@pulseboard/ui";

const tiers = [
  ["FREE", "$0", "Solo builders testing the stack"],
  ["PRO", "$49", "Growing teams that need reports and alerts"],
  ["TEAM", "$149", "Cross-functional analytics collaboration"],
  ["ENTERPRISE", "Custom", "Large orgs with custom domains and plugins"]
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-5xl font-semibold text-zinc-950">Pricing built for teams that live in analytics.</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map(([name, price, copy]) => (
          <Card key={name} className="space-y-4">
            <p className="text-sm text-zinc-500">{name}</p>
            <p className="text-4xl font-semibold text-zinc-950">{price}</p>
            <p className="text-zinc-600">{copy}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}

