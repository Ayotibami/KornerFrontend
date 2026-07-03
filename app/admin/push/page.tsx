// Master's push page — reached by clicking the Push card on the home
// dashboard. Shows subscriber stats again plus the broadcast composer —
// the genuinely new capability (sending an ad-hoc push, not tied to a
// story) that didn't exist anywhere in the app before this.

import { redirect } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import PushComposer from "@/components/admin/push/PushComposer";
import PushHistoryList from "@/components/admin/push/PushHistoryList";
import { apiRequest } from "@/lib/api";
import getProfile from "@/app/admin/home/action";
import { getPushSends } from "@/app/admin/push/action";

export default async function PushPage() {
  const profile = await getProfile();
  if (profile?.role !== "master") redirect("/admin/home");

  const [statsRes, sendsResult] = await Promise.all([
    apiRequest("/master/push-stats"),
    getPushSends(),
  ]);
  const data = await statsRes.json();
  const players: number = data.pushStats?.players ?? 0;
  const messageablePlayers: number = data.pushStats?.messageablePlayers ?? 0;
  const sends = sendsResult.ok ? sendsResult.data : [];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar profile={profile} />

      <div className="pt-[88px] pb-10 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
          Push
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {players} subscribed device{players === 1 ? "" : "s"}, {messageablePlayers} reachable right now.
        </p>

        <PushComposer players={players} messageablePlayers={messageablePlayers} />

        <p className="text-base font-semibold text-[#0f1e3d] dark:text-gray-50 mt-2">
          Recent sends
        </p>
        <PushHistoryList sends={sends} />
      </div>
    </div>
  );
}
