"use client";

// Manual push broadcast composer — the one genuinely new capability behind
// the push card. Goes out to every subscribed browser immediately on submit,
// so it asks for an explicit confirm click before actually sending rather
// than firing straight off the form submit (same caution as DeleteStoriModal,
// scaled down since this isn't destructive, just irreversible-once-sent).
//
// Arming the confirm step (first click) also reveals a preview of exactly
// what's about to be broadcast — title, message, image — plus how many
// devices it'll actually reach, instead of just relying on the page's
// static stats line above the form to make that connection.

import { useState, useTransition } from "react";
import Image from "next/image";
import { Send, Loader2, Bell } from "lucide-react";
import { toast } from "sonner";
import { sendPushBroadcast } from "@/app/admin/push/action";
import ImageUploader from "@/components/admin/editor/ImageUploader";

const INPUT_BASE =
  "w-full font-nunito text-[0.95rem] border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-3 rounded-xl outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed";

export default function PushComposer({
  players,
  messageablePlayers,
}: {
  players: number;
  messageablePlayers: number;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isSending, startSending] = useTransition();

  const handleSend = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startSending(async () => {
      const result = await sendPushBroadcast(title, message, url.trim() || undefined, imageUrl || undefined);
      if (result.ok) {
        toast.success("Push notification sent.");
        setTitle("");
        setMessage("");
        setUrl("");
        setImageUrl("");
        setConfirming(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const canSend = title.trim().length > 0 && message.trim().length > 0 && !isUploadingImage;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-5 flex flex-col gap-4">
      <div>
        <p className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50 font-nunito">
          Send a broadcast
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Goes out immediately to every subscribed device — no scheduling.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setConfirming(false); }}
          placeholder="New stori just dropped!🔥"
          disabled={isSending}
          className={INPUT_BASE}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setConfirming(false); }}
          placeholder="What this notification says when it lands"
          rows={3}
          disabled={isSending}
          className={`${INPUT_BASE} resize-none leading-relaxed`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
          Link (optional)
        </label>
        <input
          value={url}
          onChange={(e) => { setUrl(e.target.value); setConfirming(false); }}
          placeholder="https://korner-frontend.vercel.app/stories/..."
          disabled={isSending}
          className={INPUT_BASE}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
          Image (optional)
        </label>
        <ImageUploader
          mode="write"
          url={imageUrl}
          onChange={(uploadedUrl) => { setImageUrl(uploadedUrl); setConfirming(false); }}
          onUploadStart={() => setIsUploadingImage(true)}
          onUploadEnd={() => setIsUploadingImage(false)}
        />
      </div>

      {confirming && (
        <div className="rounded-xl border border-[#DC2626]/30 dark:border-[#DC2626]/40 overflow-hidden">
          {imageUrl && (
            <div className="relative w-full h-[140px] bg-slate-100 dark:bg-[#0f1117]">
              <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[#DC2626] dark:text-[#FCA5A5] flex-shrink-0" />
              <p className="font-bold text-sm text-[#0f1e3d] dark:text-gray-50">{title}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>
            <p className="text-xs font-semibold text-[#92400E] dark:text-[#FDE68A] mt-1">
              Reaches {messageablePlayers} reachable device{messageablePlayers === 1 ? "" : "s"} right now (of {players} subscribed).
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend || isSending}
        className={`w-full py-2.5 rounded-full font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 ${
          confirming
            ? "bg-[#DC2626] text-white hover:opacity-90"
            : "bg-primary text-white hover:opacity-90"
        }`}
      >
        {isSending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {isSending ? "Sending…" : confirming ? "Click again to confirm send" : "Send broadcast"}
      </button>
    </div>
  );
}
