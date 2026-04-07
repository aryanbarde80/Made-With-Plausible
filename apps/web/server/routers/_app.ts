import { createTRPCRouter } from "../trpc/trpc";
import { aiRouter } from "./ai";
import { anomalyRouter } from "./anomaly";
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
import { ragRouter } from "./rag";
import { reportRouter } from "./report";
import { securityRouter } from "./security";
import { siteRouter } from "./site";
import { ssoRouter } from "./sso";
import { superadminRouter } from "./superadmin";
import { userRouter } from "./user";
import { warehouseRouter } from "./warehouse";

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
  anomaly: anomalyRouter,
  plugin: pluginRouter,
  apiKey: apiKeyRouter,
  auditLog: auditLogRouter,
  rag: ragRouter,
  security: securityRouter,
  sso: ssoRouter,
  superadmin: superadminRouter,
  warehouse: warehouseRouter
});

export type AppRouter = typeof appRouter;
