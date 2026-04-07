import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";

import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

export const anomalyRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          siteId: z.string().optional(),
          take: z.number().min(1).max(100).default(20)
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.anomaly.findMany({
        where: {
          orgId: ctx.orgId,
          siteId: input?.siteId
        },
        orderBy: {
          detectedAt: "desc"
        },
        take: input?.take ?? 20
      });
    }),
  acknowledge: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.anomaly.update({
        where: { id: input.id },
        data: { acknowledgedAt: new Date() }
      });

      return { ok: true };
    })
});
