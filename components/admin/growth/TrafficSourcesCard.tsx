import { Share2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import TrafficSourcesClient from "./TrafficSourcesClient";

type SourceRow = { source: string; destination: string; count: number };

export default async function TrafficSourcesCard({ from, to }: { from: string; to: string }) {
  const res = await apiRequest(`/master/analytics/traffic-sources?from=${from}&to=${to}`);
  const data = await res.json();
  const sources: SourceRow[] = data.sources ?? [];

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#7C3AED] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Traffic sources</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EDE9FE] dark:bg-[#2e1065]">
          <Share2 size={14} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
      </div>
      <TrafficSourcesClient rows={sources} />
    </div>
  );
}
