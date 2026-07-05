export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import Pagination from "@/components/admin/Pagination";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import { timeAgo } from "@/lib/timeAgo";
import { auditActionLabel, auditActionColor, type AuditEntry } from "@/lib/auditHelpers";

const PAGE_SIZE = 30;

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const { page: pageParam } = await searchParams;
  const page = Math.max(parseInt(pageParam ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const res = await apiRequest(`/master/audit?limit=${PAGE_SIZE}&offset=${offset}`);
  const data = await res.json();
  const entries: AuditEntry[] = data.entries ?? [];
  const total: number = data.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (p: number) =>
    p > 1 ? `/admin/audit?page=${p}` : "/admin/audit";

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
          Activity Log
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              {total.toLocaleString()} total
            </span>
          )}
        </p>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
            No activity recorded yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {entries.map((entry) => {
              const { dot } = auditActionColor(entry.action);
              const label = auditActionLabel(entry);
              return (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-[#1a1f2e] rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                >
                  <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0f1e3d] dark:text-gray-200 leading-snug">
                      <span className="font-semibold">{entry.actor_name}</span>{" "}
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(entry.created_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {timeAgo(entry.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
