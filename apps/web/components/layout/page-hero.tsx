import { Card } from "@pulseboard/ui";

export function PageHero({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-zinc-950 via-violet-950 to-sky-950 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl text-zinc-200">{description}</p>
    </Card>
  );
}

