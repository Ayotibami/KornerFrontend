// Navbar comes from newsletter/layout.tsx (an async layout that resolves
// before this shows), so no NavbarSkeleton needed here — just the page's
// own content: header row, heading, tabs, and the compose form shape.

import Skeleton from "@/components/admin/ui/Skeleton";

export default function NewsletterLoading() {
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-6 w-40 rounded-full" />
          <div className="flex flex-col items-center gap-1.5 w-full max-w-md">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 border-b border-slate-200 dark:border-slate-700 pb-2.5">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>

        {/* Compose form */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-4 sm:p-6 flex flex-col gap-5">
          <div className="flex gap-2">
            <Skeleton className="h-44 flex-1 rounded-2xl" />
            <Skeleton className="h-44 flex-1 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
