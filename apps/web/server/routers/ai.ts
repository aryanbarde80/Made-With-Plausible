import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@pulseboard/db";
import { createTRPCRouter, publicProcedure } from "../trpc/trpc";
import { generateInsight } from "@pulseboard/ai-engine";

export const aiRouter = createTRPCRouter({
  ask: publicProcedure
    .input(z.object({ siteId: z.string(), prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const site = await db.site.findFirst({
        where: {
          id: input.siteId,
          orgId: ctx.orgId
        }
      });

      if (!site) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

    const response = await generateInsight(input.prompt, {
      siteName: site.domain,
      summary:
        "Last 30 days: 12.3k visitors, 44.8k pageviews, organic search is the strongest source, pricing page traffic is growing, bounce rate is improving."
    });

      await db.aIInsight.create({
        data: {
          siteId: site.id,
          orgId: ctx.orgId,
          prompt: input.prompt,
          response,
          model: process.env.OPENAI_API_KEY ? "openai" : "fallback",
          tokensUsed: response.length
        }
      });

    return { response };
    }),
  getHistory: publicProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.aIInsight.findMany({
      where: {
        siteId: input.siteId,
        orgId: ctx.orgId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
    });
  }),
  save: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await db.aIInsight.update({
      where: { id: input.id },
      data: { savedAt: new Date() }
    });

    return { ok: true };
  }),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await db.aIInsight.delete({
      where: { id: input.id }
    });

    return { ok: true };
  }),
  feedback: publicProcedure
    .input(z.object({ id: z.string(), feedback: z.enum(["GOOD", "BAD"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.aIInsight.update({
        where: { id: input.id },
        data: { feedback: input.feedback }
      });

      return { ok: true };
    })
});
