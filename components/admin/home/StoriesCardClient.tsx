"use client";

// Interactive half of StoriesStatCard — split out because clicking a row
// needs to override the card-wide navigation (preventDefault + stopPropagation
// on a nested click), which needs client JS. Data-fetching stays in the
// Server Component parent; this just renders what it's given.
//
// Same nested-clickable pattern already used in StoryCard.tsx: an outer
// <Link> for the whole card, real <button>s inside it for the more specific
// actions, each one stopping the outer Link's navigation before doing its own.

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export type StoryStatRow = {
  label: string;
  href: string;
  count: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillColor: string;
};

export default function StoriesCardClient({ rows }: { rows: StoryStatRow[] }) {
  const router = useRouter();

  return (
    <Link
      href="/admin/stories"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#FFC700] p-5 flex flex-col gap-4 w-full max-w-sm transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
    >
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Stories
      </p>

      <div className="flex flex-col gap-1.5">
        {rows.map(({ label, href, count, icon, iconBg, iconColor, pillBg, pillColor }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(href);
            }}
            className="flex items-center justify-between rounded-lg px-1.5 py-1.5 -mx-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                {icon}
              </div>
              <span className={`text-sm font-bold font-nunito hover:underline ${iconColor}`}>
                {label}
              </span>
            </div>
            <span className={`text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center ${pillBg} ${pillColor}`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </Link>
  );
}
