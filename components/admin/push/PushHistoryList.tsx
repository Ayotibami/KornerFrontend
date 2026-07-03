"use client";

// Recent push history on the push page — list comes pre-fetched from the
// server (no stats, cheap). Click-through stats are fetched on demand per
// row instead of all at once, since each one is a live OneSignal API call —
// fetching 20 of them just to render the list would be wasteful.

import { useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { formatFullDateTime } from "@/lib/utils";
import { getPushSendStats, type PushSend, type PushSendStats } from "@/app/admin/push/action";

type RowState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; stats: PushSendStats }
  | { status: "error"; message: string };

function HistoryRow({ send }: { send: PushSend }) {
  const [state, setState] = useState<RowState>({ status: "idle" });

  const handleCheck = () => {
    setState({ status: "loading" });
    getPushSendStats(send.id).then((result) => {
      setState(result.ok ? { status: "loaded", stats: result.data } : { status: "error", message: result.message });
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="font-semibold text-sm text-[#0f1e3d] dark:text-gray-50 truncate">{send.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFullDateTime(send.sent_at)}</p>
      </div>

      {state.status === "idle" && (
        <button
          type="button"
          onClick={handleCheck}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
        >
          <BarChart3 size={13} />
          Check stats
        </button>
      )}

      {state.status === "loading" && (
        <Loader2 size={16} className="animate-spin text-primary dark:text-[#93b8f0] flex-shrink-0" />
      )}

      {state.status === "error" && (
        <span className="text-xs text-red-500 flex-shrink-0">{state.message}</span>
      )}

      {state.status === "loaded" && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold rounded-xl px-2.5 py-1 bg-[#DBEAFE] dark:bg-[#1e3a5f] text-[#1e40af] dark:text-[#93c5fd]">
            {state.stats.successful} reached
          </span>
          <span className="text-xs font-bold rounded-xl px-2.5 py-1 bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
            {state.stats.converted} clicked
          </span>
        </div>
      )}
    </div>
  );
}

export default function PushHistoryList({ sends }: { sends: PushSend[] }) {
  if (sends.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
        No pushes sent yet.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4 sm:p-6 flex flex-col">
      {sends.map((send) => (
        <HistoryRow key={send.id} send={send} />
      ))}
    </div>
  );
}
