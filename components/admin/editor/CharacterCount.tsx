"use client";

// Mobile: fixed top-right corner — clear of the bottom FAB row and out of
// the thumb/reading zone while typing.
// Desktop: right-aligned to match the FAB column exactly (same
// right-[clamp(...)] offset) and sits just above it (FAB column starts at
// top-20), reading as part of that same right-side stack instead of an
// unrelated floating badge in the corner.

import { AlignLeft } from "lucide-react";
import type { EditorBlock } from "@/context/StoryEditorContext";

// Paragraph blocks only — heading and quote are short, structural text,
// not the body copy a writer actually wants to track the length of.
// content is TipTap HTML (see EditorBlock's type comment); stripped the
// same simple way EditorBlock.tsx already strips it for heading display.
function countParagraphChars(blocks: EditorBlock[]): number {
  return blocks
    .filter((b) => b.block_type === "paragraph")
    .reduce((sum, b) => sum + b.content.replace(/<[^>]*>/g, "").length, 0);
}

export default function CharacterCount({ blocks }: { blocks: EditorBlock[] }) {
  const count = countParagraphChars(blocks);

  return (
    <div className="fixed top-3 right-3 sm:top-10 sm:right-[clamp(12px,3vw,24px)] z-[90] flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1f2e] shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700 select-none">
      <AlignLeft size={11} className="text-primary dark:text-[#93b8f0] flex-shrink-0" />
      <span className="text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">{count.toLocaleString()}</span> characters
      </span>
    </div>
  );
}
