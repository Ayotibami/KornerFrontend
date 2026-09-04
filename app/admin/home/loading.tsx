// Shaped like the writer home view (filter pills + stats banner + story
// grid) — the more common role day-to-day. Master's dashboard (stat-card
// grid) already streams its own per-card skeletons via Suspense in
// page.tsx, so this only needs to cover the shell while getProfile() and
// the page's own data resolve.

import Skeleton from "@/components/admin/ui/Skeleton";
import StoryCardSkeleton from "@/components/admin/stories/StoryCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      <div className="fixed top-16 left-0 right-0 z-[4] bg-[#f8f9fb]/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
        <div className="flex justify-center items-center gap-2 sm:gap-3 py-3">
          <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
        </div>
      </div>

      <div className="pt-[60px]">
        <div className="mx-3 sm:mx-4 mb-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-1.5">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <Skeleton className="h-5 w-8 rounded-full" />
                <Skeleton className="h-2.5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3 sm:p-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
