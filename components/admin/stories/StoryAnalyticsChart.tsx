"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DataPoint = { date: string; count: number };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 dark:text-gray-500 mb-0.5">{label ? formatDate(label) : ""}</p>
      <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">
        {payload[0].value} {payload[0].value === 1 ? "view" : "views"}
      </p>
    </div>
  );
}

export default function StoryAnalyticsChart({ data }: { data: DataPoint[] }) {
  const tickDates = data.filter((_, i) => i % 5 === 0).map((d) => d.date);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          className="text-gray-100 dark:text-white/[0.06]"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          ticks={tickDates}
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#1e40af", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#1e40af"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0, fill: "#1e40af" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
