"use client";

// Confirmation modal for the master-only delete action on a story.
// Deletion is irreversible (blocks cascade-delete with it), so the master
// must type DELETE exactly before the real delete button enables.
//
// Same modal shell (backdrop, centered card, sticky header) as MailModal,
// for visual consistency across the admin's modals.

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteStoriMaster } from "@/app/admin/stories/[storiId]/action";

const BTN_GHOST =
  "flex items-center gap-2 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_RED_SOLID =
  "flex items-center gap-2 bg-[#DC2626] text-white rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

export default function DeleteStoriModal({
  storiId,
  title,
  isOpen,
  onClose,
  onDeleted,
}: {
  storiId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  // Optional — fires only on a successful delete, in addition to onClose.
  // The dashboard card doesn't need this (the card just disappears from the
  // revalidated list), but the story's own edit page does, since it needs to
  // navigate away from a story that no longer exists.
  onDeleted?: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, startDeleting] = useTransition();

  if (!isOpen) return null;

  const canDelete = confirmText === "DELETE";

  const handleDelete = () => {
    if (!canDelete || isDeleting) return;
    startDeleting(async () => {
      const result = await deleteStoriMaster(storiId);
      if (result.ok) {
        toast.success("Story deleted.");
        setConfirmText("");
        onClose();
        onDeleted?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleClose = () => {
    if (isDeleting) return;
    setConfirmText("");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[480px] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] font-nunito overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEE2E2] dark:bg-[#450a0a] flex items-center justify-center flex-shrink-0">
              <Trash2 size={16} className="text-[#DC2626] dark:text-[#FCA5A5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
                Delete Story
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                This cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            title="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You&apos;re about to permanently delete <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{title}&rdquo;</span> and all of its content. Type <span className="font-bold">DELETE</span> below to confirm.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            disabled={isDeleting}
            autoFocus
            className="w-full font-nunito text-[0.95rem] border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-3 rounded-xl outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-[#DC2626] focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-[#DC2626]/10 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <div className="flex justify-end gap-3 mt-2">
            <button className={BTN_GHOST} onClick={handleClose} disabled={isDeleting}>
              Cancel
            </button>
            <button className={BTN_RED_SOLID} onClick={handleDelete} disabled={!canDelete || isDeleting}>
              {isDeleting
                ? <Loader2 size={16} className="animate-spin" />
                : <Trash2 size={16} />
              }
              Delete Story
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
