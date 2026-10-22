import Link from "next/link";
import { TrendingUp, Eye, FileText, Users } from "lucide-react";
import { apiRequest } from "@/lib/api";

type TargetRow = { month: string; kpiKey: string; target: number | null; actual: number | null; status: "green" | "amber" | "red" | null };

const STATUS_STYLES: Record<string, string> = {
  green: "bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]",
  amber: "bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]",
  red: "bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]",
};

function StatusPill({ value, status }: { value: number | null; status: string | null }) {
  const style = status ? STATUS_STYLES[status] : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400";
  return (
    <span className={`text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center ${style}`}>
      {value ?? "—"}
    </span>
  );
}

/** Quick-glance teaser for the Growth dashboard, surfaced on the master
 * home page so there's an actual way to discover /admin/growth beyond
 * knowing the URL — pulls this month's targets-vs-actuals (views, stories
 * published) plus the subscriber total already fetched elsewhere, same
 * data the full dashboard itself uses, just the headline numbers. */
export default async function GrowthStatCard() {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  const month = monthStart.toISOString().slice(0, 10);

  const [targetsRes, subsRes] = await Promise.all([
    apiRequest(`/master/analytics/targets-vs-actuals?from=${month}&to=${month}`),
    apiRequest("/user/subscribers/stats"),
  ]);
  const targetsData = await targetsRes.json();
  const subsData = await subsRes.json();

  const targets: TargetRow[] = targetsData.targets ?? [];
  const viewsRow = targets.find((t) => t.kpiKey === "korner_views");
  const storiesRow = targets.find((t) => t.kpiKey === "korner_stories_published");
  const totalSubscribers = subsData.stats?.total ?? 0;

  const rows = [
    {
      icon: <Eye size={15} />,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      label: "Views this month",
      value: viewsRow?.actual ?? null,
      status: viewsRow?.status ?? null,
    },
    {
      icon: <FileText size={15} />,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      label: "Stories published",
      value: storiesRow?.actual ?? null,
      status: storiesRow?.status ?? null,
    },
    {
      icon: <Users size={15} />,
      iconBg: "bg-[#FEE2E2] dark:bg-[#450a0a]",
      iconColor: "text-[#DC2626] dark:text-[#FCA5A5]",
      label: "Total subscribers",
      value: totalSubscribers,
      status: null,
    },
  ];

  return (
    <Link
      href="/admin/growth"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#7C3AED] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Growth dashboard</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EDE9FE] dark:bg-[#2e1a5c]">
          <TrendingUp size={14} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map(({ icon, iconBg, iconColor, label, value, status }) => (
          <div key={label} className="flex items-center justify-between gap-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <span className={iconColor}>{icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{label}</span>
            </div>
            <div className="flex-shrink-0">
              <StatusPill value={value} status={status} />
            </div>
          </div>
        ))}
      </div>

      <span className="text-xs font-medium text-[#7C3AED] dark:text-[#C4B5FD]">View full dashboard →</span>
    </Link>
  );
}
