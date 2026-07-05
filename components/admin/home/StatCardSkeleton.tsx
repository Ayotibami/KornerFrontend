export default function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-gray-200 dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-3/5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}
