import { createOpenAI, openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import {
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_GROQ_MODEL,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL
} from "./constants";

export interface InsightContext {
  siteName: string;
  summary: string;
}

export interface InsightResult {
  text: string;
  provider: "ollama" | "groq" | "deepseek" | "openai" | "fallback";
  model: string;
}

function buildPrompt(prompt: string, context: InsightContext) {
  return [
    "You are PulseBoard AI.",
    "You analyze product and website analytics for operators, founders, and marketers.",
    "Use only the supplied analytics context and be explicit when the data is incomplete.",
    `Site: ${context.siteName}`,
    `Context: ${context.summary}`,
    `User question: ${prompt}`
  ].join("\n");
}

async function tryOllama(prompt: string, context: InsightContext) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      prompt: buildPrompt(prompt, context)
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

  if (!response) {
    return null;
  }

  return {
    text: response,
    provider: "ollama" as const,
    model: OLLAMA_MODEL
  };
}

async function tryOpenAICompatible(
  provider: "groq" | "deepseek",
  prompt: string,
  context: InsightContext
) {
  const apiKey = provider === "groq" ? process.env.GROQ_KEY : process.env.DEEPSEEK_KEY;

  if (!apiKey) {
    return null;
  }

  const baseURL =
    provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.deepseek.com/v1";
  const model =
    provider === "groq"
      ? process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL
      : process.env.DEEPSEEK_MODEL ?? DEFAULT_DEEPSEEK_MODEL;
  const compatibleProvider = createOpenAI({
    apiKey,
    baseURL
  });

  try {
    const result = await generateText({
      model: compatibleProvider(model),
      system: `You are PulseBoard AI. Use only this analytics context:\n${context.summary}`,
      prompt
    });

    if (!result.text.trim()) {
      return null;
    }

    return {
      text: result.text,
      provider,
      model
    };
  } catch {
    return null;
  }
}

async function tryOpenAI(prompt: string, context: InsightContext) {
  if (process.env.OPENAI_API_KEY) {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are PulseBoard AI. Use only this context:\n${context.summary}`,
      prompt
    });

    return {
      text: result.text,
      provider: "openai" as const,
      model: "gpt-4o-mini"
    };
  }

  return null;
}

export async function generateInsight(prompt: string, context: InsightContext): Promise<InsightResult> {
  const ollamaResult = await tryOllama(prompt, context);

  if (ollamaResult) {
    return ollamaResult;
  }

  // Groq is a strong low-latency fallback for quick analytics answers.
  const groqResult = await tryOpenAICompatible("groq", prompt, context);
  if (groqResult) {
    return groqResult;
  }

  // DeepSeek is a useful reasoning-heavy fallback when Ollama or Groq is unavailable.
  const deepseekResult = await tryOpenAICompatible("deepseek", prompt, context);
  if (deepseekResult) {
    return deepseekResult;
  }

  const openAIResult = await tryOpenAI(prompt, context);
  if (openAIResult) {
    return openAIResult;
  }

  return {
    text: [
      `PulseBoard AI summary for ${context.siteName}:`,
      context.summary,
      `Recommended next step: ${prompt}`
    ].join("\n\n"),
    provider: "fallback",
    model: "rule-based-summary"
  };
}
