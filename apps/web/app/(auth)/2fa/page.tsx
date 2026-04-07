import { Card } from "@pulseboard/ui";

export default function TwoFactorPage() {
  return (
    <Card className="w-full max-w-md space-y-5">
      <h1 className="text-3xl font-semibold">Two-factor challenge</h1>
      <input className="w-full rounded-2xl border p-3 tracking-[0.4em]" placeholder="123456" />
      <button className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-medium text-white">Verify code</button>
    </Card>
  );
}
