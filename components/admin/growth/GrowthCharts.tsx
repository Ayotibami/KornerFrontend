import { LineChart as LineChartIcon, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { ViewsSeriesChart, SubscribersSeriesChart, StoriesPerWeekChart } from "./GrowthChartsClient";

type Point = { date: string; count: number };
type SubPoint = { date: string; newCount: number; cumulative: number };
type WeekPoint = { weekStart: string; count: number };

export default async function GrowthCharts({ from, to }: { from: string; to: string }) {
  // stories-per-week defaults to 84 days internally, but passing the same
  // from/to as the rest of the dashboard keeps everything on-screen in sync.
  const [viewsRes, subsRes, weekRes] = await Promise.all([
    apiRequest(`/master/analytics/views-series?from=${from}&to=${to}`),
    apiRequest(`/master/analytics/subscribers-series?from=${from}&to=${to}`),
    apiRequest(`/master/analytics/stories-per-week?from=${from}&to=${to}`),
  ]);

  const viewsData = await viewsRes.json();
  const subsData = await subsRes.json();
  const weekData = await weekRes.json();

  const views: Point[] = viewsData.series ?? [];
  const subscribers: SubPoint[] = subsData.series ?? [];
  const storiesPerWeek: WeekPoint[] = weekData.series ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#1e40af] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Views per day</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#DBEAFE] dark:bg-[#1e3a5f]">
            <LineChartIcon size={14} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
        </div>
        <ViewsSeriesChart data={views} />
      </div>

      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#7C3AED] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Subscribers over time</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EDE9FE] dark:bg-[#2e1065]">
            <LineChartIcon size={14} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
          </div>
        </div>
        <SubscribersSeriesChart data={subscribers} />
      </div>

      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#0D9488] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3 lg:col-span-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Stories published per week</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#CCFBF1] dark:bg-[#042f2e]">
            <BarChart3 size={14} className="text-[#0D9488] dark:text-[#2DD4BF]" />
          </div>
        </div>
        <StoriesPerWeekChart data={storiesPerWeek} />
      </div>
    </div>
  );
}
