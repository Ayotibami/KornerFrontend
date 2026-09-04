"use client";

// Insert row between content blocks in write mode.
// Collapsed: a labeled "+ Add block" pill on a divider line — always visible
// (not hover-only, which touch devices can't discover), sized for a comfortable
// tap target.
// Expanded: one icon+label pill per block type, plus Cancel.

import { useState } from "react";
import { Plus, Heading as HeadingIcon, AlignLeft, Quote, Image as ImageIcon } from "lucide-react";
import type { BlockType } from "@/types/story";

const BLOCK_TYPES: { type: BlockType; label: string; icon: typeof Plus }[] = [
  { type: "heading", label: "Heading", icon: HeadingIcon },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "image", label: "Image", icon: ImageIcon },
];

export default function BlockControls({ onInsert }: { onInsert: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="flex flex-wrap items-center gap-2 py-3">
        {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => { onInsert(type); setOpen(false); }}
            className="flex items-center gap-1.5 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] border-none rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
        <button
          onClick={() => setOpen(false)}
          className="bg-transparent border-none cursor-pointer text-gray-400 dark:text-gray-500 text-sm font-semibold px-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex w-full items-center gap-3 py-2.5 cursor-pointer"
    >
      <div className="h-px flex-1 bg-secondary dark:bg-[#2a4a7a] transition-colors group-hover:bg-primary dark:group-hover:bg-[#93b8f0]" />
      <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-secondary dark:border-[#2a4a7a] bg-white dark:bg-[#1a1f2e] px-4 py-2 text-xs font-bold text-primary dark:text-[#93b8f0] shadow-sm transition-colors group-hover:border-primary group-hover:bg-secondary/20 dark:group-hover:border-[#93b8f0] dark:group-hover:bg-[#1e3a5f]/50">
        <Plus size={14} />
        Add block
      </span>
      <div className="h-px flex-1 bg-secondary dark:bg-[#2a4a7a] transition-colors group-hover:bg-primary dark:group-hover:bg-[#93b8f0]" />
    </button>
  );
}
