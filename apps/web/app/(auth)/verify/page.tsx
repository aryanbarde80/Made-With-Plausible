import { Card } from "@pulseboard/ui";

import { verifyMagicLinkAction } from "../actions";

export default async function VerifyPage({
  searchParams
}: {
  searchParams?: { token?: string; sent?: string; email?: string; error?: string };
}) {
  if (searchParams?.token) {
    await verifyMagicLinkAction(searchParams.token);
  }

  return (
    <Card className="w-full max-w-lg space-y-4">
      <h1 className="text-3xl font-semibold">Check your email</h1>
      {searchParams?.error ? <p className="text-rose-600">That magic link is invalid or expired.</p> : null}
      <p className="text-zinc-600">
        {searchParams?.sent
          ? `We prepared a magic link for ${searchParams.email ?? "your inbox"}.`
          : "Magic links land here and complete sign-in automatically."}
      </p>
      {searchParams?.token ? null : searchParams?.sent && !process.env.SMTP_HOST ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          SMTP is not configured, so for local/demo usage you can open the magic link from the URL token directly.
        </p>
      ) : null}
    </Card>
  );
}
