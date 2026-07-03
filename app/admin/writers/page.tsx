// Master's writers page — reached by clicking the Admins/Writers card on the
// home dashboard. Lists every admin with their avatar, verified status, and
// a Verify/Unverify button.
//
// No layout.tsx — this is a brand new top-level folder with no nested
// subroutes to protect from a cascading Navbar (unlike app/admin/stories/,
// which has create/ and [storiId]/ that intentionally have none). Still
// rendering Navbar directly here rather than adding a layout, just to keep
// the pattern consistent with how /admin/stories/page.tsx does it.

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import WriterCard from "@/components/admin/writers/WriterCard";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import type { AdminListItem } from "@/types/admin";
import type { MasterStory } from "@/types/story";

export default async function WritersPage() {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const [adminsRes, storiesRes] = await Promise.all([
    apiRequest("/master/admins"),
    apiRequest("/master/stories"),
  ]);
  const adminsData = await adminsRes.json();
  const storiesData = await storiesRes.json();
  const admins: AdminListItem[] = adminsData.admins ?? [];
  const stories: MasterStory[] = storiesData.stories ?? [];

  // Story counts per writer — no dedicated backend endpoint, just grouping
  // the already-fetched full list, same approach as StoriesStatCard's counts.
  const storyCountByAdminId = stories.reduce<Record<string, number>>((counts, story) => {
    if (!story.admin_id) return counts;
    counts[story.admin_id] = (counts[story.admin_id] ?? 0) + 1;
    return counts;
  }, {});

  // Two zones — masters on top, writers below — rather than just "me vs
  // everyone." Within the masters zone, the logged-in master's own row is
  // always first (there's usually only one master anyway, but this keeps
  // it correct if there's ever more than one).
  const masters = [...admins.filter((a) => a.role === "master")].sort(
    (a, b) => (b.is_self ? 1 : 0) - (a.is_self ? 1 : 0),
  );
  const writers = admins.filter((a) => a.role === "writer");

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
          Writers
        </p>

        {masters.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C77F00] dark:text-[#FFC700]">
              Masters
            </p>
            {masters.map((admin) => (
              <WriterCard
                admin={admin}
                storyCount={storyCountByAdminId[admin.admin_id] ?? 0}
                key={admin.admin_id}
              />
            ))}
            <div className="border-t border-[#FFC700]/20 my-1" />
          </>
        )}

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Admins
        </p>
        {writers.map((admin) => (
          <WriterCard
            admin={admin}
            storyCount={storyCountByAdminId[admin.admin_id] ?? 0}
            key={admin.admin_id}
          />
        ))}
      </div>
    </div>
  );
}
