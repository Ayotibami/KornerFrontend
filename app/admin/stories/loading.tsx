// Matches page.tsx exactly: this route renders its own Navbar (no shared
// admin layout here), so the skeleton needs one too or the real Navbar
// popping in would jump the whole page down by 64px.

import Skeleton from "@/components/admin/ui/Skeleton";
import NavbarSkeleton from "@/components/admin/ui/NavbarSkeleton";
import StoryCardSkeleton from "@/components/admin/stories/StoryCardSkeleton";

export default function AllStoriesLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <NavbarSkeleton />

      <div className="fixed top-16 left-0 right-0 z-20 flex flex-col bg-[#f8f9fb]/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
        <div className="px-3 sm:px-5 pt-2">
          <Skeleton className="w-9 h-9 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2 px-3 sm:px-5 pt-1 pb-3">
          <Skeleton className="h-10 w-full sm:w-[60%] mx-auto rounded-full" />
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
            <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
            <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="pt-[216px] pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3 sm:p-4 w-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
