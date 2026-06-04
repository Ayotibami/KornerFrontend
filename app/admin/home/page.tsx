// Home page — shows the stories grid filtered by status.
// Default status is "Draft" so the admin sees their drafts immediately on login.
// Toggling to "Published" via the FilterBar pushes ?status=Published to the URL.
//
// FilterBar is a client component (uses useSearchParams) so it must be wrapped
// in <Suspense>. Without Suspense, Next.js would make the entire page a client
// component, losing the server-side data fetching benefit.
//
// The 60px padding-top on the content div offsets below the fixed FilterBar.

import StoriesList from "@/components/admin/stories/StoriesList";
import FilterBar from "@/components/admin/stories/FilterBar";
import Link from "next/link";
import { FeatherIcon } from "lucide-react";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  // Default to Draft — first thing an admin sees after login
  const activeStatus = status ?? "Draft";

  return (
    <div className="flex flex-col">
      <Suspense>
        <FilterBar />
      </Suspense>

      <div className="pt-[60px]">
        <StoriesList status={activeStatus} />
      </div>

      <Link
        href="/admin/stories/create"
        aria-label="Create new story"
        style={{ animation: "float 3s ease-in-out infinite" }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center bg-white/30 dark:bg-[#1a2744]/50 backdrop-blur-md border-4 border-primary dark:border-[#93b8f0] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-primary dark:text-[#93b8f0] hover:scale-110 active:scale-95 transition-transform"
      >
        <FeatherIcon size={22} />
      </Link>
    </div>
  );
}
