"use client";

// Traffic sources come back as {source, destination, count} triples —
// grouped by source for the main bars, with a destination filter (a pill
// row, same look as FilterBar's status pills) so "which destination is
// this source driving clicks to" stays answerable without a second chart.

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type SourceRow = { source: string; destination: string; count: number };

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
      <p className="text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">{payload[0].value.toLocaleString()} clicks</p>
    </div>
  );
}

export default function TrafficSourcesClient({ rows }: { rows: SourceRow[] }) {
  const destinations = useMemo(() => {
    const set = new Set(rows.map((r) => r.destination));
    return ["all", ...Array.from(set)];
  }, [rows]);
  const [destination, setDestination] = useState<string>("all");

  const chartData = useMemo(() => {
    const filtered = destination === "all" ? rows : rows.filter((r) => r.destination === destination);
    const bySource = new Map<string, number>();
    for (const r of filtered) {
      bySource.set(r.source, (bySource.get(r.source) ?? 0) + r.count);
    }
    return Array.from(bySource.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }, [rows, destination]);

  if (rows.length === 0) {
    return (
      <div className="h-[160px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No link clicks recorded in this range.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {destinations.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {destinations.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDestination(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                destination === d
                  ? "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]"
              }`}
            >
              {d === "all" ? "All destinations" : d}
            </button>
          ))}
        </div>
      )}
      <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 36)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-white/[0.06]" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-400 dark:text-gray-500" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="source" width={90} tick={{ fontSize: 11, fill: "currentColor", className: "text-gray-500 dark:text-gray-400" }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
          <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
