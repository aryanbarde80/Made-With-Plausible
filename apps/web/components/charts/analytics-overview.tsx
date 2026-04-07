"use client";

import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@pulseboard/ui";

export function AnalyticsOverview({
  series
}: {
  series: { date: string; visitors: number; pageviews: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="h-[360px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Visitors + Pageviews</p>
            <h3 className="text-xl font-semibold text-zinc-950">Traffic momentum</h3>
          </div>
          <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">Last 7 days</div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="visitors" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area dataKey="visitors" stroke="#7c3aed" fill="url(#visitors)" strokeWidth={3} />
            <Area dataKey="pageviews" stroke="#0ea5e9" fillOpacity={0} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card className="h-[360px]">
        <div className="mb-5">
          <p className="text-sm font-medium text-zinc-500">Sessions by Channel</p>
          <h3 className="text-xl font-semibold text-zinc-950">Acquisition mix</h3>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={series}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="visitors" fill="#7c3aed" radius={[999, 999, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

