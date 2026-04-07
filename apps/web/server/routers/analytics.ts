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
  getStats: publicProcedure.query(async () => {
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

    const stats = await client.getSiteStats("demo-site");

    return {
      visitors: stats.visitors,
      pageviews: stats.pageviews,
      sessions: stats.sessions,
      bounceRate: stats.bounceRate,
      avgDuration: stats.visitDuration
    };
  }),
  getTimeseries: publicProcedure.query(async () => {
    const client = getClient();
    return client ? client.getTimeseries("demo-site") : trafficSeries;
  }),
  getBreakdown: publicProcedure.query(async () => {
    const client = getClient();
    return client ? client.getBreakdown("demo-site", "source") : breakdownRows;
  }),
  getRealtime: publicProcedure.query(async () => {
    const client = getClient();
    return { visitors: client ? await client.getRealtimeVisitors("demo-site") : 28 };
  })
});
