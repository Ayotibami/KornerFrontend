import { Eye, BookOpen, Mail, Bell, UserPlus, Percent } from "lucide-react";
import { apiRequest } from "@/lib/api";

type TargetVsActual = {
  month: string;
  kpiKey: string;
  target: number | null;
  actual: number | null;
  status: "green" | "amber" | "red" | null;
};

type SubscriberStats = { total: number; newThisWeek: number; lastJoined: string | null };
type PushSnapshot = { id: number; recorded_at: string; subscriber_count: number };
type SubscribeRate = { ratePercent: number; newSubscribers: number; uniqueVisitors: number };

const STATUS_STYLES: Record<string, string> = {
  green: "bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]",
  amber: "bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]",
  red: "bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]",
};

function Tile({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  status,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  status?: "green" | "amber" | "red" | null;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#7C3AED] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold text-[#0f1e3d] dark:text-gray-100">{value}</p>
        {sub && status !== undefined ? (
          <span
            className={`text-xs font-semibold rounded-xl px-2.5 py-0.5 mb-0.5 ${
              status ? STATUS_STYLES[status] : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500"
            }`}
          >
            {sub}
          </span>
        ) : sub ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{sub}</span>
        ) : null}
      </div>
    </div>
  );
}

export default async function GrowthKpis({ from, to }: { from: string; to: string }) {
  const monthStart = `${to.slice(0, 7)}-01`;

  const [targetsRes, subsStatsRes, pushSnapRes, rateRes] = await Promise.all([
    apiRequest(`/master/analytics/targets-vs-actuals?from=${monthStart}&to=${monthStart}`),
    apiRequest("/user/subscribers/stats"),
    apiRequest("/master/push-subscribers/snapshots?limit=1"),
    apiRequest(`/master/analytics/subscribe-rate?from=${from}&to=${to}`),
  ]);

  const targetsData = await targetsRes.json();
  const subsStatsData = await subsStatsRes.json();
  const pushSnapData = await pushSnapRes.json();
  const rateData = await rateRes.json();

  const targets: TargetVsActual[] = targetsData.targets ?? [];
  const viewsTarget = targets.find((t) => t.kpiKey === "korner_views") ?? null;
  const storiesTarget = targets.find((t) => t.kpiKey === "korner_stories_published") ?? null;

  const subStats: SubscriberStats = subsStatsData.stats ?? { total: 0, newThisWeek: 0, lastJoined: null };
  const latestSnapshot: PushSnapshot | undefined = (pushSnapData.snapshots ?? [])[0];
  const rate: SubscribeRate = rateData ?? { ratePercent: 0, newSubscribers: 0, uniqueVisitors: 0 };

  const vsTargetLabel = (t: TargetVsActual | null) =>
    t?.target != null ? `of ${t.target.toLocaleString()} target` : "no target set";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Tile
        icon={<Eye size={14} />}
        iconBg="bg-[#DBEAFE] dark:bg-[#1e3a5f]"
        iconColor="text-[#1e40af] dark:text-[#93c5fd]"
        label="Views this month"
        value={(viewsTarget?.actual ?? 0).toLocaleString()}
        sub={vsTargetLabel(viewsTarget)}
        status={viewsTarget?.status ?? null}
      />
      <Tile
        icon={<BookOpen size={14} />}
        iconBg="bg-[#D1FAE5] dark:bg-[#022C22]"
        iconColor="text-[#065F46] dark:text-[#6EE7B7]"
        label="Stories published this month"
        value={(storiesTarget?.actual ?? 0).toLocaleString()}
        sub={vsTargetLabel(storiesTarget)}
        status={storiesTarget?.status ?? null}
      />
      <Tile
        icon={<Mail size={14} />}
        iconBg="bg-[#FEE2E2] dark:bg-[#450a0a]"
        iconColor="text-[#DC2626] dark:text-[#FCA5A5]"
        label="Email subscribers"
        value={subStats.total.toLocaleString()}
        sub={`${subStats.newThisWeek} new this week`}
      />
      <Tile
        icon={<Bell size={14} />}
        iconBg="bg-[#FFF8E1] dark:bg-[#3a2e05]"
        iconColor="text-[#C77F00] dark:text-[#FFC700]"
        label="Push subscribers"
        value={latestSnapshot ? latestSnapshot.subscriber_count.toLocaleString() : "—"}
        sub={latestSnapshot ? `as of ${new Date(latestSnapshot.recorded_at).toLocaleDateString()}` : "no snapshot yet"}
      />
      <Tile
        icon={<UserPlus size={14} />}
        iconBg="bg-[#EDE9FE] dark:bg-[#2e1065]"
        iconColor="text-[#7C3AED] dark:text-[#C4B5FD]"
        label="New subscribers (selected range)"
        value={rate.newSubscribers.toLocaleString()}
        sub={`${rate.uniqueVisitors.toLocaleString()} unique visitors`}
      />
      <Tile
        icon={<Percent size={14} />}
        iconBg="bg-[#CCFBF1] dark:bg-[#042f2e]"
        iconColor="text-[#0D9488] dark:text-[#2DD4BF]"
        label="Subscribe rate (selected range)"
        value={`${rate.ratePercent}%`}
        sub="new subs ÷ unique visitors"
      />
    </div>
  );
}
