import Link from "next/link";
import { Mail, UserPlus, Clock, Send } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type SendItem = {
  status: string;
  sent_at: string | null;
};

export default async function SubscribersStatCard() {
  const [statsRes, sendsRes] = await Promise.all([
    apiRequest("/user/subscribers/stats"),
    apiRequest("/newsletter/sends"),
  ]);
  const statsData = await statsRes.json();
  const sendsData = await sendsRes.json();

  const stats = statsData.stats ?? { total: 0, newThisWeek: 0, lastJoined: null };
  const sends: SendItem[] = sendsData.sends ?? [];

  const lastSent = sends
    .filter((s) => s.status === "sent" && s.sent_at)
    .sort((a, b) => new Date(b.sent_at!).getTime() - new Date(a.sent_at!).getTime())[0];

  const rows = [
    {
      icon: <Mail size={15} />,
      iconBg: "bg-[#FEE2E2] dark:bg-[#450a0a]",
      iconColor: "text-[#DC2626] dark:text-[#FCA5A5]",
      label: "Total",
      valueEl: (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {stats.total}
        </span>
      ),
    },
    {
      icon: <UserPlus size={15} />,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      label: "New this week",
      valueEl: (
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
          {stats.newThisWeek}
        </span>
      ),
    },
    {
      icon: <Clock size={15} />,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      label: "Last joined",
      valueEl: (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {stats.lastJoined ? formatDate(stats.lastJoined) : "—"}
        </span>
      ),
    },
    {
      icon: <Send size={15} />,
      iconBg: "bg-[#FFF8E1] dark:bg-[#3a2e05]",
      iconColor: "text-[#C77F00] dark:text-[#FFC700]",
      label: "Last sent",
      valueEl: (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {lastSent ? formatDate(lastSent.sent_at!) : "Never"}
        </span>
      ),
    },
  ];

  return (
    <Link
      href="/admin/subscribers"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Subscribers
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FEE2E2] dark:bg-[#450a0a]">
          <Mail size={14} className="text-[#DC2626] dark:text-[#FCA5A5]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map(({ icon, iconBg, iconColor, label, valueEl }) => (
          <div key={label} className="flex items-center justify-between gap-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <span className={iconColor}>{icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                {label}
              </span>
            </div>
            <div className="flex-shrink-0">{valueEl}</div>
          </div>
        ))}
      </div>
    </Link>
  );
}
