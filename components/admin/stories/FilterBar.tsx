"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const FILTERS = ["Draft", "Pending", "Published"] as const;

const ACTIVE_STYLES: Record<string, string> = {
  Draft:     "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]",
  Pending:   "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]",
  Published: "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]",
};

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get("status") ?? "Draft";

  const setFilter = (status: string) => {
    if (active === status) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 py-3">
      {FILTERS.map((status) => (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`px-5 sm:px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            active === status
              ? `${ACTIVE_STYLES[status]} shadow-sm cursor-default`
              : "bg-white dark:bg-[#1e2130] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252d40] cursor-pointer border border-gray-200 dark:border-white/[0.06]"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
