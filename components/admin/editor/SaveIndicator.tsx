"use client";

// Small unobtrusive status indicator for background autosave — sits in the
// page header and fades in/out around "Saving…" / "Saved ✓" / "Save failed".
// Never a toast — autosave is a background activity that shouldn't interrupt
// what the user is doing.

import { Check, Loader2, WifiOff } from "lucide-react";
import type { SaveStatus } from "@/hooks/useAutosave";

export default function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span className="flex items-center gap-1 text-xs font-semibold font-nunito transition-opacity">
      {status === "saving" && (
        <>
          <Loader2 size={11} className="animate-spin text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="text-gray-400 dark:text-gray-500">Saving…</span>
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
    </span>
  );
}
