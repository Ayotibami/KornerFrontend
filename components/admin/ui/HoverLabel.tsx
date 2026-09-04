"use client";

import type { ReactNode } from "react";

// Small dark tooltip that fades in above its trigger on hover or keyboard
// focus. For compact, icon-only controls (drag handle, delete) where a
// permanent visible caption next to every instance would clutter the list
// they sit in — unlike FabButton's tooltip (which points left, for a fixed
// right-hand column), this points down at a trigger sitting inline in
// normal content flow.
export default function HoverLabel({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  /** Extra classes for the wrapping span — e.g. flex-item sizing/spacing that
   * needs to apply at the same level as the trigger did before it was
   * wrapped (flex-shrink-0, margins), not on the trigger itself. */
  className?: string;
}) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0f1e3d] px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-black">
        {label}
      </span>
    </span>
  );
}
