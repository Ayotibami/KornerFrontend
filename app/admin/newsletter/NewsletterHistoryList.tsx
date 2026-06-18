"use client";

import { useEffect, useState, useTransition } from "react";
import { Ban, CalendarClock, CheckCircle2, Clock, Inbox, Loader2, Pencil, Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatFullDateTime } from "@/lib/utils";
import NewsletterEditModal from "@/components/admin/newsletter/NewsletterEditModal";
import { getNewsletters, getNewsletter, deleteNewsletter, type NewsletterSend } from "./action";

type LoadState = "loading" | "loaded" | "error";

function StatusBadge({ status }: { status: NewsletterSend["status"] }) {
  if (status === "sent") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold font-nunito px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
        <CheckCircle2 size={11} />
        Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold font-nunito px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex-shrink-0">
      <Clock size={11} />
      Scheduled
    </span>
  );
}

export default function NewsletterHistoryList({
  onUseAsTemplate,
}: {
  onUseAsTemplate: (subject: string, body: string, imageUrl: string | null) => void;
}) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sends, setSends] = useState<NewsletterSend[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [templatingId, setTemplatingId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  const load = () => {
    setLoadState("loading");
    getNewsletters().then((result) => {
      if (!result.ok) {
        setLoadState("error");
        setLoadError(result.message);
        return;
      }
      setSends(result.data);
      setLoadState("loaded");
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (sendId: string, status: NewsletterSend["status"]) => {
    startDeleting(async () => {
      const result = await deleteNewsletter(sendId);
      if (!result.ok) { toast.error(result.message); setConfirmDeleteId(null); return; }
      toast.success(status === "sent" ? "Removed from history." : "Scheduled newsletter cancelled.");
      setSends((prev) => prev.filter((s) => s.sendId !== sendId));
      setConfirmDeleteId(null);
    });
  };

  const handleUseAsTemplate = (sendId: string) => {
    setTemplatingId(sendId);
    getNewsletter(sendId).then((result) => {
      setTemplatingId(null);
      if (!result.ok) { toast.error(result.message); return; }
      toast.success("Loaded into Compose — edit and send.");
      onUseAsTemplate(result.data.subject, result.data.body, result.data.imageUrl);
    });
  };

  if (loadState === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-primary dark:text-[#93b8f0]" />
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-sm text-red-500 text-center font-nunito">
          {loadError ?? "Failed to load newsletters."}
        </p>
        <button
          onClick={load}
          className="text-sm font-bold font-nunito px-5 py-2 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  if (sends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center">
          <Inbox size={26} className="text-primary dark:text-[#93b8f0] opacity-60" />
        </div>
        <div className="text-center">
          <p className="font-extrabold text-[#0f1e3d] dark:text-gray-200 font-nunito">
            No newsletters yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-nunito mt-1 leading-relaxed">
            Newsletters you send or schedule will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {editingId && (
        <NewsletterEditModal
          sendId={editingId}
          isOpen
          onClose={() => setEditingId(null)}
          onSaved={load}
        />
      )}

      <div className="flex flex-col gap-3">
        {sends.map((item) => {
          const isPending = item.status === "pending";
          const isConfirming = confirmDeleteId === item.sendId;

          return (
            <div
              key={item.sendId}
              className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-4 sm:p-5 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-100 font-nunito leading-snug flex-1">
                  {item.subject}
                </p>
                <StatusBadge status={item.status} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-nunito">
                <CalendarClock size={11} className="flex-shrink-0" />
                <span>
                  {item.status === "sent" && item.sentAt
                    ? `Sent ${formatFullDateTime(item.sentAt)}`
                    : `Scheduled for ${formatFullDateTime(item.scheduledAt)}`}
                </span>
              </div>

              {isConfirming ? (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-xs font-semibold text-[#0f1e3d] dark:text-gray-200 font-nunito">
                    {isPending ? "Cancel this scheduled newsletter?" : "Delete this from history?"}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isDeleting}
                      className="text-xs font-bold font-nunito px-3 py-1.5 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleDelete(item.sendId, item.status)}
                      disabled={isDeleting}
                      className={`flex items-center gap-1.5 text-xs font-bold font-nunito px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer ${
                        isPending ? "bg-amber-500" : "bg-[#DC2626]"
                      }`}
                    >
                      {isDeleting
                        ? <Loader2 size={12} className="animate-spin" />
                        : isPending ? "Yes, cancel" : "Yes, delete"
                      }
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-1">
                  {isPending && (
                    <button
                      title="Edit"
                      onClick={() => setEditingId(item.sendId)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  {!isPending && (
                    <button
                      title="Resend"
                      onClick={() => handleUseAsTemplate(item.sendId)}
                      disabled={templatingId === item.sendId}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {templatingId === item.sendId
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Repeat size={13} />
                      }
                    </button>
                  )}
                  <button
                    title={isPending ? "Cancel scheduled send" : "Delete from history"}
                    onClick={() => setConfirmDeleteId(item.sendId)}
                    className={
                      isPending
                        ? "w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 hover:opacity-80 transition-opacity cursor-pointer"
                        : "w-8 h-8 flex items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] hover:opacity-80 transition-opacity cursor-pointer"
                    }
                  >
                    {isPending ? <Ban size={13} /> : <Trash2 size={13} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
