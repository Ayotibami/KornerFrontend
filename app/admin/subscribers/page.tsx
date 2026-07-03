// Master's subscribers page — reached by clicking the Subscribers card on
// the home dashboard. Lists everyone on the kornereffect mailing list, with
// a Remove button per row. GET /user/subscribers existed already with zero
// frontend UI before this.
//
// No layout.tsx — same reasoning as app/admin/writers/page.tsx: this is a
// brand new top-level folder with no nested subroutes to protect, but
// rendering Navbar directly here keeps the pattern consistent.

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import SubscriberRow from "@/components/admin/subscribers/SubscriberRow";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import type { Subscriber } from "@/types/subscriber";

export default async function SubscribersPage() {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const res = await apiRequest("/user/subscribers");
  const data = await res.json();
  const subscribers: Subscriber[] = data.subscribers ?? [];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
          Subscribers
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
      </div>
    </div>
  );
}
