"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Download, Loader2 } from "lucide-react";

export default function SubscriberSearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [exporting, setExporting] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      query.trim() ? params.set("search", query.trim()) : params.delete("search");
      params.delete("page");
      router.push(`/admin/subscribers?${params.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const q = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`/api/subscribers/export${q}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "subscribers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] rounded-xl pl-9 pr-9 py-2.5 text-sm text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary dark:focus:border-[#4d7ab5] focus:ring-2 focus:ring-primary/10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
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
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        title="Export as CSV"
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/[0.08] text-[#0f1e3d] dark:text-gray-100 hover:opacity-80 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] flex-shrink-0"
      >
        {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        Export
      </button>
    </div>
  );
}
