import Skeleton from "@/components/admin/ui/Skeleton";
import NavbarSkeleton from "@/components/admin/ui/NavbarSkeleton";

export default function AuditLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <NavbarSkeleton />
      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <Skeleton className="h-6 w-36 rounded-full mb-1" />
        <div className="flex flex-col gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1f2e] rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
            >
              <Skeleton className="mt-2 w-2 h-2 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/4 rounded-full" />
                <Skeleton className="h-2.5 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
