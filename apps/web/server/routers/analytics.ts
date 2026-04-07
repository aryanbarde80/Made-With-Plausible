import { createTRPCRouter, publicProcedure } from "../trpc/trpc";
import { breakdownRows, trafficSeries } from "../../lib/mock-data";

export const analyticsRouter = createTRPCRouter({
  getStats: publicProcedure.query(() => ({
    visitors: 12340,
    pageviews: 44820,
    sessions: 16022,
    bounceRate: 41.2,
    avgDuration: 216
  })),
  getTimeseries: publicProcedure.query(() => trafficSeries),
  getBreakdown: publicProcedure.query(() => breakdownRows),
  getRealtime: publicProcedure.query(() => ({ visitors: 28 }))
});

