// Master's stories page — reached by clicking a row on the Stories card on
// the home dashboard, or a writer's row on the Writers page.
// ?mine=true shows just the master's own. ?admin=<id> shows one specific
// other admin's. Otherwise (the Draft/Pending/Published rows) shows
// everyone's. Any of these can be pre-filtered by ?status.
//
// No layout.tsx at this level on purpose — app/admin/stories/ also contains
// create/ and [storiId]/, which intentionally have no Navbar (full-screen
// editor experience). Adding a layout here would cascade the Navbar onto
// those too. So this page renders Navbar itself, scoped to just this route.

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
  searchParams: Promise<{ status?: string; mine?: string; admin?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const { status, mine, admin } = await searchParams;
  const activeStatus = status ?? "Draft";
  const scope = admin ? "admin" : mine === "true" ? "mine" : "all";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      {/* One fixed bar touching the Navbar directly — back link as its own
          row up top, status pills stacked right below it. The browser back
          button isn't reliable here (every filter click pushes a new history
          entry), so this link always goes straight to the dashboard instead. */}
      <div className="fixed top-[14vh] left-0 right-0 z-[4] flex flex-col bg-slate-100/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
        <div className="px-3 sm:px-5 pt-1.5">
          <Link
            href="/admin/home"
            title="Back to dashboard"
            className="inline-flex items-center justify-center w-9 h-9 text-[#0f1e3d] dark:text-gray-50 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <div className="pt-[calc(14vh+100px)] pb-5">
        <MasterStoriesList status={activeStatus} scope={scope} adminId={admin} />
      </div>
    </div>
  );
}
