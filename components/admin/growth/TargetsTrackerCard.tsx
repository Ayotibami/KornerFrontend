import { Target as TargetIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";
import TargetCell from "./TargetCell";
import type { TargetKpiKey } from "@/app/admin/growth/action";

type TargetVsActual = {
  month: string;
  kpiKey: string;
  target: number | null;
  actual: number | null;
  status: "green" | "amber" | "red" | null;
};

const TRACKER_FROM = "2026-10-01";
const TRACKER_TO = "2027-03-01";

const KPI_ROWS: { key: TargetKpiKey; label: string }[] = [
  { key: "korner_stories_published", label: "Stories published" },
  { key: "korner_views", label: "Views" },
  { key: "korner_subscribers", label: "Subscribers" },
];

function monthsInRange(from: string, to: string): string[] {
  const months: string[] = [];
  const cur = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (cur <= end) {
    months.push(cur.toISOString().slice(0, 10));
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return months;
}

function formatMonth(m: string) {
  return new Date(`${m}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function TargetsTrackerCard() {
  const res = await apiRequest(`/master/analytics/targets-vs-actuals?from=${TRACKER_FROM}&to=${TRACKER_TO}`);
  const data = await res.json();
  const rows: TargetVsActual[] = data.targets ?? [];

  const byKey = new Map<string, TargetVsActual>();
  for (const r of rows) {
    // month comes back as a full date/timestamp — normalize to YYYY-MM-DD so it matches monthsInRange()
    const m = new Date(r.month).toISOString().slice(0, 10);
    byKey.set(`${m}|${r.kpiKey}`, r);
  }

  const months = monthsInRange(TRACKER_FROM, TRACKER_TO);

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#0D9488] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3 overflow-x-auto">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Targets tracker · Oct 2026 – Mar 2027</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#CCFBF1] dark:bg-[#042f2e] flex-shrink-0">
          <TargetIcon size={14} className="text-[#0D9488] dark:text-[#2DD4BF]" />
        </div>
      </div>

      <table className="min-w-full text-sm border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-xs text-gray-400 dark:text-gray-500 font-medium pb-1 pr-2">KPI</th>
            {months.map((m) => (
              <th key={m} className="text-xs text-gray-400 dark:text-gray-500 font-medium pb-1 whitespace-nowrap">
                {formatMonth(m)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {KPI_ROWS.map(({ key, label }) => (
            <tr key={key}>
              <td className="text-xs font-medium text-gray-600 dark:text-gray-300 pr-2 whitespace-nowrap">{label}</td>
              {months.map((m) => {
                const cell = byKey.get(`${m}|${key}`);
                return (
                  <td key={m} className="min-w-[88px]">
                    <TargetCell
                      month={m}
                      kpiKey={key}
                      target={cell?.target ?? null}
                      actual={cell?.actual ?? null}
                      status={cell?.status ?? null}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Click any cell to set or edit that month&apos;s target.
      </p>
    </div>
  );
}
