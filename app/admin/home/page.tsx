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
  const activeStatus = status ?? "Draft";
  const profile = await getProfile();
  const isMaster = profile?.role === "master";

  return (
    <div className="flex flex-col">
      {isMaster ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
          <AttentionStatCard />
          <StoriesStatCard />
          <AdminsStatCard />
          <SubscribersStatCard />
          <PushStatCard />
          <TopWritersCard />
        </div>
      ) : (
        <>
          <div className="fixed top-16 left-0 right-0 z-[4] bg-[#f8f9fb]/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
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
