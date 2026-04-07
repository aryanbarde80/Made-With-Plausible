import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";

export const aiRouter = createTRPCRouter({
  ask: publicProcedure.input(z.object({ prompt: z.string() })).mutation(({ input }) => ({
    response: `AI summary: ${input.prompt}`
  })),
  getHistory: publicProcedure.query(() => []),
  save: publicProcedure.input(z.object({ id: z.string() })).mutation(() => ({ ok: true })),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(() => ({ ok: true })),
  feedback: publicProcedure.input(z.object({ id: z.string(), feedback: z.enum(["GOOD", "BAD"]) })).mutation(() => ({ ok: true }))
});

