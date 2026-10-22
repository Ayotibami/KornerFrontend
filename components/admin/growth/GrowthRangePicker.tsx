"use client";

// Lets the master pick the date range the KPI cards / charts / tables use.
// Same URL-query-param pattern as FilterBar on the stories page — presets
// just set ?from=&to= and let the server component re-fetch.

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const PRESETS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function GrowthRangePicker({ activeDays }: { activeDays: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setUTCDate(from.getUTCDate() - (days - 1));

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", toDateStr(from));
    params.set("to", toDateStr(to));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="inline-flex self-start rounded-xl bg-gray-50 dark:bg-white/[0.04] p-1 gap-1">
      {PRESETS.map(({ label, days }) => (
        <button
          key={days}
          type="button"
          onClick={() => setRange(days)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeDays === days
              ? "bg-white dark:bg-[#2a3142] text-[#0f1e3d] dark:text-gray-100 shadow-sm"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
