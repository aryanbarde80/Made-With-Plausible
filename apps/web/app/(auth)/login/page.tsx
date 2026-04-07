import Link from "next/link";
import { Card } from "@pulseboard/ui";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md space-y-5">
      <h1 className="text-3xl font-semibold text-zinc-950">Welcome back</h1>
      <input className="w-full rounded-2xl border p-3" placeholder="Email" />
      <input className="w-full rounded-2xl border p-3" placeholder="Password" type="password" />
      <button className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-medium text-white">Sign in</button>
      <p className="text-sm text-zinc-500">
        Need an account? <Link href="/register" className="text-violet-600">Create one</Link>
      </p>
    </Card>
  );
}

