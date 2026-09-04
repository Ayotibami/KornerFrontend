// Navbar comes from help/layout.tsx (async layout resolves first), so this
// only needs the page's own shell: back link, header, sidebar nav, and a
// few Section-card placeholders matching ui.tsx's <Section>.

import Skeleton from "@/components/admin/ui/Skeleton";

function SectionSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
        <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
        <Skeleton className="h-4 w-40 rounded-full" />
      </div>
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

export default function HelpLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Skeleton className="h-4 w-28 rounded-full mb-6" />

      <div className="mb-8">
        <Skeleton className="h-3 w-24 rounded-full mb-2" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-3.5 w-64 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-3 flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full rounded-full" />
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SectionSkeleton key={i} />
          ))}
        </main>
      </div>
    </div>
  );
}
