import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";
import { breakdownRows, trafficSeries } from "../../lib/mock-data";
import { PlausibleClient } from "@pulseboard/plausible-sdk";

function getClient() {
  const baseUrl = process.env.PLAUSIBLE_BASE_URL;
  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!baseUrl || !apiKey) {
    return null;
  }

  return new PlausibleClient({ baseUrl, apiKey });
}

export const analyticsRouter = createTRPCRouter({
  getStats: publicProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
    const site = await getSiteOrThrow(ctx.orgId, input.siteId);
    const client = getClient();

    if (!client) {
      return {
        visitors: 12340,
        pageviews: 44820,
        sessions: 16022,
        bounceRate: 41.2,
        avgDuration: 216
      };
    }

    const stats = await client.getSiteStats(site.plausibleSiteId ?? site.id);

    return {
      visitors: stats.visitors,
      pageviews: stats.pageviews,
      sessions: stats.sessions,
      bounceRate: stats.bounceRate,
      avgDuration: stats.visitDuration
    };
  }),
  getTimeseries: publicProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
    const site = await getSiteOrThrow(ctx.orgId, input.siteId);
    const client = getClient();
    return client ? client.getTimeseries(site.plausibleSiteId ?? site.id) : trafficSeries;
  }),
  getBreakdown: publicProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
    const site = await getSiteOrThrow(ctx.orgId, input.siteId);
    const client = getClient();
    return client ? client.getBreakdown(site.plausibleSiteId ?? site.id, "source") : breakdownRows;
  }),
  getRealtime: publicProcedure.input(z.object({ siteId: z.string() })).query(async ({ ctx, input }) => {
    const site = await getSiteOrThrow(ctx.orgId, input.siteId);
    const client = getClient();
    return { visitors: client ? await client.getRealtimeVisitors(site.plausibleSiteId ?? site.id) : 28 };
  })
});

async function getSiteOrThrow(orgId: string | null, siteId: string) {
  if (!orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const site = await db.site.findFirst({
    where: {
      id: siteId,
      orgId
    }
  });

  if (!site) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  return site;
}
