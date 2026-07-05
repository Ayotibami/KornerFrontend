"use client";

import { useEffect, useState, useTransition } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { createPortal } from "react-dom";
import { X, CalendarClock, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import MailBodyEditor from "@/components/admin/editor/MailBodyEditor";
import ScheduleFields, { toScheduledAtIso } from "@/components/admin/newsletter/ScheduleFields";
import HeaderImagePicker from "@/components/admin/newsletter/HeaderImagePicker";
import { getNewsletter, updateNewsletter } from "@/app/admin/newsletter/action";
import EmailPreviewModal from "@/components/admin/EmailPreviewModal";
import { buildNewsletterPreview } from "@/lib/emailPreview";

type FetchState = "loading" | "ready" | "error";

const INPUT_BASE =
  "w-full text-[0.95rem] border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-3 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed";

const BTN_PRIMARY =
  "flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";
const BTN_GHOST =
  "flex items-center gap-2 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export default function NewsletterEditModal({
  sendId,
  isOpen,
  onClose,
  onSaved,
}: {
  sendId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch the full send (with body) every time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setFetchState("loading");
    setFetchError(null);

    getNewsletter(sendId).then((result) => {
      if (!result.ok) {
        setFetchState("error");
        setFetchError(result.message);
        return;
      }
      const scheduled = new Date(result.data.scheduledAt);
      setSubject(result.data.subject);
      setBody(result.data.body);
      setImageUrl(result.data.imageUrl);
      setSelectedDate(scheduled);
      setTime(`${String(scheduled.getHours()).padStart(2, "0")}:${String(scheduled.getMinutes()).padStart(2, "0")}`);
      setFetchState("ready");
    });
  }, [isOpen, sendId]);

  useEscapeKey(onClose, isOpen);

  const scheduledAtIso = toScheduledAtIso(selectedDate, time);
  const canSave = Boolean(subject.trim() && body.trim() && scheduledAtIso && !uploadingImage);

  const handleSave = () => {
    if (!scheduledAtIso) return;
    startSaving(async () => {
      const result = await updateNewsletter(sendId, subject, body, scheduledAtIso, imageUrl);
      if (!result.ok) { toast.error(result.message); return; }
      toast.success("Newsletter updated.");
      onSaved();
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <EmailPreviewModal
        html={buildNewsletterPreview(subject, body, imageUrl)}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
      {createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[640px] max-h-[85vh] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f2e] z-10 flex justify-between items-center p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
              <CalendarClock size={16} className="text-primary dark:text-[#93b8f0]" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
                Edit Newsletter
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Update the subject, body, or send time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {fetchState === "loading" && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-primary dark:text-[#93b8f0]" />
            </div>
          )}

          {fetchState === "error" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-sm text-red-500 text-center">
                {fetchError ?? "Failed to load newsletter."}
              </p>
              <button className={BTN_GHOST} onClick={onClose}>
                Close
              </button>
            </div>
          )}

          {fetchState === "ready" && (
            <div className="flex flex-col gap-5">

              {/* Cover image */}
              <HeaderImagePicker
                url={imageUrl}
                onChange={setImageUrl}
                onUploadStart={() => setUploadingImage(true)}
                onUploadEnd={() => setUploadingImage(false)}
                disabled={isSaving}
              />

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-primary dark:text-[#93b8f0]">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. New story just dropped!"
                  disabled={isSaving}
                  className={`${INPUT_BASE} rounded-full`}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-primary dark:text-[#93b8f0]">Body</label>
                <MailBodyEditor
                  value={body}
                  onChange={setBody}
                  disabled={isSaving}
                  showNameButton
                  placeholder="Write your newsletter message here…"
                />
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              {/* Schedule */}
              <ScheduleFields
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                time={time}
                onTimeChange={setTime}
                label="Will now send on"
              />
            </div>
          )}
        </div>

        {/* ── Sticky footer ── */}
        {fetchState === "ready" && (
          <div className="sticky bottom-0 bg-white dark:bg-[#1a1f2e] border-t border-slate-100 dark:border-slate-700 px-6 py-4 flex-shrink-0">
            <div className="flex justify-end items-center gap-3">
              <button className={BTN_GHOST} onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button
                className={BTN_GHOST}
                onClick={() => setIsPreviewOpen(true)}
                disabled={isSaving}
              >
                <Eye size={14} />
                Preview
              </button>
              <button className={BTN_PRIMARY} onClick={handleSave} disabled={isSaving || !canSave}>
                {isSaving
                  ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  : "Save Changes"
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
      )}
    </>
  );
}
