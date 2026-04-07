import Link from "next/link";
import { Card } from "@pulseboard/ui";

import { loginAction, sendMagicLinkAction } from "../actions";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <Card className="w-full max-w-md space-y-5">
      <h1 className="text-3xl font-semibold text-zinc-950">Welcome back</h1>
      {searchParams?.error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Could not sign you in. Check your credentials and try again.</p>
      ) : null}
      <form action={loginAction} className="space-y-4">
        <input className="w-full rounded-2xl border p-3" placeholder="Email" name="email" type="email" />
        <input className="w-full rounded-2xl border p-3" placeholder="Password" name="password" type="password" />
        <button className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-medium text-white">Sign in</button>
      </form>
      <form action={sendMagicLinkAction} className="space-y-4">
        <input className="w-full rounded-2xl border p-3" placeholder="Email for magic link" name="email" type="email" />
        <button className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white">Send magic link</button>
      </form>
      <p className="text-sm text-zinc-500">
        Need an account? <Link href="/register" className="text-violet-600">Create one</Link>
      </p>
    </Card>
  );
}
