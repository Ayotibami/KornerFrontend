// Card component for a single story in the stories grid on the home page.
// The entire card is a Next.js Link — clicking anywhere navigates to the edit page.
// Fixed height (500px) keeps the grid visually consistent regardless of content length.
//
// Status badge:
//   Draft     — light blue bg + dark blue text (light) / dark navy bg + white text (dark)
//   Published — brand blue background, white text (both modes)

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { capitalize, formatDate } from "@/lib/utils";
import type { Story } from "@/types/story";
import { PRIMARY } from "@/constants/theme";

export default function StoryCard({ story }: { story: Story }) {
  const isDraft = story.status === "Draft";
  const isPending = story.status === "Pending";

  return (
    <Link href={`/admin/stories/${story.stori_id}`} className="block">
      <div className="h-[540px] p-5 rounded-2xl bg-white dark:bg-[#1a1f2e] shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col gap-3 overflow-hidden transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">

        {/* Reading time + Draft/Published badge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
            <Clock size={12} color={PRIMARY} />
            <span>{story.reading_time}</span>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-xl font-semibold ${
              isDraft
                ? "bg-secondary text-[#0E3E87] dark:bg-[#1e3a5f] dark:text-white"
                : isPending
                  ? "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]"
                  : "bg-primary text-white"
            }`}
          >
            {capitalize(story.status)}
          </span>
        </div>

        {/* Cover image — shows a placeholder if none is set */}
        <div className="relative h-[300px] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center flex-shrink-0">
          {story.cover_image ? (
            <Image
              src={story.cover_image}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No cover image</p>
          )}
        </div>

        {/* Story metadata */}
        <p className="font-bold text-xl leading-snug line-clamp-1 text-[#0f1e3d] dark:text-gray-50">{story.title}</p>
        <p className="text-base italic text-gray-700 dark:text-gray-300 line-clamp-1">{story.subtitle}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{story.excerpt}</p>

        {/* Date pushed to the bottom with mt-auto */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">{formatDate(story.created_at)}</p>
      </div>
    </Link>
  );
}
