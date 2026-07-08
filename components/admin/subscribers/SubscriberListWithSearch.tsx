"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Download, Loader2, AlertCircle } from "lucide-react";
import SubscriberRow from "./SubscriberRow";
import type { Subscriber } from "@/types/subscriber";

export default function SubscriberListWithSearch({
  children,
  initialTotal,
}: {
  children: React.ReactNode;
  initialTotal: number;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Subscriber[] | null>(null);
  const [resultTotal, setResultTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setResultTotal(0);
      setSearchError(false);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      setSearchError(false);
      try {
        const res = await fetch(
          `/api/subscribers?search=${encodeURIComponent(query)}&limit=50`,
          { signal: abortRef.current.signal },
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResults(data.subscribers ?? []);
        setResultTotal(data.total ?? 0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setSearchError(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const q = query.trim() ? `?search=${encodeURIComponent(query)}` : "";
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

  const isSearching = query.trim().length > 0;

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

      {isSearching && !loading && !searchError && results !== null && (
        <p className="text-xs text-gray-400 dark:text-gray-500 -mb-1">
          {resultTotal.toLocaleString()} {resultTotal === 1 ? "result" : "results"}
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      )}

      {searchError && (
        <p className="text-sm text-red-500 text-center py-6 flex items-center gap-1 justify-center">
          <AlertCircle size={14} />
          Could not search — try again
        </p>
      )}

      {!loading && !searchError && isSearching && results !== null && (
        results.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
            No subscribers match your search.
          </p>
        ) : (
          results.map((s) => <SubscriberRow subscriber={s} key={s.id} />)
        )
      )}

      {!isSearching && children}
    </>
  );
}
