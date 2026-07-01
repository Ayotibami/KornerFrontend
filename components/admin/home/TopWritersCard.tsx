// Master's home screen — "Top Writers" card.
// Ranks writers (role: "writer", master excluded — this is about the team,
// master already has their own "Mine" count on the Stories card) by
// Published story count. No new backend — groups /master/stories by
// admin_id (cross-referenced against /master/admins for role) entirely in
// JS, same counting trick used throughout this dashboard.
//
// Top 3 get a medal-colored rank badge (gold/silver/bronze); the rest (if
// shown) get a plain numbered badge. Each row links to that writer's
// Published stories specifically.

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
  "bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]", // gold
  "bg-[#F1F5F9] dark:bg-[#334155] text-[#475569] dark:text-[#CBD5E1]", // silver
  "bg-[#FFEDD5] dark:bg-[#431407] text-[#C2410C] dark:text-[#FDBA74]", // bronze
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
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#FFC700] p-5 flex flex-col gap-3 w-full max-w-sm">
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Top Writers
      </p>

      {ranked.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No published stories yet.
        </p>
      ) : (
        ranked.map(({ admin, count }, i) => (
          <Link
            key={admin.admin_id}
            href={`/admin/stories?admin=${admin.admin_id}&status=Published`}
            className="flex items-center justify-between rounded-lg px-1.5 py-1.5 -mx-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  RANK_COLORS[i] ?? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                }`}
              >
                {i < 3 ? <Trophy size={14} /> : i + 1}
              </div>
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex-shrink-0">
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
              <span className="text-sm font-bold font-nunito text-gray-700 dark:text-gray-200 truncate">
                {admin.admin_name}
              </span>
            </div>
            <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7] flex-shrink-0">
              {count}
            </span>
          </Link>
        ))
      )}
    </div>
  );
}
