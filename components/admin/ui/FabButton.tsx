"use client";

// Floating action button used on the story create/edit pages (mode toggle,
// save, publish, mail, delete, etc). Previously icon-only circles relying on
// a `title` tooltip for the label — invisible on touch devices, since there's
// no hover to trigger it.
//
// Mobile (no hover to rely on): label always visible, stacked under the icon
// in a compact tile.
// Desktop (has hover, and room is tighter in the fixed right-hand column):
// stays a clean icon-only circle at rest; the label fades in as a small dark
// tooltip to the left on hover *or* keyboard focus — absolutely positioned,
// so revealing it never shifts or resizes anything else in the column.

import type { ReactNode } from "react";

const TONES = {
  teal:     "bg-[#CCFBF1] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]",
  violet:   "bg-[#EDE9FE] dark:bg-[#2E1065] text-[#5B21B6] dark:text-[#C4B5FD]",
  blue:     "bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0]",
  amber:    "bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]",
  red:      "bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]",
  redSolid: "bg-[#DC2626] text-white",
  green:    "bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]",
} as const;

export type FabTone = keyof typeof TONES;

export default function FabButton({
  label,
  icon,
  tone,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: ReactNode;
  tone: FabTone;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl text-center shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-95 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:h-[52px] sm:w-[52px] sm:rounded-full ${
        disabled ? "" : "cursor-pointer"
      } ${TONES[tone]}`}
    >
      {icon}
      {/* Mobile: always-visible label under the icon — no hover to reveal it there. */}
      <span className="text-[10px] font-bold leading-tight sm:hidden">{label}</span>

      {/* Desktop: dark tooltip fading in to the left, out of normal flow so it
          never shifts sibling FABs in this fixed right-hand column. */}
      <span
        className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0f1e3d] px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 dark:bg-black sm:block sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}
