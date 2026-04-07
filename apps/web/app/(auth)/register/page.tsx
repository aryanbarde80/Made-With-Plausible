import { Card } from "@pulseboard/ui";

import { registerAction } from "../actions";

export default function RegisterPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <Card className="w-full max-w-md space-y-5">
      <h1 className="text-3xl font-semibold text-zinc-950">Create your workspace</h1>
      {searchParams?.error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">That signup could not be completed. Use a unique email and an 8+ character password.</p>
      ) : null}
      <form action={registerAction} className="space-y-4">
        <input className="w-full rounded-2xl border p-3" placeholder="Full name" name="name" />
        <input className="w-full rounded-2xl border p-3" placeholder="Email" name="email" type="email" />
        <input className="w-full rounded-2xl border p-3" placeholder="Password" name="password" type="password" />
        <button className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white">Create account</button>
      </form>
    </Card>
  );
}
