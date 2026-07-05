import { Eye, BookOpen, CalendarDays, Flame, Users } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Metrics = {
  publishedCount: number;
  totalViews: number;
  newStoriesThisMonth: number;
  topStory: { title: string; views: number; storiId: string } | null;
  subscriberGrowth: { thisMonth: number; lastMonth: number };
};

export default async function MetricsCard() {
  const res = await apiRequest("/master/metrics");
  const data = await res.json();
  const metrics: Metrics = data.metrics;

  const rows = [
    {
      icon: <Eye size={15} />,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      label: "Total views",
      valueEl: (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {metrics.totalViews.toLocaleString()}
        </span>
      ),
    },
    {
      icon: <BookOpen size={15} />,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      label: "Published stories",
      valueEl: (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
          {metrics.publishedCount}
        </span>
      ),
    },
    {
      icon: <CalendarDays size={15} />,
      iconBg: "bg-[#CCFBF1] dark:bg-[#042f2e]",
      iconColor: "text-[#0D9488] dark:text-[#2DD4BF]",
      label: "New stories this month",
      valueEl: (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#CCFBF1] dark:bg-[#042f2e] text-[#0D9488] dark:text-[#2DD4BF]">
          {metrics.newStoriesThisMonth}
        </span>
      ),
    },
    {
      icon: <Users size={15} />,
      iconBg: "bg-[#EDE9FE] dark:bg-[#2e1065]",
      iconColor: "text-[#7C3AED] dark:text-[#C4B5FD]",
      label: "Subscriber growth",
      valueEl: (
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 bg-[#EDE9FE] dark:bg-[#2e1065] text-[#7C3AED] dark:text-[#C4B5FD]">
            {metrics.subscriberGrowth.thisMonth} this mo
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {metrics.subscriberGrowth.lastMonth} last mo
          </span>
        </div>
      ),
    },
    {
      icon: <Flame size={15} />,
      iconBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      iconColor: "text-[#92400E] dark:text-[#FDE68A]",
      label: metrics.topStory?.title ?? "No published stories yet",
      valueEl: metrics.topStory ? (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]">
          {metrics.topStory.views.toLocaleString()} views
        </span>
      ) : null,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#0D9488] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Metrics
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#CCFBF1] dark:bg-[#042f2e]">
          <Eye size={14} className="text-[#0D9488] dark:text-[#2DD4BF]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map(({ icon, iconBg, iconColor, label, valueEl }) => (
          <div key={label} className="flex items-center justify-between gap-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <span className={iconColor}>{icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                {label}
              </span>
            </div>
            <div className="flex-shrink-0">{valueEl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
