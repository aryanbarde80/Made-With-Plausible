import { Card } from "@pulseboard/ui";
import type { InsightMessage } from "@pulseboard/types";

export function InsightChat({ messages }: { messages: InsightMessage[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <Card className="space-y-6">
        <div>
          <p className="text-sm text-zinc-500">AI Insight Engine</p>
          <h3 className="text-2xl font-semibold text-zinc-950">Ask PulseBoard about your traffic</h3>
        </div>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={message.role === "assistant" ? "rounded-3xl bg-zinc-950 p-5 text-white" : "rounded-3xl bg-zinc-100 p-5 text-zinc-900"}>
              <p className="text-xs uppercase tracking-[0.3em] opacity-70">{message.role}</p>
              <p className="mt-3 leading-7">{message.content}</p>
            </div>
          ))}
        </div>
        <textarea className="min-h-28 w-full rounded-3xl border p-4" placeholder="Why did traffic drop last Tuesday?" />
      </Card>
      <Card className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-950">Suggested prompts</h3>
        {[
          "Which pages have the worst bounce rate?",
          "What is my fastest growing traffic source?",
          "Give me 3 ideas to improve conversions"
        ].map((prompt) => (
          <button key={prompt} className="w-full rounded-2xl bg-zinc-100 px-4 py-4 text-left text-sm text-zinc-700 transition hover:bg-zinc-200">
            {prompt}
          </button>
        ))}
      </Card>
    </div>
  );
}

