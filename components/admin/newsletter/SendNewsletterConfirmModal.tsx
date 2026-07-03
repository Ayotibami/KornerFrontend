"use client";

// Confirm screen between "Send now/Schedule" and the actual irreversible
// send — shows exactly what every subscriber is about to receive (cover
// image, subject with {{name}} resolved to a sample, rendered body) plus
// how many people that is, before the real sendNewsletter call fires.
//
// Any admin (not just master) can send a newsletter, but the subscriber
// list itself is master-only — so this only ever asks for the count
// (GET /user/subscribers/count), never the list, to avoid leaking PII to
// writers who just want to know their reach.
//
// Fetches the count on open rather than receiving it as a prop, same
// "skip if already loaded" guard as AdminDetailModal — avoids resetting
// state to "loading" synchronously at the top of the effect.

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, Send, Loader2, Users } from "lucide-react";
import { getSubscriberCount } from "@/app/admin/newsletter/action";

const BTN_PRIMARY =
  "flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";
const BTN_GHOST =
  "flex items-center gap-2 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export default function SendNewsletterConfirmModal({
  subject,
  body,
  imageUrl,
  scheduledLabel,
  isOpen,
  isSending,
  onClose,
  onConfirm,
}: {
  subject: string;
  body: string;
  imageUrl: string | null;
  scheduledLabel: string | null;
  isOpen: boolean;
  isSending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [countError, setCountError] = useState(false);

  useEffect(() => {
    if (!isOpen || count !== null) return;
    getSubscriberCount().then((result) => {
      if (result.ok) {
        setCount(result.data);
      } else {
        setCountError(true);
      }
    });
  }, [isOpen, count]);

  if (!isOpen) return null;

  const previewSubject = subject.replace(/\{\{name\}\}/g, "there");
  const previewBody = body.replace(/\{\{name\}\}/g, "there");

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={() => !isSending && onClose()}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[560px] max-h-[85vh] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f2e] z-10 flex justify-between items-center p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
              <Send size={16} className="text-primary dark:text-[#93b8f0]" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
                {scheduledLabel ? "Confirm schedule" : "Confirm send"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {scheduledLabel ? `Will go out ${scheduledLabel}` : "This goes out immediately"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            disabled={isSending}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0 ml-4 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 bg-[#FEF3C7] dark:bg-[#422006] rounded-xl px-4 py-3">
            <Users size={18} className="text-[#92400E] dark:text-[#FDE68A] flex-shrink-0" />
            <p className="text-sm font-semibold text-[#92400E] dark:text-[#FDE68A]">
              {countError
                ? "Couldn't load subscriber count — sending will still reach everyone on the list."
                : count === null
                  ? "Checking how many subscribers this reaches…"
                  : `This will reach ${count} subscriber${count === 1 ? "" : "s"}.`}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {imageUrl && (
              <div className="relative w-full h-[160px] bg-slate-100 dark:bg-[#0f1117]">
                <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2">
              <p className="font-bold text-[#0f1e3d] dark:text-gray-50">
                {previewSubject || <span className="text-gray-400 italic">No subject</span>}
              </p>
              <div
                className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed [&_p]:my-1 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold"
                dangerouslySetInnerHTML={{ __html: previewBody || "<p class='italic text-gray-400'>No content</p>" }}
              />
            </div>
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1a1f2e] border-t border-slate-100 dark:border-slate-700 px-6 py-4 flex-shrink-0">
          <div className="flex justify-end items-center gap-3">
            <button className={BTN_GHOST} onClick={onClose} disabled={isSending}>
              Cancel
            </button>
            <button className={BTN_PRIMARY} onClick={onConfirm} disabled={isSending}>
              {isSending
                ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                : <><Send size={14} /> {scheduledLabel ? "Confirm schedule" : "Send now"}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
