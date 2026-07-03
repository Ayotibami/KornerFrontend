"use client";

// Confirmation modal for any action that makes a story live right now —
// publishing a draft (own or someone else's) or approving a Pending story.
// Both have the exact same real-world consequence: an immediate mail blast
// to every subscriber plus a push notification to every device, the same
// blast radius as the newsletter/push sends that already get a preview
// screen before firing. One shared modal, caller supplies the icon/copy
// for whichever of the two actions triggered it.

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";

const BTN_GHOST =
  "flex items-center gap-2 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_GREEN_SOLID =
  "flex items-center gap-2 bg-[#16A34A] text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

export default function ConfirmPublishModal({
  icon,
  title,
  description,
  confirmLabel,
  isOpen,
  isProcessing,
  onClose,
  onConfirm,
}: {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (isProcessing) return;
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[480px] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D1FAE5] dark:bg-[#022C22] flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
                {title}
              </h2>
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
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button className={BTN_GHOST} onClick={handleClose} disabled={isProcessing}>
              Cancel
            </button>
            <button className={BTN_GREEN_SOLID} onClick={onConfirm} disabled={isProcessing}>
              {isProcessing
                ? <Loader2 size={16} className="animate-spin" />
                : icon
              }
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
