import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { OLLAMA_BASE_URL, OLLAMA_MODEL } from "./constants";

export interface InsightContext {
  siteName: string;
  summary: string;
}

export async function generateInsight(prompt: string, context: InsightContext) {
  const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      prompt: [
        "You are PulseBoard AI.",
        `Site: ${context.siteName}`,
        `Context: ${context.summary}`,
        `User question: ${prompt}`
      ].join("\n")
    })
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Ollama request failed with ${response.status}`);
      }

      const json = (await response.json()) as { response?: string };
      return json.response?.trim() ?? "";
    })
    .catch(() => "");

  if (ollamaResponse) {
    return ollamaResponse;
  }

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
