import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart2, Eye } from "lucide-react";
import { apiRequest } from "@/lib/api";
import StoryAnalyticsChart from "@/components/admin/stories/StoryAnalyticsChart";

type DataPoint = { date: string; count: number };

export default async function StoryAnalyticsPage({
  params,
}: {
  params: Promise<{ storiId: string }>;
}) {
  const { storiId } = await params;

  let title = "";
  let views: DataPoint[] = [];

  try {
    const res = await apiRequest(`/master/analytics/story/${storiId}`);
    const data = await res.json();
    title = data.title ?? "";
    views = data.views ?? [];
  } catch {
    notFound();
  }

  const totalViews = views.reduce((s, d) => s + d.count, 0);
  const peak = views.reduce(
    (best, d) => (d.count > best.count ? d : best),
    { date: "", count: 0 },
  );

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/stories/${storiId}`}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] text-gray-500 dark:text-gray-400 hover:text-[#0f1e3d] dark:hover:text-gray-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-0.5">Story analytics</p>
          <h1 className="font-semibold text-[15px] text-[#0f1e3d] dark:text-gray-100 truncate leading-snug">
            {title}
          </h1>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DBEAFE] dark:bg-[#1e3a5f] flex-shrink-0">
            <Eye size={15} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Total views</p>
            <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">{totalViews.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EDE9FE] dark:bg-[#2E1065] flex-shrink-0">
            <BarChart2 size={15} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Peak day</p>
            <p className="font-semibold text-[#0f1e3d] dark:text-gray-100">
              {peak.count > 0
                ? `${peak.count} view${peak.count === 1 ? "" : "s"}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Chart card */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#1e40af] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Daily views · last 30 days
        </p>
        {totalViews === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
            No views recorded in the last 30 days.
          </p>
        ) : (
          <StoryAnalyticsChart data={views} />
        )}
      </div>
    </div>
  );
}
