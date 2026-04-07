import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";

import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

export const securityRouter = createTRPCRouter({
  listEvents: protectedProcedure
    .input(z.object({ take: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.securityEvent.findMany({
        where: {
          OR: [{ userId: ctx.userId }, { orgId: ctx.orgId ?? undefined }]
        },
        orderBy: {
          createdAt: "desc"
        },
        take: input?.take ?? 20
      });
    })
});
