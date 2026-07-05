"use client";

import { Check, Loader2, WifiOff } from "lucide-react";
import type { SaveStatus } from "@/hooks/useAutosave";

export default function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[90] flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1f2e] shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700 select-none">
      {status === "saving" && (
        <>
          <Loader2 size={11} className="animate-spin text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 dark:text-gray-400">Saving…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check size={11} className="text-[#065F46] dark:text-[#6EE7B7] flex-shrink-0" />
          <span className="text-[#065F46] dark:text-[#6EE7B7]">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <WifiOff size={11} className="text-[#DC2626] dark:text-[#FCA5A5] flex-shrink-0" />
          <span className="text-[#DC2626] dark:text-[#FCA5A5]">Save failed</span>
        </>
      )}
    </div>
  );
}
