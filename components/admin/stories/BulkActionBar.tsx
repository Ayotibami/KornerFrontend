"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckSquare, Square, Rocket, Trash2, AlertTriangle, EyeOff, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  bulkPublishStories,
  bulkDeleteStories,
  bulkUnpublishStories,
  bulkRejectStories,
} from "@/app/admin/stories/bulkAction";

const ACTION_BTN = "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function BulkActionBar({
  selectedIds,
  totalCount,
  status,
  onSelectAll,
  onClearAll,
}: {
  selectedIds: string[];
  totalCount: number;
  status: string;
  onSelectAll: () => void;
  onClearAll: () => void;
}) {
  const count = selectedIds.length;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const allSelected = count === totalCount && totalCount > 0;

  // Reset confirm state whenever the selection count changes
  useEffect(() => {
    setConfirmDelete(false);
  }, [count]);

  if (count === 0) return null;

  const label = (n: number, word: string) => `${n} ${n === 1 ? word : word + "s"}`;

  const handlePublish = () => {
    startTransition(async () => {
      const result = await bulkPublishStories(selectedIds);
      if (result.ok) {
        toast.success(`${label(result.published, "story")} published.`);
        onClearAll();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUnpublish = () => {
    startTransition(async () => {
      const result = await bulkUnpublishStories(selectedIds);
      if (result.ok) {
        toast.success(`${label(result.unpublished, "story")} unpublished.`);
        onClearAll();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await bulkRejectStories(selectedIds);
      if (result.ok) {
        toast.success(`${label(result.rejected, "story")} sent back to draft.`);
        onClearAll();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      const result = await bulkDeleteStories(selectedIds);
      if (result.ok) {
        toast.success(`${label(result.deleted, "story")} deleted.`);
        onClearAll();
      } else {
        toast.error(result.message);
      }
      setConfirmDelete(false);
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] px-3 pb-4 sm:pb-6 pointer-events-none">
      <div className="pointer-events-auto max-w-[720px] mx-auto bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_-2px_24px_rgba(0,0,0,0.12),0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_24px_rgba(0,0,0,0.5),0_4px_24px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/[0.07] px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">

        {/* Select all / deselect all toggle */}
        <button
          onClick={allSelected ? onClearAll : onSelectAll}
          disabled={isPending}
          title={allSelected ? "Deselect all" : "Select all"}
          className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
        >
          {allSelected
            ? <CheckSquare size={16} className="text-primary dark:text-[#93b8f0]" />
            : <Square size={16} />
          }
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 flex-shrink-0" />

        {/* Count badge */}
        <span className="text-sm font-bold text-[#0f1e3d] dark:text-gray-100 flex-shrink-0">
          <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-lg bg-primary/10 dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] text-xs font-bold mr-1">
            {count}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">selected</span>
        </span>

        {/* Push action buttons to the right */}
        <div className="flex-1" />

        {/* Status-specific actions */}
        {status === "Draft" && (
          <button
            onClick={handlePublish}
            disabled={isPending}
            title="Publish all"
            className={`${ACTION_BTN} bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7] hover:opacity-80`}
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
          </button>
        )}

        {status === "Pending" && (
          <>
            <button
              onClick={handlePublish}
              disabled={isPending}
              title="Approve all"
              className={`${ACTION_BTN} bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7] hover:opacity-80`}
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              title="Reject all"
              className={`${ACTION_BTN} bg-[#DBEAFE] dark:bg-[#1e3a5f] text-[#1e40af] dark:text-[#93c5fd] hover:opacity-80`}
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
            </button>
          </>
        )}

        {status === "Published" && (
          <button
            onClick={handleUnpublish}
            disabled={isPending}
            title="Unpublish all"
            className={`${ACTION_BTN} bg-[#DBEAFE] dark:bg-[#1e3a5f] text-[#1e40af] dark:text-[#93c5fd] hover:opacity-80`}
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <EyeOff size={15} />}
          </button>
        )}

        {/* Delete — two-click confirm; icon swaps to AlertTriangle on first click */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          title={confirmDelete ? "Tap again to confirm delete" : "Delete all"}
          className={`${ACTION_BTN} ${
            confirmDelete
              ? "bg-[#DC2626] text-white shadow-[0_0_0_3px_rgba(220,38,38,0.2)]"
              : "bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5] hover:opacity-80"
          }`}
        >
          {isPending
            ? <Loader2 size={15} className="animate-spin" />
            : confirmDelete
              ? <AlertTriangle size={15} />
              : <Trash2 size={15} />
          }
        </button>

        {/* Dismiss */}
        <button
          onClick={() => { onClearAll(); setConfirmDelete(false); }}
          disabled={isPending}
          className="flex items-center justify-center w-7 h-7 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
          title="Cancel selection"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
