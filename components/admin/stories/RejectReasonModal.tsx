"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { XCircle, Loader2 } from "lucide-react";

export default function RejectReasonModal({
  isOpen,
  isProcessing,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl p-6 flex flex-col gap-5">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEE2E2] dark:bg-[#450a0a] flex items-center justify-center flex-shrink-0">
            <XCircle size={20} className="text-[#DC2626] dark:text-[#FCA5A5]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0f1e3d] dark:text-gray-50">
              Return for Revision
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Let the writer know what needs to change.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Feedback <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. The intro needs more context. The conclusion feels rushed..."
            rows={4}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#0f1117] text-sm text-[#0f1e3d] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]/30 dark:focus:ring-[#FCA5A5]/20 transition"
            autoFocus
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            This will appear in the email and as a banner on the story editor.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 rounded-full text-sm font-bold text-white bg-[#DC2626] dark:bg-[#b91c1c] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : null}
            Return to Draft
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
