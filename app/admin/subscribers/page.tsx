export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import SubscriberRow from "@/components/admin/subscribers/SubscriberRow";
import Pagination from "@/components/admin/Pagination";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import type { Subscriber } from "@/types/subscriber";

const PAGE_SIZE = 25;

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const { page: pageParam } = await searchParams;
  const page = Math.max(parseInt(pageParam ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const res = await apiRequest(`/user/subscribers?limit=${PAGE_SIZE}&offset=${offset}`);
  const data = await res.json();
  const subscribers: Subscriber[] = data.subscribers ?? [];
  const total: number = data.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (p: number) =>
    p > 1 ? `/admin/subscribers?page=${p}` : "/admin/subscribers";

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
          Subscribers
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              {total.toLocaleString()} total
            </span>
          )}
        </p>

        {subscribers.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
            No subscribers yet.
          </p>
        ) : (
          subscribers.map((subscriber) => (
            <SubscriberRow subscriber={subscriber} key={subscriber.id} />
          ))
        )}

        <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
