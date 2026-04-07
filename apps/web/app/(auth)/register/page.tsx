import { Card } from "@pulseboard/ui";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md space-y-5">
      <h1 className="text-3xl font-semibold text-zinc-950">Create your workspace</h1>
      <input className="w-full rounded-2xl border p-3" placeholder="Full name" />
      <input className="w-full rounded-2xl border p-3" placeholder="Email" />
      <input className="w-full rounded-2xl border p-3" placeholder="Password" type="password" />
      <button className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white">Create account</button>
    </Card>
  );
}

