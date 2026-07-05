export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/admin/Navbar";
import FilterBar from "@/components/admin/stories/FilterBar";
import MasterStoriesList from "@/components/admin/stories/MasterStoriesList";
import getProfile from "@/app/admin/home/action";
import { Suspense } from "react";

export default async function AllStoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; mine?: string; admin?: string; page?: string; search?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const { status, mine, admin, page: pageParam, search } = await searchParams;
  const activeStatus = status ?? "Draft";
  const scope = admin ? "admin" : mine === "true" ? "mine" : "all";
  const page = Math.max(parseInt(pageParam ?? "1") || 1, 1);

  const buildHref = (p: number) => {
    const qp = new URLSearchParams({ status: activeStatus });
    if (mine === "true") qp.set("mine", "true");
    if (admin) qp.set("admin", admin);
    if (search) qp.set("search", search);
    if (p > 1) qp.set("page", String(p));
    return `/admin/stories?${qp}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="fixed top-16 left-0 right-0 z-[4] flex flex-col bg-[#f8f9fb]/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
        <div className="px-3 sm:px-5 pt-2">
          <Link
            href="/admin/home"
            title="Back to dashboard"
            className="inline-flex items-center justify-center w-9 h-9 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <Suspense>
          <FilterBar showSearch />
        </Suspense>
      </div>

      <div className="pt-[216px] pb-5">
        <MasterStoriesList
          status={activeStatus}
          search={search}
          scope={scope}
          adminId={admin}
          page={page}
          buildHref={buildHref}
        />
      </div>
    </div>
  );
}
