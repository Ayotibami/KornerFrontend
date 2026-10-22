import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { apiRequest } from "@/lib/api";
import Pagination from "@/components/admin/Pagination";

type StoryRow = {
  storiId: string;
  title: string;
  authorName: string | null;
  publishedAt: string;
  totalViews: number;
  viewsFirst7Days: number;
  clicksToKampos: number;
};

type SortBy = "views" | "date" | "clicks";
type Order = "asc" | "desc";

const PAGE_SIZE = 10;

const COLUMNS: { key: SortBy | null; label: string }[] = [
  { key: null, label: "Title" },
  { key: null, label: "Author" },
  { key: "date", label: "Published" },
  { key: "views", label: "Total views" },
  { key: null, label: "First 7 days" },
  { key: "clicks", label: "Clicks to Kampos" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function StoriesTable({
  from,
  to,
  sortBy,
  order,
  page,
}: {
  from: string;
  to: string;
  sortBy: SortBy;
  order: Order;
  page: number;
}) {
  const res = await apiRequest(
    `/master/analytics/stories-table?from=${from}&to=${to}&sortBy=${sortBy}&order=${order}&page=${page}&pageSize=${PAGE_SIZE}`,
  );
  const data = await res.json();
  const stories: StoryRow[] = data.stories ?? [];
  const total: number = data.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  const buildSortHref = (key: SortBy) => {
    const params = new URLSearchParams({ from, to, sortBy: key, order: sortBy === key && order === "desc" ? "asc" : "desc" });
    return `/admin/growth?${params.toString()}#stories-table`;
  };

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams({ from, to, sortBy, order, page: String(p) });
    return `/admin/growth?${params.toString()}#stories-table`;
  };

  return (
    <div
      id="stories-table"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#1e40af] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3 overflow-x-auto"
    >
      <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">Published stories</p>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/[0.06]">
            {COLUMNS.map((col) => (
              <th key={col.label} className="py-2 pr-4 font-medium whitespace-nowrap">
                {col.key ? (
                  <Link href={buildSortHref(col.key)} className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300">
                    {col.label}
                    {sortBy === col.key ? (
                      order === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-40" />
                    )}
                  </Link>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stories.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="py-6 text-center text-gray-400 dark:text-gray-500">
                No published stories in this range.
              </td>
            </tr>
          ) : (
            stories.map((s) => (
              <tr key={s.storiId} className="border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                <td className="py-2.5 pr-4 max-w-[220px] truncate text-[#0f1e3d] dark:text-gray-100 font-medium">
                  <Link href={`/admin/stories/${s.storiId}/analytics`} className="hover:underline">
                    {s.title}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.authorName || "Unknown"}</td>
                <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(s.publishedAt)}</td>
                <td className="py-2.5 pr-4 font-semibold text-[#0f1e3d] dark:text-gray-100">{s.totalViews.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{s.viewsFirst7Days.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{s.clicksToKampos.toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildPageHref} />
    </div>
  );
}
