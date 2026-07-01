// Master's home screen — "Subscribers" card.
// Same shell as StoriesStatCard/AdminsStatCard (gold left border, rounded,
// shadow) for visual consistency. The whole card links to /admin/subscribers,
// the actual subscriber list (a master-only endpoint, GET /user/subscribers,
// that had no UI at all before this).
//
// Four rows, all derived from data already fetched — no new backend needed
// beyond the existing /user/subscribers and /newsletter/sends endpoints:
//   Total          — subscribers.length
//   New this week  — joined_at within the last 7 days
//   Last joined    — most recent subscriber, relative date
//   Last sent      — most recent *actually sent* newsletter (status: "sent"),
//                     ties this card to the newsletter feature it feeds

import Link from "next/link";
import { Mail, UserPlus, Clock, Send } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/types/subscriber";

type SendItem = {
  status: string;
  sent_at: string | null;
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Date.now() is impure — React's lint rule flags it if called directly in a
// component body, so it's isolated here, same as the Math.random() helpers
// in AdminsStatCard.
function isWithinLastWeek(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() <= ONE_WEEK_MS;
}

export default async function SubscribersStatCard() {
  const [subscribersRes, sendsRes] = await Promise.all([
    apiRequest("/user/subscribers"),
    apiRequest("/newsletter/sends"),
  ]);
  const subscribersData = await subscribersRes.json();
  const sendsData = await sendsRes.json();
  const subscribers: Subscriber[] = subscribersData.subscribers ?? [];
  const sends: SendItem[] = sendsData.sends ?? [];

  const newThisWeek = subscribers.filter((s) => isWithinLastWeek(s.joined_at)).length;

  const lastJoined = subscribers.length > 0
    ? [...subscribers].sort(
        (a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime(),
      )[0]
    : null;

  const lastSent = sends
    .filter((s) => s.status === "sent" && s.sent_at)
    .sort((a, b) => new Date(b.sent_at!).getTime() - new Date(a.sent_at!).getTime())[0];

  return (
    <Link
      href="/admin/subscribers"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#FFC700] p-5 flex flex-col gap-3 w-full max-w-sm transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
    >
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Subscribers
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FEE2E2] dark:bg-[#450a0a]">
            <Mail size={16} className="text-[#DC2626] dark:text-[#FCA5A5]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Total
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {subscribers.length}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#D1FAE5] dark:bg-[#022C22]">
            <UserPlus size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            New this week
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
          {newThisWeek}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#DBEAFE] dark:bg-[#1e3a5f]">
            <Clock size={16} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Last joined
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right flex-shrink-0">
          {lastJoined ? formatDate(lastJoined.joined_at) : "—"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFF8E1] dark:bg-[#3a2e05]">
            <Send size={16} className="text-[#C77F00] dark:text-[#FFC700]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Last sent
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right flex-shrink-0">
          {lastSent ? formatDate(lastSent.sent_at!) : "Never"}
        </span>
      </div>
    </Link>
  );
}
