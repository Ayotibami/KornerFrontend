"use client";

import { useState, useTransition } from "react";
import { UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { removeSubscriber } from "@/app/admin/subscribers/action";
import { formatFullDate } from "@/lib/utils";
import type { Subscriber } from "@/types/subscriber";

export default function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await removeSubscriber(subscriber.email);
      if (result.ok) {
        setIsRemoved(true);
        toast.success(`${subscriber.name || subscriber.email} removed.`);
      } else {
        setIsConfirming(false);
        toast.error(result.message);
      }
    });
  };

  if (isRemoved) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="font-semibold text-[#0f1e3d] dark:text-gray-50 truncate">
          {subscriber.name || "—"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {subscriber.email}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Joined {formatFullDate(subscriber.joined_at)}
        </p>
      </div>

      {isConfirming ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            disabled={isPending}
            className="px-3 py-2 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:opacity-80 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2 bg-[#DC2626] text-white rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
            Confirm
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          <UserMinus size={16} />
          Remove
        </button>
      )}
    </div>
  );
}
