import Link from "next/link";
import { Activity } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { timeAgo } from "@/lib/timeAgo";
import { auditActionColor, auditActionLabel } from "@/lib/auditHelpers";

type AuditEntry = {
  id: number;
  actor_name: string;
  action: string;
  target_title: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
};

export default async function AuditLogCard() {
  const res = await apiRequest("/master/audit/recent");
  const data = await res.json();
  const entries: AuditEntry[] = data.entries ?? [];

  return (
    <Link
      href="/admin/audit"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#7C3AED] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Activity
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EDE9FE] dark:bg-[#2E1065]">
          <Activity size={14} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-2">
          No activity yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const { dot } = auditActionColor(entry.action);
            const label = auditActionLabel(entry);
            return (
              <div key={entry.id} className="flex items-start gap-2.5 min-w-0">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0f1e3d] dark:text-gray-200 truncate leading-snug">
                    <span className="font-medium">{entry.actor_name}</span>{" "}
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {timeAgo(entry.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Link>
  );
}
