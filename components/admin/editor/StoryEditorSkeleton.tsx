// Shared by both the create and edit story loading.tsx — same editor shell
// (header row, cover image, meta fields, a few content blocks) either way.

import Skeleton from "@/components/admin/ui/Skeleton";

function BlockRowSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex gap-2 items-start">
      <Skeleton className="w-[18px] h-[18px] rounded mt-3.5 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 py-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3.5 rounded-full ${i === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
      <Skeleton className="w-[18px] h-[18px] rounded mt-3.5 flex-shrink-0" />
    </div>
  );
}

export default function StoryEditorSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <div
        className="mx-auto px-4 sm:px-6 pb-24 sm:pb-10"
        style={{ maxWidth: 1000, paddingTop: "clamp(16px, 4vw, 32px)" }}
      >
        <div className="bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-sm px-5 sm:px-10 py-8 flex flex-col gap-6">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>

          {/* Page heading */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-3.5 w-56 rounded-full" />
            </div>
          </div>

          {/* Cover image */}
          <Skeleton className="w-full h-[clamp(320px,55vw,480px)] rounded-[clamp(16px,4vw,36px)]" />

          {/* Meta fields */}
          <div className="flex flex-col gap-5">
            <Skeleton className="h-9 w-4/5 rounded-full" />
            <Skeleton className="h-5 w-3/5 rounded-full" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-4 w-28 rounded-full" />
          </div>

          {/* Content blocks */}
          <div className="flex flex-col gap-4">
            <BlockRowSkeleton lines={1} />
            <BlockRowSkeleton lines={4} />
            <BlockRowSkeleton lines={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
