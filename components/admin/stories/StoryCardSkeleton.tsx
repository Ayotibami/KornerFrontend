import Skeleton from "@/components/admin/ui/Skeleton";

// Matches StoryCard.tsx's exact shape (200px cover, title/subtitle/excerpt
// lines, footer meta + action-icon row) — used in both the writer home grid
// and the master all-stories grid, which share this same card footprint.
export default function StoryCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <Skeleton className="h-[200px] w-full rounded-none flex-shrink-0" />
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Skeleton className="h-4 w-4/5 rounded-full" />
        <Skeleton className="h-3.5 w-3/5 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-2/3 rounded-full" />
        </div>
        <div className="flex items-center justify-between gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-white/[0.06]">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-24 rounded-full" />
            <Skeleton className="h-2.5 w-16 rounded-full" />
          </div>
          <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
