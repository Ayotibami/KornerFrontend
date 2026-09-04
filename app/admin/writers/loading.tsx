import Skeleton from "@/components/admin/ui/Skeleton";
import NavbarSkeleton from "@/components/admin/ui/NavbarSkeleton";

function WriterRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-9 w-20 rounded-xl flex-shrink-0" />
    </div>
  );
}

export default function WritersLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <NavbarSkeleton />
      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <Skeleton className="h-6 w-28 rounded-full mb-1" />
        <Skeleton className="h-3 w-16 rounded-full" />
        {Array.from({ length: 2 }).map((_, i) => (
          <WriterRowSkeleton key={`m-${i}`} />
        ))}
        <div className="border-t border-gray-200 dark:border-white/10 my-1" />
        <Skeleton className="h-3 w-16 rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <WriterRowSkeleton key={`w-${i}`} />
        ))}
      </div>
    </div>
  );
}
