"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Loader2, Mail, RotateCcw, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { capitalize, formatDate, formatFullDate } from "@/lib/utils";
import { submitStoryForReviewFromCard, updateStory } from "@/app/admin/stories/[storiId]/action";
import type { Story } from "@/types/story";
import MailModal from "@/components/admin/stories/MailModal";

const ACTION_BTN = "w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer";

export default function StoryCard({ story }: { story: Story }) {
  const isDraft = story.status === "Draft";
  const isPending = story.status === "Pending";

  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();
  const [isReverting, startReverting] = useTransition();

  const handleRevert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReverting) return;
    startReverting(async () => {
      const result = await updateStory(story.stori_id, story.title, story.subtitle, story.excerpt, story.reading_time, story.cover_image, undefined, []);
      if (result.ok) toast.success("Story reverted to draft.");
      else toast.error(result.message);
    });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;
    startSubmitting(async () => {
      const result = await submitStoryForReviewFromCard(story.stori_id);
      if (result.ok) toast.success("Submitted for review.");
      else toast.error(result.message);
    });
  };

  const statusBadge = isDraft
    ? "bg-[#DBEAFE]/90 text-[#1e40af] dark:bg-[#1e3a5f]/90 dark:text-[#93c5fd]"
    : isPending
      ? "bg-[#FEF3C7]/90 text-[#92400E] dark:bg-[#422006]/90 dark:text-[#FDE68A]"
      : "bg-[#D1FAE5]/90 text-[#065F46] dark:bg-[#022C22]/90 dark:text-[#6EE7B7]";

  return (
    <>
      <MailModal storiId={story.stori_id} isOpen={isMailOpen} onClose={() => setIsMailOpen(false)} />

      <Link href={`/admin/stories/${story.stori_id}`} className="block group h-full">
        <div className="h-full flex flex-col bg-white dark:bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5">

          {/* Cover image with status badge overlay */}
          <div className="relative h-[200px] bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center flex-shrink-0">
            {story.cover_image ? (
              <Image src={story.cover_image} alt="Cover" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-xs">No cover image</p>
            )}
            <span className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm ${statusBadge}`}>
              {capitalize(story.status)}
            </span>
          </div>

          {/* Content — flex-1 so it fills the remaining card height */}
          <div className="flex flex-col flex-1 p-4 gap-2">
            <p className="font-semibold text-[15px] leading-snug line-clamp-2 text-[#0f1e3d] dark:text-gray-50">
              {story.title}
            </p>
            <p className="text-sm italic text-gray-500 dark:text-gray-400 line-clamp-1">
              {story.subtitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed flex-1">
              {story.excerpt}
            </p>

            {/* Footer — mt-auto keeps it pinned to the bottom */}
            <div className="flex flex-col gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  Updated {formatDate(story.updated_at)}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-primary" />
                    {story.reading_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {story.views}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isDraft && (
                  <button
                    title="Submit for review"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`${ACTION_BTN} bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A] disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
                  </button>
                )}
                {isPending && (
                  <button
                    title="Revert to draft"
                    onClick={handleRevert}
                    disabled={isReverting}
                    className={`${ACTION_BTN} bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd] disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isReverting ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                  </button>
                )}
                <button
                  title="Email"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMailOpen(true); }}
                  className={`${ACTION_BTN} bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5]`}
                >
                  <Mail size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
