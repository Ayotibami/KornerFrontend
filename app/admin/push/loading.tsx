import Skeleton from "@/components/admin/ui/Skeleton";
import NavbarSkeleton from "@/components/admin/ui/NavbarSkeleton";

export default function PushLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <NavbarSkeleton />
      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-4">
        <Skeleton className="h-6 w-16 rounded-full mb-1" />
        <Skeleton className="h-3.5 w-64 rounded-full" />

        {/* Composer card */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-3 w-56 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-10 rounded-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        <Skeleton className="h-5 w-28 rounded-full mt-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-4 flex items-center gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
          >
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-2/3 rounded-full" />
              <Skeleton className="h-2.5 w-1/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
