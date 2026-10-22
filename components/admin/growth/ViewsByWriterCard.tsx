import { Users } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { ViewsByWriterChart } from "./GrowthChartsClient";

type WriterRow = { admin_id: string | null; admin_name: string | null; views: number };

export default async function ViewsByWriterCard({ from, to }: { from: string; to: string }) {
  const res = await apiRequest(`/master/analytics/views-by-writer?from=${from}&to=${to}`);
  const data = await res.json();
  const writers: WriterRow[] = data.writers ?? [];

  // admin_name can be null (no author_id, or the admin record is gone) —
  // the backend already labels it "Unknown" in SQL, but guard again here so
  // a raw null never reaches the chart as a blank bar. The backend groups
  // by admin_id though, so two distinct null/orphaned ids would otherwise
  // arrive as two separate rows that both get relabeled "Unknown" here —
  // merge those together into one bar rather than rendering duplicates.
  const merged = new Map<string, number>();
  for (const w of writers) {
    const label = w.admin_name?.trim() || "Unknown";
    merged.set(label, (merged.get(label) ?? 0) + w.views);
  }
  const chartData = Array.from(merged, ([admin_name, views]) => ({ admin_name, views }));

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#1e40af] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Views by writer</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#DBEAFE] dark:bg-[#1e3a5f]">
          <Users size={14} className="text-[#1e40af] dark:text-[#93c5fd]" />
        </div>
      </div>
      <ViewsByWriterChart data={chartData} />
    </div>
  );
}
