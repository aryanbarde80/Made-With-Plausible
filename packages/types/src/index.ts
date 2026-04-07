export type Role = "SUPERADMIN" | "USER";
export type OrgPlan = "FREE" | "PRO" | "TEAM" | "ENTERPRISE";
export type MemberRole = "OWNER" | "ADMIN" | "ANALYST" | "VIEWER";
export type AlertChannel = "EMAIL" | "WEBHOOK" | "SLACK";
export type DashboardWidgetType =
  | "STAT_CARD"
  | "LINE_CHART"
  | "BAR_CHART"
  | "TABLE"
  | "FUNNEL"
  | "GOAL_PROGRESS"
  | "MAP"
  | "TEXT";

export interface StatsCard {
  label: string;
  value: string;
  delta: string;
  trend: number[];
}

export interface BreakdownRow {
  label: string;
  value: number;
  share: number;
}

export interface SiteSummary {
  id: string;
  domain: string;
  timezone: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
  verified: boolean;
}

export interface InsightMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

