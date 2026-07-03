import Link from "next/link";
import { Bell, BellRing } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default async function PushStatCard() {
  const res = await apiRequest("/master/push-stats");
  const data = await res.json();
  const players: number = data.pushStats?.players ?? 0;
  const messageablePlayers: number = data.pushStats?.messageablePlayers ?? 0;

  return (
    <Link
      href="/admin/push"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
        Push
      </p>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#DBEAFE] dark:bg-[#1e3a5f]">
              <Bell size={15} className="text-[#1e40af] dark:text-[#93c5fd]" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Subscribed devices
            </span>
          </div>
          <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
            {players}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#D1FAE5] dark:bg-[#022C22]">
              <BellRing size={15} className="text-[#065F46] dark:text-[#6EE7B7]" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Reachable now
            </span>
          </div>
          <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
            {messageablePlayers}
          </span>
        </div>
      </div>
    </Link>
  );
}
