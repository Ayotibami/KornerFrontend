"use client";

import React, { useState, useRef, useTransition, useEffect } from "react";
import { CalendarClock, Send } from "lucide-react";
import { toast } from "sonner";
import MailBodyEditor from "@/components/admin/editor/MailBodyEditor";
import ScheduleFields, { formatScheduled, toScheduledAtIso } from "@/components/admin/newsletter/ScheduleFields";
import HeaderImagePicker from "@/components/admin/newsletter/HeaderImagePicker";
import SendNewsletterConfirmModal from "@/components/admin/newsletter/SendNewsletterConfirmModal";
import { sendNewsletter } from "./action";

type Mode = "now" | "schedule";

// ─── Shared input style ───────────────────────────────────────────────────────

const INPUT_BASE =
  "w-full font-nunito text-[0.95rem] border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-3 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed";

// ─── Main form ────────────────────────────────────────────────────────────────

export default function NewsletterForm({
  prefill,
  onSent,
}: {
  prefill?: { subject: string; body: string; imageUrl: string | null } | null;
  onSent?: () => void;
}) {
  const [subject, setSubject]           = useState("");
  const [body, setBody]                 = useState("");
  const [imageUrl, setImageUrl]         = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mode, setMode]                 = useState<Mode>("now");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime]                 = useState("");
  const subjectRef = useRef<HTMLInputElement>(null);
  const [isPending, startSending] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Reuses a sent newsletter's content as a fresh draft — schedule is
  // intentionally not carried over so a stale time can't slip through.
  useEffect(() => {
    if (!prefill) return;
    setSubject(prefill.subject);
    setBody(prefill.body);
    setImageUrl(prefill.imageUrl);
    setMode("now");
    setSelectedDate(undefined);
    setTime("");
  }, [prefill]);

  const insertNameInSubject = () => {
    const el = subjectRef.current;
    if (!el) { setSubject((s) => s + "{{name}}"); return; }
    const start = el.selectionStart ?? subject.length;
    const end   = el.selectionEnd   ?? subject.length;
    setSubject(subject.slice(0, start) + "{{name}}" + subject.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + "{{name}}".length;
      el.setSelectionRange(pos, pos);
    });
  };

  const scheduledLabel = mode === "schedule" ? formatScheduled(selectedDate, time) : null;
  const canSubmit = subject.trim() && body.trim() && !uploadingImage && (mode === "now" || Boolean(scheduledLabel));

  const handleConfirmSend = () => {
    const scheduledAt = mode === "schedule" ? toScheduledAtIso(selectedDate, time) : null;
    if (mode === "schedule" && !scheduledAt) return;

    startSending(async () => {
      const result = await sendNewsletter(subject, body, scheduledAt, imageUrl);
      if (!result.ok) { toast.error(result.message); return; }
      toast.success(mode === "now" ? "Newsletter sent." : "Newsletter scheduled.");
      setPreviewOpen(false);
      setSubject("");
      setBody("");
      setImageUrl(null);
      setSelectedDate(undefined);
      setTime("");
      setMode("now");
      onSent?.();
    });
  };

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-4 sm:p-6 flex flex-col gap-5">

      {/* Cover image */}
      <HeaderImagePicker
        url={imageUrl}
        onChange={setImageUrl}
        onUploadStart={() => setUploadingImage(true)}
        onUploadEnd={() => setUploadingImage(false)}
        disabled={isPending}
      />

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-primary dark:text-[#93b8f0] font-nunito">Subject</label>
          <button
            type="button"
            onClick={insertNameInSubject}
            disabled={isPending}
            className="flex items-center gap-1 text-xs font-bold font-nunito px-2.5 py-1 rounded-lg bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer select-none"
          >
            + name
          </button>
        </div>
        <input
          ref={subjectRef}
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder='e.g. "Hey {{name}}, we don drop another stori o"'
          disabled={isPending}
          className={`${INPUT_BASE} rounded-full`}
        />
      </div>

      {/* Body — rich editor */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-primary dark:text-[#93b8f0] font-nunito">Body</label>
        <MailBodyEditor
          value={body}
          onChange={setBody}
          disabled={isPending}
          showNameButton
          placeholder="Write your newsletter message here…"
        />
      </div>

      {/* Mode toggle — sliding segmented control */}
      <div className="relative bg-[#F0F5FF] dark:bg-[#1e2a3a] rounded-full p-1 flex">
        <div
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-[#243347] rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
            mode === "schedule" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          onClick={() => setMode("now")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold font-nunito rounded-full transition-colors duration-200 cursor-pointer ${
            mode === "now" ? "text-primary dark:text-[#93b8f0]" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Send size={14} />
          Send now
        </button>
        <button
          type="button"
          onClick={() => setMode("schedule")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold font-nunito rounded-full transition-colors duration-200 cursor-pointer ${
            mode === "schedule" ? "text-primary dark:text-[#93b8f0]" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <CalendarClock size={14} />
          Schedule
        </button>
      </div>

      {/* Schedule pickers */}
      {mode === "schedule" && (
        <ScheduleFields
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          time={time}
          onTimeChange={setTime}
        />
      )}

      {/* Submit — opens the preview/confirm modal rather than sending directly */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          disabled={!canSubmit || isPending}
          className="flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3 text-sm font-bold font-nunito hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {mode === "now"
            ? <><Send size={14} /> Send now</>
            : <><CalendarClock size={14} /> Schedule</>
          }
        </button>
      </div>

      <SendNewsletterConfirmModal
        subject={subject}
        body={body}
        imageUrl={imageUrl}
        scheduledLabel={mode === "schedule" ? scheduledLabel : null}
        isOpen={previewOpen}
        isSending={isPending}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
}
