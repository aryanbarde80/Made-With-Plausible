import { createOpenAI, openai } from "@ai-sdk/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { generateText } from "ai";

import {
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_GROQ_MODEL,
  DEFAULT_OPENROUTER_EMBEDDING_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL
} from "./constants";

export interface InsightContext {
  siteName: string;
  summary: string;
}

export interface InsightResult {
  text: string;
  provider: "ollama" | "groq" | "deepseek" | "openrouter" | "openai" | "fallback";
  model: string;
}

export interface SearchMatch {
  id: string;
  title: string;
  content: string;
  score: number;
}

const insightPromptTemplate = PromptTemplate.fromTemplate(
  [
    "You are PulseBoard AI.",
    "You analyze product and website analytics for operators, founders, and marketers.",
    "Use only the supplied analytics context and be explicit when the data is incomplete.",
    "Site: {siteName}",
    "Context: {summary}",
    "User question: {prompt}",
    "Respond with concise analysis and concrete next steps."
  ].join("\n")
);

async function buildPrompt(prompt: string, context: InsightContext) {
  return insightPromptTemplate.format({
    prompt,
    siteName: context.siteName,
    summary: context.summary
  });
}

async function tryOllama(prompt: string, context: InsightContext) {
  const compiledPrompt = await buildPrompt(prompt, context);
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      prompt: compiledPrompt
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
  provider: "groq" | "deepseek" | "openrouter",
  prompt: string,
  context: InsightContext
) {
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_KEY
      : provider === "deepseek"
        ? process.env.DEEPSEEK_KEY
        : process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const baseURL =
    provider === "groq"
      ? "https://api.groq.com/openai/v1"
      : provider === "deepseek"
        ? "https://api.deepseek.com/v1"
        : "https://openrouter.ai/api/v1";
  const model =
    provider === "groq"
      ? process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL
      : provider === "deepseek"
        ? process.env.DEEPSEEK_MODEL ?? DEFAULT_DEEPSEEK_MODEL
        : process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;
  const compatibleProvider = createOpenAI({
    apiKey,
    baseURL
  });

  try {
    const chainModel = new ChatOpenAI({
      apiKey,
      model,
      configuration: {
        baseURL
      }
    });
    const chain = insightPromptTemplate.pipe(chainModel).pipe(new StringOutputParser());
    const chainedText = (await chain.invoke({
      prompt,
      siteName: context.siteName,
      summary: context.summary
    })).trim();

    if (chainedText) {
      return {
        text: chainedText,
        provider,
        model
      };
    }

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
    const chainModel = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini"
    });
    const chain = insightPromptTemplate.pipe(chainModel).pipe(new StringOutputParser());
    const chainedText = (await chain.invoke({
      prompt,
      siteName: context.siteName,
      summary: context.summary
    })).trim();

    if (chainedText) {
      return {
        text: chainedText,
        provider: "openai" as const,
        model: "gpt-4o-mini"
      };
    }

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

  const openRouterResult = await tryOpenAICompatible("openrouter", prompt, context);
  if (openRouterResult) {
    return openRouterResult;
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

function hashEmbedding(text: string, dimensions = 24) {
  const vector = new Array<number>(dimensions).fill(0);

  for (let index = 0; index < text.length; index += 1) {
    const bucket = index % dimensions;
    vector[bucket] += text.charCodeAt(index) / 255;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

export async function generateEmbedding(text: string) {
  const input = text.trim();

  if (!input) {
    return hashEmbedding("empty");
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_EMBEDDING_MODEL ?? DEFAULT_OPENROUTER_EMBEDDING_MODEL,
          input
        })
      });

      if (response.ok) {
        const json = (await response.json()) as {
          data?: Array<{ embedding?: number[] }>;
        };
        const embedding = json.data?.[0]?.embedding;

        if (embedding?.length) {
          return embedding;
        }
      }
    } catch {
      // deterministic fallback below
    }
  }

  return hashEmbedding(input);
}

export function cosineSimilarity(left: number[], right: number[]) {
  const limit = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < limit; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  const divisor = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude) || 1;
  return dot / divisor;
}

export function rankSearchDocuments(
  queryEmbedding: number[],
  documents: Array<{ id: string; title: string; content: string; embedding: unknown }>,
  limit = 5
): SearchMatch[] {
  return documents
    .map((document) => ({
      id: document.id,
      title: document.title,
      content: document.content,
      score: cosineSimilarity(
        queryEmbedding,
        Array.isArray(document.embedding) ? (document.embedding as number[]) : []
      )
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
