import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@pulseboard/db";
import { generateEmbedding, generateInsight, rankSearchDocuments } from "@pulseboard/ai-engine";

import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

export const aiRouter = createTRPCRouter({
  ask: protectedProcedure
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

      const queryEmbedding = await generateEmbedding(input.prompt);
      const searchDocuments = await db.searchDocument.findMany({
        where: {
          orgId: ctx.orgId,
          OR: [{ siteId: site.id }, { siteId: null }]
        },
        take: 50
      });
      const contextMatches = rankSearchDocuments(queryEmbedding, searchDocuments, 3);

      const insight = await generateInsight(input.prompt, {
        siteName: site.domain,
        summary: [
          "Last 30 days: 12.3k visitors, 44.8k pageviews, organic search is the strongest source, pricing page traffic is growing, bounce rate is improving.",
          contextMatches.length
            ? `Retrieved context:\n${contextMatches
                .map((match) => `- ${match.title}: ${match.content.slice(0, 180)}`)
                .join("\n")}`
            : "No indexed historical context was found yet."
        ].join("\n\n")
      });

      await db.aIInsight.create({
        data: {
          siteId: site.id,
          orgId: ctx.orgId,
          prompt: input.prompt,
          response: insight.text,
          model: `${insight.provider}:${insight.model}`,
          tokensUsed: insight.text.length
        }
      });

      return { response: insight.text, provider: insight.provider, model: insight.model };
    }),
  getHistory: protectedProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
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
  save: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await db.aIInsight.update({
      where: { id: input.id },
      data: { savedAt: new Date() }
    });

    return { ok: true };
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await db.aIInsight.delete({
      where: { id: input.id }
    });

    return { ok: true };
  }),
  feedback: protectedProcedure
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
