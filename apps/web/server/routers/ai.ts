import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";
import { generateInsight } from "@pulseboard/ai-engine";

export const aiRouter = createTRPCRouter({
  ask: publicProcedure.input(z.object({ prompt: z.string() })).mutation(async ({ input }) => {
    const response = await generateInsight(input.prompt, {
      siteName: "demo.pulseboard.dev",
      summary:
        "Last 30 days: 12.3k visitors, 44.8k pageviews, organic search is the strongest source, pricing page traffic is growing, bounce rate is improving."
    });

    return { response };
  }),
  getHistory: publicProcedure.query(() => []),
  save: publicProcedure.input(z.object({ id: z.string() })).mutation(() => ({ ok: true })),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(() => ({ ok: true })),
  feedback: publicProcedure.input(z.object({ id: z.string(), feedback: z.enum(["GOOD", "BAD"]) })).mutation(() => ({ ok: true }))
});
