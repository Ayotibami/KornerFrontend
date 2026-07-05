"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

const FILTERS = ["Draft", "Pending", "Published"] as const;

const ACTIVE_STYLES: Record<string, string> = {
  Draft:     "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]",
  Pending:   "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]",
  Published: "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]",
};

export default function FilterBar({ showSearch = false }: { showSearch?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get("status") ?? "Draft";
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const isFirst = useRef(true);

  const setFilter = (status: string) => {
    if (active === status) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      query.trim() ? params.set("search", query.trim()) : params.delete("search");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const pills = FILTERS.map((status) => (
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
  ));

  if (!showSearch) {
    return (
      <div className="flex justify-center items-center gap-2 sm:gap-3 py-3">
        {pills}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 sm:px-5 pt-1 pb-3">
      <div className="relative max-w-sm mx-auto">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories by title…"
          className="w-full bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] rounded-full pl-9 pr-8 py-2.5 text-sm text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary dark:focus:border-[#4d7ab5] focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex justify-center items-center gap-2 sm:gap-3">
        {pills}
      </div>
    </div>
  );
}
