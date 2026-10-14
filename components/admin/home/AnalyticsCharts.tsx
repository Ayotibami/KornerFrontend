"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DataPoint = { date: string; count: number };
type Granularity = "daily" | "monthly";

function formatDate(dateStr: string, granularity: Granularity) {
  const d = new Date(dateStr);
  return granularity === "monthly"
    ? d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function MiniTooltip({
  active,
  payload,
  label,
  granularity,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  granularity: Granularity;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 dark:text-gray-500 mb-0.5">{label ? formatDate(label, granularity) : ""}</p>
      <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">{payload[0].value}</p>
    </div>
  );
}

function MiniChart({
  data,
  color,
  label,
  granularity,
}: {
  data: DataPoint[];
  color: string;
  label: string;
  granularity: Granularity;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const peak = data.length > 0 ? Math.max(...data.map((d) => d.count)) : 0;

  // Daily: show every 7th tick so the x-axis doesn't crowd on mobile.
  // Monthly: only 12 points total, so every other tick is already plenty.
  const tickStep = granularity === "monthly" ? 2 : 7;
  const tickDates = data.filter((_, i) => i % tickStep === 0).map((d) => d.date);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">peak {peak > 0 ? peak : "—"}</span>
          <span className="text-sm font-semibold text-[#0f1e3d] dark:text-gray-100">{total.toLocaleString()}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-100 dark:text-white/[0.06]"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            ticks={tickDates}
            tickFormatter={(d: string) => formatDate(d, granularity)}
            tick={{ fontSize: 10, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<MiniTooltip granularity={granularity} />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 2" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsCharts({
  views,
  subscribers,
  monthlyViews,
  monthlySubscribers,
}: {
  views: DataPoint[];
  subscribers: DataPoint[];
  monthlyViews: DataPoint[];
  monthlySubscribers: DataPoint[];
}) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const isDaily = granularity === "daily";

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-xl bg-gray-50 dark:bg-white/[0.04] p-1 gap-1">
        <button
          type="button"
          onClick={() => setGranularity("daily")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isDaily
              ? "bg-white dark:bg-[#2a3142] text-[#0f1e3d] dark:text-gray-100 shadow-sm"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          Daily · 30 days
        </button>
        <button
          type="button"
          onClick={() => setGranularity("monthly")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !isDaily
              ? "bg-white dark:bg-[#2a3142] text-[#0f1e3d] dark:text-gray-100 shadow-sm"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          Monthly · 12 months
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MiniChart
          data={isDaily ? views : monthlyViews}
          color="#1e40af"
          label={isDaily ? "Story views · last 30 days" : "Story views · last 12 months"}
          granularity={granularity}
        />
        <MiniChart
          data={isDaily ? subscribers : monthlySubscribers}
          color="#7C3AED"
          label={isDaily ? "New subscribers · last 30 days" : "New subscribers · last 12 months"}
          granularity={granularity}
        />
      </div>
    </div>
  );
}
