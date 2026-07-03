export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Filter bar skeleton */}
      <div className="fixed top-16 left-0 right-0 z-[4] flex justify-center gap-4 py-3 bg-[#f8f9fb]/90">
        <div className="w-28 h-10 rounded-full bg-slate-300 animate-pulse" />
        <div className="w-28 h-10 rounded-full bg-slate-300 animate-pulse" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3 sm:p-4 pt-[80px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[420px] rounded-2xl bg-slate-200 dark:bg-[#1a1f2e] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
