// Master's home screen — "Needs Attention" card.
// Combines two things that are both, structurally, "waiting on master right
// now": Pending stories (awaiting approve/reject) and unverified admins
// (awaiting verify). No new backend — both counts come from data already
// fetched elsewhere (/master/stories, /master/admins).
//
// Unlike the other cards, this one has no single destination, so there's no
// whole-card Link — each row links to its own place (Pending stories ->
// the filtered stories list, Unverified admins -> the writers page). Both
// rows pulse to read as "this needs your attention", reusing the same
// attention-pulse-active treatment as the writers page's "Not verified" badge.

import Link from "next/link";
import { Clock, ShieldAlert } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { MasterStory } from "@/types/story";

type AdminListItem = { is_verified: boolean };

export default async function AttentionStatCard() {
  const [storiesRes, adminsRes] = await Promise.all([
    apiRequest("/master/stories"),
    apiRequest("/master/admins"),
  ]);
  const storiesData = await storiesRes.json();
  const adminsData = await adminsRes.json();
  const stories: MasterStory[] = storiesData.stories ?? [];
  const admins: AdminListItem[] = adminsData.admins ?? [];

  const pendingCount = stories.filter((s) => s.status === "Pending").length;
  const unverifiedCount = admins.filter((a) => !a.is_verified).length;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#DC2626] p-5 flex flex-col gap-3 w-full max-w-sm">
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Needs Attention
      </p>

      <Link
        href="/admin/stories?status=Pending"
        className="flex items-center justify-between rounded-lg px-1.5 py-1.5 -mx-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FEF3C7] dark:bg-[#422006]">
            <Clock size={16} className={`text-[#92400E] dark:text-[#FDE68A] ${pendingCount > 0 ? "attention-pulse-active" : ""}`} />
          </div>
          <span className="text-sm font-bold font-nunito text-[#92400E] dark:text-[#FDE68A] hover:underline">
            Pending review
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]">
          {pendingCount}
        </span>
      </Link>

      <Link
        href="/admin/writers"
        className="flex items-center justify-between rounded-lg px-1.5 py-1.5 -mx-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FEE2E2] dark:bg-[#450a0a]">
            <ShieldAlert size={16} className={`text-[#DC2626] dark:text-[#FCA5A5] ${unverifiedCount > 0 ? "attention-pulse-active" : ""}`} />
          </div>
          <span className="text-sm font-bold font-nunito text-[#DC2626] dark:text-[#FCA5A5] hover:underline">
            Unverified admins
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]">
          {unverifiedCount}
        </span>
      </Link>
    </div>
  );
}
