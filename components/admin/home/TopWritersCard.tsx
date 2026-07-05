import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { MasterStory } from "@/types/story";

type AdminListItem = {
  admin_id: string;
  admin_name: string;
  avatar_url: string;
  role: "master" | "writer";
};

const RANK_COLORS = [
  "bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]",
  "bg-[#F1F5F9] dark:bg-[#334155] text-[#475569] dark:text-[#CBD5E1]",
  "bg-[#FFEDD5] dark:bg-[#431407] text-[#C2410C] dark:text-[#FDBA74]",
];

export default async function TopWritersCard() {
  const [storiesRes, adminsRes] = await Promise.all([
    apiRequest("/master/stories"),
    apiRequest("/master/admins"),
  ]);
  const storiesData = await storiesRes.json();
  const adminsData = await adminsRes.json();
  const stories: MasterStory[] = storiesData.stories ?? [];
  const admins: AdminListItem[] = adminsData.admins ?? [];

  const writerById = new Map(
    admins.filter((a) => a.role === "writer").map((a) => [a.admin_id, a]),
  );

  const publishedCountByAdminId = stories.reduce<Record<string, number>>((counts, story) => {
    if (story.status !== "Published" || !story.admin_id || !writerById.has(story.admin_id)) {
      return counts;
    }
    counts[story.admin_id] = (counts[story.admin_id] ?? 0) + 1;
    return counts;
  }, {});

  const ranked = Object.entries(publishedCountByAdminId)
    .map(([adminId, count]) => ({ admin: writerById.get(adminId)!, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Top Writers
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF8E1] dark:bg-[#3a2e05]">
          <Trophy size={14} className="text-[#C77F00] dark:text-[#FFC700]" />
        </div>
      </div>

      {ranked.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No published stories yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {ranked.map(({ admin, count }, i) => (
            <Link
              key={admin.admin_id}
              href={`/admin/stories?admin=${admin.admin_id}&status=Published`}
              className="flex items-center justify-between rounded-xl px-2 py-2 -mx-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    RANK_COLORS[i] ?? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                  }`}
                >
                  {i < 3 ? <Trophy size={13} /> : i + 1}
                </div>
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex-shrink-0 ring-1 ring-white dark:ring-[#1a1f2e]">
                  {admin.avatar_url && (
                    <Image
                      src={admin.avatar_url}
                      alt={admin.admin_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {admin.admin_name}
                </span>
              </div>
              <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7] flex-shrink-0">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
