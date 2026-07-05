export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import WriterCard from "@/components/admin/writers/WriterCard";
import Pagination from "@/components/admin/Pagination";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import type { AdminListItem } from "@/types/admin";

const PAGE_SIZE = 20;

export default async function WritersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const { page: pageParam } = await searchParams;
  const page = Math.max(parseInt(pageParam ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const res = await apiRequest(`/master/admins?limit=${PAGE_SIZE}&offset=${offset}`);
  const data = await res.json();
  const admins: AdminListItem[] = data.admins ?? [];
  const total: number = data.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (p: number) =>
    p > 1 ? `/admin/writers?page=${p}` : "/admin/writers";

  // story_count now comes directly from the API (computed via SQL subquery),
  // so there's no need to fetch the full stories list just to count per writer.

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
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              {total.toLocaleString()} total
            </span>
          )}
        </p>

        {masters.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C77F00] dark:text-[#FFC700]">
              Masters
            </p>
            {masters.map((admin) => (
              <WriterCard
                admin={admin}
                storyCount={admin.story_count}
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
            storyCount={admin.story_count}
            key={admin.admin_id}
          />
        ))}

        <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
