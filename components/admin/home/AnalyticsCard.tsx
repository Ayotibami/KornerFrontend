import { TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/api";
import AnalyticsCharts from "./AnalyticsCharts";

type DataPoint = { date: string; count: number };

export default async function AnalyticsCard() {
  const res = await apiRequest("/master/analytics/overview");
  const data = await res.json();
  const views: DataPoint[] = data.views ?? [];
  const subscribers: DataPoint[] = data.subscribers ?? [];

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#1e40af] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Trends
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#DBEAFE] dark:bg-[#1e3a5f]">
          <TrendingUp size={14} className="text-[#1e40af] dark:text-[#93c5fd]" />
        </div>
      </div>

      <AnalyticsCharts views={views} subscribers={subscribers} />
    </div>
  );
}
