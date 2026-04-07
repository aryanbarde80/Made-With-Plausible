import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";
import { generateEmbedding, rankSearchDocuments } from "@pulseboard/ai-engine";

import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

export const ragRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(3),
        siteId: z.string().optional(),
        limit: z.number().min(1).max(10).default(5)
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const documents = await db.searchDocument.findMany({
        where: {
          orgId: ctx.orgId,
          siteId: input.siteId
        },
        take: 100
      });

      const queryEmbedding = await generateEmbedding(input.query);
      return rankSearchDocuments(queryEmbedding, documents, input.limit);
    }),
  indexStatus: protectedProcedure
    .input(z.object({ siteId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.searchDocument.count({
        where: {
          orgId: ctx.orgId,
          siteId: input?.siteId
        }
      });
    })
});
