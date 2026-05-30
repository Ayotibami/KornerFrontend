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
    </div>
  );
}
