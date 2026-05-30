"use client";

// Insert row between content blocks in write mode.
// Collapsed: subtle divider line with + icon — opacity 35% at rest, 100% on hover.
// Expanded: pill buttons for each block type + Cancel.

import { useState } from "react";
import { Plus } from "lucide-react";
import type { BlockType } from "@/types/story";

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "quote", label: "Quote" },
  { type: "image", label: "Image" },
];

export default function BlockControls({ onInsert }: { onInsert: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="flex flex-wrap items-center gap-2 py-2.5">
        {BLOCK_TYPES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => { onInsert(type); setOpen(false); }}
            className="bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] border-none rounded-full px-[18px] py-2 text-[13px] font-bold font-nunito cursor-pointer"
          >
            + {label}
          </button>
        ))}
        <button
          onClick={() => setOpen(false)}
          className="bg-transparent border-none cursor-pointer text-gray-400 dark:text-gray-500 text-[13px] font-semibold font-nunito px-2"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 py-1.5 cursor-pointer opacity-[0.35] hover:opacity-100 transition-opacity duration-200"
    >
      <div className="flex-1 h-px bg-primary dark:bg-[#2a4a7a]" />
      <Plus size={16} className="text-primary dark:text-[#93b8f0]" />
      <div className="flex-1 h-px bg-primary dark:bg-[#2a4a7a]" />
    </div>
  );
}
