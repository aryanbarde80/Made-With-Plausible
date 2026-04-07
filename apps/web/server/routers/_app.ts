import { createTRPCRouter } from "../trpc/trpc";
import { aiRouter } from "./ai";
import { alertRouter } from "./alert";
import { analyticsRouter } from "./analytics";
import { annotationRouter } from "./annotation";
import { apiKeyRouter } from "./apiKey";
import { auditLogRouter } from "./auditLog";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { filterRouter } from "./filter";
import { funnelRouter } from "./funnel";
import { goalRouter } from "./goal";
import { memberRouter } from "./member";
import { orgRouter } from "./org";
import { pluginRouter } from "./plugin";
import { reportRouter } from "./report";
import { siteRouter } from "./site";
import { superadminRouter } from "./superadmin";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  org: orgRouter,
  member: memberRouter,
  site: siteRouter,
  analytics: analyticsRouter,
  goal: goalRouter,
  funnel: funnelRouter,
  alert: alertRouter,
  report: reportRouter,
  dashboard: dashboardRouter,
  annotation: annotationRouter,
  filter: filterRouter,
  ai: aiRouter,
  plugin: pluginRouter,
  apiKey: apiKeyRouter,
  auditLog: auditLogRouter,
  superadmin: superadminRouter
});

export type AppRouter = typeof appRouter;

