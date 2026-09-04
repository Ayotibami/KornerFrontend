import Skeleton from "@/components/admin/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex flex-col gap-1.5 min-w-0">
          <Skeleton className="h-2.5 w-24 rounded-full" />
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4 flex items-center gap-3"
          >
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-gray-200 dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4">
        <Skeleton className="h-3.5 w-40 rounded-full" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </div>
  );
}
