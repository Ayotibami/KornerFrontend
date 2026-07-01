// Master's home screen — "Push" card.
// Same shell as the other dashboard cards. Reads subscriber counts straight
// from OneSignal's own app-info endpoint via the new GET /master/push-stats
// (this app never tracked push subscribers itself — OneSignal owns that
// data, so there's nothing to derive client-side here, unlike the other
// cards' stats).
//
// Links to /admin/push — stats again, plus the actual reason this needed
// new backend code: a manual broadcast composer. Right now push only ever
// fires automatically on publish/approve; there was no way to send an
// ad-hoc announcement at all before this.

import Link from "next/link";
import { Bell } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default async function PushStatCard() {
  const res = await apiRequest("/master/push-stats");
  const data = await res.json();
  const players: number = data.pushStats?.players ?? 0;
  const messageablePlayers: number = data.pushStats?.messageablePlayers ?? 0;

  return (
    <Link
      href="/admin/push"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#FFC700] p-5 flex flex-col gap-3 w-full max-w-sm transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
    >
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Push
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#DBEAFE] dark:bg-[#1e3a5f]">
            <Bell size={16} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Subscribed devices
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {players}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#D1FAE5] dark:bg-[#022C22]">
            <Bell size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Reachable now
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
          {messageablePlayers}
        </span>
      </div>
    </Link>
  );
}
