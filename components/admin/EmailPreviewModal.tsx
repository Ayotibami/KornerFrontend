"use client";

import { createPortal } from "react-dom";
import { X, Eye } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function EmailPreviewModal({
  html,
  isOpen,
  onClose,
}: {
  html: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 dark:bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center">
              <Eye size={14} className="text-primary dark:text-[#93b8f0]" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50">Email Preview</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Previewing as: Chisom</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <iframe
            srcdoc={html}
            title="Email Preview"
            sandbox="allow-same-origin"
            className="w-full h-full border-0"
            style={{ minHeight: "560px" }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
