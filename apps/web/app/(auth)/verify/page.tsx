import { Card } from "@pulseboard/ui";

export default function VerifyPage() {
  return (
    <Card className="w-full max-w-lg space-y-4">
      <h1 className="text-3xl font-semibold">Check your email</h1>
      <p className="text-zinc-600">Magic links land here. In production this route verifies the signed token and starts a session.</p>
    </Card>
  );
}

