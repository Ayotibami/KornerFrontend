// Home page — for writers, shows the stories grid filtered by status.
// Default status is "Draft" so the admin sees their drafts immediately on login.
// Toggling to "Published" via the FilterBar pushes ?status=Published to the URL.
//
// Master's home page is a dashboard of cards instead — first one up is
// StoriesStatCard. FilterBar/MasterStoriesList/MasterStoryCard etc. are kept
// as-is, untouched, since they'll be reused on a different master-facing page.
//
// FilterBar is a client component (uses useSearchParams) so it must be wrapped
// in <Suspense>. Without Suspense, Next.js would make the entire page a client
// component, losing the server-side data fetching benefit.
//
// The 60px padding-top on the content div offsets below the fixed FilterBar.

export const dynamic = "force-dynamic";

import StoriesList from "@/components/admin/stories/StoriesList";
import WriterStatsBanner from "@/components/admin/home/WriterStatsBanner";
import AttentionStatCard from "@/components/admin/home/AttentionStatCard";
import StoriesStatCard from "@/components/admin/home/StoriesStatCard";
import AdminsStatCard from "@/components/admin/home/AdminsStatCard";
import SubscribersStatCard from "@/components/admin/home/SubscribersStatCard";
import PushStatCard from "@/components/admin/home/PushStatCard";
import TopWritersCard from "@/components/admin/home/TopWritersCard";
import FilterBar from "@/components/admin/stories/FilterBar";
import SpeedDialFAB from "@/components/admin/SpeedDialFAB";
import getProfile from "@/app/admin/home/action";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  // Default to Draft — first thing an admin sees after login
  const activeStatus = status ?? "Draft";
  const profile = await getProfile();
  const isMaster = profile?.role === "master";

  return (
    <div className="flex flex-col">
      {isMaster ? (
        <div className="flex flex-wrap gap-4 p-4 sm:p-6">
          <AttentionStatCard />
          <StoriesStatCard />
          <AdminsStatCard />
          <SubscribersStatCard />
          <PushStatCard />
          <TopWritersCard />
        </div>
      ) : (
        <>
          <div className="fixed top-[14vh] left-0 right-0 z-[4] bg-slate-100/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
            <Suspense>
              <FilterBar />
            </Suspense>
          </div>

          <div className="pt-[60px]">
            <WriterStatsBanner />
            <StoriesList status={activeStatus} />
          </div>
        </>
      )}

      <SpeedDialFAB />
    </div>
  );
}
