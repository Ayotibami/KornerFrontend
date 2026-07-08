"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DataPoint = { date: string; count: number };

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MiniTooltip({
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
      <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">{payload[0].value}</p>
    </div>
  );
}

function MiniChart({
  data,
  color,
  label,
}: {
  data: DataPoint[];
  color: string;
  label: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const peak = Math.max(...data.map((d) => d.count));

  // Show every 7th tick so the x-axis doesn't crowd on mobile
  const tickDates = data.filter((_, i) => i % 7 === 0).map((d) => d.date);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">peak {peak}</span>
          <span className="text-sm font-semibold text-[#0f1e3d] dark:text-gray-100">{total.toLocaleString()}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
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
            tick={{ fontSize: 10, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<MiniTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 2" }} />
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
}: {
  views: DataPoint[];
  subscribers: DataPoint[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <MiniChart data={views} color="#1e40af" label="Story views · last 30 days" />
      <MiniChart data={subscribers} color="#7C3AED" label="New subscribers · last 30 days" />
    </div>
  );
}
