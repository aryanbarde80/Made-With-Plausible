import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export interface InsightContext {
  siteName: string;
  summary: string;
}

export async function generateInsight(prompt: string, context: InsightContext) {
  if (process.env.OPENAI_API_KEY) {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are PulseBoard AI. Use only this context:\n${context.summary}`,
      prompt
    });

    return result.text;
  }

  return [
    `PulseBoard AI summary for ${context.siteName}:`,
    context.summary,
    `Recommended next step: ${prompt}`
  ].join("\n\n");
}

