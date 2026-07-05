import Link from "next/link";
import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";
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

  if (pendingCount === 0 && unverifiedCount === 0) return null;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#DC2626] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Needs Attention
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FEE2E2] dark:bg-[#450a0a]">
          <AlertTriangle size={14} className="text-[#DC2626] dark:text-[#FCA5A5]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/admin/stories?status=Pending"
          className="flex items-center justify-between rounded-xl px-2 py-2 -mx-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#FEF3C7] dark:bg-[#422006]">
              <Clock size={16} className={`text-[#92400E] dark:text-[#FDE68A] ${pendingCount > 0 ? "attention-pulse-active" : ""}`} />
            </div>
            <span className="text-sm font-medium text-[#92400E] dark:text-[#FDE68A]">
              Pending review
            </span>
          </div>
          <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]">
            {pendingCount}
          </span>
        </Link>

        <Link
          href="/admin/writers"
          className="flex items-center justify-between rounded-xl px-2 py-2 -mx-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#FEE2E2] dark:bg-[#450a0a]">
              <ShieldAlert size={16} className={`text-[#DC2626] dark:text-[#FCA5A5] ${unverifiedCount > 0 ? "attention-pulse-active" : ""}`} />
            </div>
            <span className="text-sm font-medium text-[#DC2626] dark:text-[#FCA5A5]">
              Unverified admins
            </span>
          </div>
          <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]">
            {unverifiedCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
