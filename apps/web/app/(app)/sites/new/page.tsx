import { Card } from "@pulseboard/ui";

export default function NewSitePage() {
  return (
    <Card className="max-w-3xl space-y-5">
      <h2 className="text-3xl font-semibold text-zinc-950">Add a new site</h2>
      <input className="w-full rounded-2xl border p-3" placeholder="https://example.com" />
      <select className="w-full rounded-2xl border p-3">
        <option>Asia/Kolkata</option>
        <option>UTC</option>
        <option>America/New_York</option>
      </select>
      <button className="rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white">Create site</button>
    </Card>
  );
}

