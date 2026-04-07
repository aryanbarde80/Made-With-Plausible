import { Card } from "@pulseboard/ui";

const steps = [
  "Create organization",
  "Invite teammates",
  "Add first site",
  "Verify ownership",
  "Install tracking script",
  "Configure first alert"
];

export default function OnboardingPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="bg-zinc-950 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">6-step wizard</p>
        <h2 className="mt-4 text-3xl font-semibold">Go live in minutes, not meetings.</h2>
      </Card>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step} className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-violet-700">
              {index + 1}
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900">{step}</p>
              <p className="text-sm text-zinc-500">Progress is designed to persist in the database so users can resume onboarding anytime.</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

