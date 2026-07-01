"use client";

// Card component for a single story in the stories grid on the home page.
// The entire card is a Next.js Link — clicking anywhere navigates to the edit page.
// Fixed height (500px) keeps the grid visually consistent regardless of content length.
//
// Status badge (soft tinted bg + darker same-family text):
//   Draft     — blue family  (light: #DBEAFE / #1e40af,  dark: #1e3a5f / #93c5fd)
//   Pending   — amber family (light: #FEF3C7 / #92400E,  dark: #422006 / #FDE68A)
//   Published — green family (light: #D1FAE5 / #065F46,  dark: #022C22 / #6EE7B7)

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Loader2, Mail, RotateCcw, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { capitalize, formatDate, formatFullDate } from "@/lib/utils";
import { submitStoryForReviewFromCard, updateStory } from "@/app/admin/stories/[storiId]/action";
import type { Story } from "@/types/story";
import { PRIMARY } from "@/constants/theme";
import MailModal from "@/components/admin/stories/MailModal";

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
      const result = await updateStory(story.stori_id, story.title, story.subtitle, story.excerpt, story.reading_time, story.cover_image, []);
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

  return (
    <>
      <MailModal
        storiId={story.stori_id}
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
      />
      <Link href={`/admin/stories/${story.stori_id}`} className="block">
        <div className="h-[540px] p-5 rounded-2xl bg-white dark:bg-[#1a1f2e] shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col gap-3 overflow-hidden transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">

          {/* Reading time + view count + Draft/Published badge */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs">
              <div className="flex items-center gap-1">
                <Clock size={12} color={PRIMARY} />
                <span>{story.reading_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{story.views}</span>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-xl font-semibold ${
                isDraft
                  ? "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
                  : isPending
                    ? "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]"
                    : "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]"
              }`}
            >
              {capitalize(story.status)}
            </span>
          </div>

          {/* Cover image — shows a placeholder if none is set */}
          <div className="relative h-[200px] sm:h-[240px] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center flex-shrink-0">
            {story.cover_image ? (
              <Image
                src={story.cover_image}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">No cover image</p>
            )}
          </div>

          {/* Story metadata */}
          <p className="font-bold text-lg sm:text-xl leading-snug line-clamp-1 text-[#0f1e3d] dark:text-gray-50">{story.title}</p>
          <p className="text-sm sm:text-base italic text-gray-700 dark:text-gray-300 line-clamp-1">{story.subtitle}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{story.excerpt}</p>

          {/* Dates + actions */}
          <div className="flex justify-between items-end mt-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Last updated {formatDate(story.updated_at)}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Created {formatFullDate(story.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              {isDraft && (
                <button
                  title="Submit for review"
                  onClick={handleSubmit}
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A] transition-transform hover:scale-105 active:scale-95 ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {isSubmitting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <SendHorizonal size={14} />
                  }
                </button>
              )}
              {isPending && (
                <button
                  title="Revert to draft"
                  onClick={handleRevert}
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd] transition-transform hover:scale-105 active:scale-95 ${isReverting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {isReverting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <RotateCcw size={14} />
                  }
                </button>
              )}
              <button
                title="Email"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMailOpen(true); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
