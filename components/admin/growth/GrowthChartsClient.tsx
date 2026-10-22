"use client";

// Client chart components for the Growth dashboard — same Recharts styling
// as AnalyticsCharts.tsx / StoryAnalyticsChart.tsx (colors, tooltip card,
// grid, axis treatment) so these read as the same system, not a new one.

import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
  label?: string;
  formatter?: (label: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 dark:text-gray-500 mb-1">{label && formatter ? formatter(label) : label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-semibold text-[#0f1e3d] dark:text-gray-100">
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function ViewsSeriesChart({ data }: { data: { date: string; count: number }[] }) {
  const tickDates = data.filter((_, i) => i % 5 === 0).map((d) => d.date);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" vertical={false} />
        <XAxis dataKey="date" ticks={tickDates} tickFormatter={formatDay} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} width={30} />
        <Tooltip content={<ChartTooltip formatter={formatDay} />} cursor={{ stroke: "#1e40af", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Line type="monotone" dataKey="count" name="Views" stroke="#1e40af" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: "#1e40af" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SubscribersSeriesChart({
  data,
}: {
  data: { date: string; newCount: number; cumulative: number }[];
}) {
  const tickDates = data.filter((_, i) => i % 5 === 0).map((d) => d.date);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" vertical={false} />
        <XAxis dataKey="date" ticks={tickDates} tickFormatter={formatDay} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
        {/* Two Y-axes — newCount (daily) and cumulative (running total) are
            typically orders of magnitude apart; sharing one axis flattens
            the daily bars to near-invisible. */}
        <YAxis yAxisId="new" allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} width={30} />
        <YAxis yAxisId="cumulative" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} width={34} />
        <Tooltip content={<ChartTooltip formatter={formatDay} />} cursor={{ stroke: "#7C3AED", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Bar yAxisId="new" dataKey="newCount" name="New" fill="#C4B5FD" radius={[3, 3, 0, 0]} barSize={10} />
        <Line yAxisId="cumulative" type="monotone" dataKey="cumulative" name="Total" stroke="#7C3AED" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: "#7C3AED" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function StoriesPerWeekChart({ data }: { data: { weekStart: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" vertical={false} />
        <XAxis dataKey="weekStart" tickFormatter={formatDay} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} width={30} />
        <Tooltip content={<ChartTooltip formatter={formatDay} />} cursor={{ fill: "rgba(13,148,136,0.08)" }} />
        <Bar dataKey="count" name="Published" fill="#0D9488" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PushTrendChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No snapshots recorded yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDay} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} width={34} />
        <Tooltip content={<ChartTooltip formatter={formatDay} />} cursor={{ stroke: "#C77F00", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Line type="monotone" dataKey="count" name="Push subs" stroke="#C77F00" strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: "#C77F00" }} activeDot={{ r: 5, strokeWidth: 0, fill: "#C77F00" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ViewsByWriterChart({ data }: { data: { admin_name: string; views: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[160px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No views recorded in this range.
      </div>
    );
  }
  const height = Math.max(160, data.length * 34);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="admin_name"
          width={110}
          tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-500 dark:text-gray-400" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(30,64,175,0.08)" }} />
        <Bar dataKey="views" name="Views" fill="#1e40af" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
