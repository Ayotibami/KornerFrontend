import { BellRing } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { PushTrendChart } from "./GrowthChartsClient";
import PushSnapshotForm from "./PushSnapshotForm";

type Snapshot = { id: number; recorded_at: string; subscriber_count: number };

export default async function PushSubscribersCard({ from, to }: { from: string; to: string }) {
  // There's no dedicated push-subscriber series endpoint — snapshots are
  // recorded ad hoc (manual entry below), so the trend is just whatever
  // snapshots happen to fall in range, reshaped client-side into a
  // date/count series and plotted oldest-first.
  const res = await apiRequest(`/master/push-subscribers/snapshots?limit=200&from=${from}&to=${to}`);
  const data = await res.json();
  const snapshots: Snapshot[] = data.snapshots ?? [];

  const series = snapshots
    .map((s) => ({ date: s.recorded_at, count: s.subscriber_count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Push subscribers</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF8E1] dark:bg-[#3a2e05]">
          <BellRing size={14} className="text-[#C77F00] dark:text-[#FFC700]" />
        </div>
      </div>
      <PushTrendChart data={series} />
      <div className="pt-1 border-t border-gray-100 dark:border-white/[0.06]">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
          Record today&apos;s count (OneSignal doesn&apos;t expose history, so this has to be entered by hand).
        </p>
        <PushSnapshotForm />
      </div>
    </div>
  );
}
