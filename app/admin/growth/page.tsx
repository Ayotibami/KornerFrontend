export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/admin/Navbar";
import getProfile from "@/app/admin/home/action";
import GrowthRangePicker from "@/components/admin/growth/GrowthRangePicker";
import GrowthKpis from "@/components/admin/growth/GrowthKpis";
import GrowthCharts from "@/components/admin/growth/GrowthCharts";
import ViewsByWriterCard from "@/components/admin/growth/ViewsByWriterCard";
import TrafficSourcesCard from "@/components/admin/growth/TrafficSourcesCard";
import PushSubscribersCard from "@/components/admin/growth/PushSubscribersCard";
import StoriesTable from "@/components/admin/growth/StoriesTable";
import TargetsTrackerCard from "@/components/admin/growth/TargetsTrackerCard";
import StatCardSkeleton from "@/components/admin/home/StatCardSkeleton";

type SortBy = "views" | "date" | "clicks";
type Order = "asc" | "desc";

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function GrowthPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; sortBy?: string; order?: string; page?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const params = await searchParams;

  const today = new Date();
  const defaultFrom = new Date();
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 29);

  const to = params.to ?? toDateStr(today);
  const from = params.from ?? toDateStr(defaultFrom);
  const activeDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1;

  const sortBy: SortBy = (["views", "date", "clicks"] as const).includes(params.sortBy as SortBy)
    ? (params.sortBy as SortBy)
    : "date";
  const order: Order = params.order === "asc" ? "asc" : "desc";
  const page = Math.max(parseInt(params.page ?? "1", 10) || 1, 1);

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-16 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin/home"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 no-underline transition-colors w-fit"
            >
              <ArrowLeft size={16} />
              Go back
            </Link>
            <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50">Growth dashboard</p>
          </div>
          <GrowthRangePicker activeDays={activeDays} />
        </div>

        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}</div>}>
          <GrowthKpis from={from} to={to} />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <GrowthCharts from={from} to={to} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={<StatCardSkeleton />}>
            <ViewsByWriterCard from={from} to={to} />
          </Suspense>
          <Suspense fallback={<StatCardSkeleton />}>
            <TrafficSourcesCard from={from} to={to} />
          </Suspense>
        </div>

        <Suspense fallback={<StatCardSkeleton />}>
          <PushSubscribersCard from={from} to={to} />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <StoriesTable from={from} to={to} sortBy={sortBy} order={order} page={page} />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <TargetsTrackerCard />
        </Suspense>
      </div>
    </div>
  );
}
