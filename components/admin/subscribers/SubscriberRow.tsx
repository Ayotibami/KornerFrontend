"use client";

// One row on the subscribers page — name, email, joined date, and a Remove
// button. Removal is a single click + toast, not a heavy confirm-modal flow
// like deleting a story — leaving a mailing list is low-stakes and instantly
// reversible (they can just resubscribe).

import { useState, useTransition } from "react";
import { UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { removeSubscriber } from "@/app/admin/subscribers/action";
import { formatFullDate } from "@/lib/utils";
import type { Subscriber } from "@/types/subscriber";

export default function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeSubscriber(subscriber.email);
      if (result.ok) {
        setIsRemoved(true);
        toast.success(`${subscriber.name || subscriber.email} removed.`);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (isRemoved) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="font-bold text-[#0f1e3d] dark:text-gray-50 font-nunito truncate">
          {subscriber.name || "—"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {subscriber.email}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Joined {formatFullDate(subscriber.joined_at)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] rounded-full px-4 py-2 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
        Remove
      </button>
    </div>
  );
}
