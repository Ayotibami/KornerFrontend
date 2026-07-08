"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download, Loader2 } from "lucide-react";

export default function SubscriberSearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);
  const [exporting, setExporting] = useState(false);
  const lastPushed = useRef(initialSearch);

  useEffect(() => {
    if (value === lastPushed.current) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      params.delete("page");
      lastPushed.current = value;
      router.push(`/admin/subscribers?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const query = value ? `?search=${encodeURIComponent(value)}` : "";
      const res = await fetch(`/api/subscribers/export${query}`);
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/10 text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 dark:focus:ring-blue-500/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        />
      </div>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        title="Export as CSV"
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/10 text-[#0f1e3d] dark:text-gray-100 hover:opacity-80 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] flex-shrink-0"
      >
        {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        Export
      </button>
    </div>
  );
}
