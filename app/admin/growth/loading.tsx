import StatCardSkeleton from "@/components/admin/home/StatCardSkeleton";

export default function GrowthLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] pt-[88px] pb-10 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
