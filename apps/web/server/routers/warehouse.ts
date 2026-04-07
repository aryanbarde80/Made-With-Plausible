import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";

import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

const destinationSchema = z.object({
  name: z.string().min(2).max(80),
  type: z.enum(["BIGQUERY", "SNOWFLAKE"]),
  config: z.record(z.any())
});

export const warehouseRouter = createTRPCRouter({
  listDestinations: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.warehouseDestination.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" }
    });
  }),
  createDestination: protectedProcedure.input(destinationSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.warehouseDestination.create({
      data: {
        orgId: ctx.orgId,
        name: input.name,
        type: input.type,
        config: input.config
      }
    });
  }),
  triggerExport: protectedProcedure
    .input(z.object({ destinationId: z.string(), siteId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.warehouseExportRun.create({
        data: {
          orgId: ctx.orgId,
          siteId: input.siteId,
          destinationId: input.destinationId,
          status: "PENDING"
        }
      });
    }),
  listRuns: protectedProcedure
    .input(z.object({ destinationId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.warehouseExportRun.findMany({
        where: {
          orgId: ctx.orgId,
          destinationId: input?.destinationId
        },
        orderBy: { startedAt: "desc" },
        take: 50
      });
    })
});
