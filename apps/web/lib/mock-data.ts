import type { BreakdownRow, InsightMessage, SiteSummary, StatsCard } from "@pulseboard/types";

export const statsCards: StatsCard[] = [
  { label: "Unique Visitors", value: "12.3k", delta: "+18.2%", trend: [12, 14, 19, 22, 21, 24, 29] },
  { label: "Pageviews", value: "44.8k", delta: "+9.4%", trend: [20, 22, 26, 28, 31, 35, 38] },
  { label: "Sessions", value: "16.0k", delta: "+6.1%", trend: [9, 12, 14, 15, 16, 18, 19] },
  { label: "Bounce Rate", value: "41.2%", delta: "-3.4%", trend: [49, 47, 45, 46, 43, 42, 41] },
  { label: "Avg Duration", value: "3m 36s", delta: "+12.6%", trend: [2, 3, 3, 4, 4, 4, 5] },
  { label: "Pages/Session", value: "2.8", delta: "+4.9%", trend: [2, 2, 2, 3, 3, 3, 3] }
];

export const trafficSeries = [
  { date: "Apr 1", visitors: 320, pageviews: 910 },
  { date: "Apr 2", visitors: 410, pageviews: 1180 },
  { date: "Apr 3", visitors: 390, pageviews: 1090 },
  { date: "Apr 4", visitors: 450, pageviews: 1300 },
  { date: "Apr 5", visitors: 510, pageviews: 1490 },
  { date: "Apr 6", visitors: 560, pageviews: 1610 },
  { date: "Apr 7", visitors: 610, pageviews: 1740 }
];

export const breakdownRows: BreakdownRow[] = [
  { label: "Organic Search", value: 5210, share: 42 },
  { label: "Direct", value: 3020, share: 24 },
  { label: "Social", value: 2180, share: 17 },
  { label: "Referral", value: 1230, share: 10 },
  { label: "Email", value: 700, share: 7 }
];

export const sites: SiteSummary[] = [
  {
    id: "demo-site",
    domain: "demo.pulseboard.dev",
    timezone: "Asia/Kolkata",
    visitors: 12340,
    pageviews: 44820,
    bounceRate: 41.2,
    verified: true
  },
  {
    id: "shop-site",
    domain: "shop.pulseboard.dev",
    timezone: "UTC",
    visitors: 8990,
    pageviews: 22120,
    bounceRate: 37.8,
    verified: true
  }
];

export const aiMessages: InsightMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Traffic grew 18% week over week, driven mostly by organic search and a jump in visits to /pricing. Bounce rate improved at the same time, which usually means the campaign quality is improving rather than just volume increasing.",
    createdAt: "2026-04-08T09:00:00Z"
  }
];

