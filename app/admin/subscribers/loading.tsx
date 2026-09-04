// Navbar rendered inline by page.tsx (no shared layout here), so this needs
// its own NavbarSkeleton — matches subscribers/page.tsx's shell exactly.

import Skeleton from "@/components/admin/ui/Skeleton";
import NavbarSkeleton from "@/components/admin/ui/NavbarSkeleton";

export default function SubscribersLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <NavbarSkeleton />
      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <Skeleton className="h-6 w-40 rounded-full mb-1" />
        <Skeleton className="h-11 w-full rounded-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4"
          >
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-3.5 w-48 rounded-full" />
              <Skeleton className="h-2.5 w-28 rounded-full" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
