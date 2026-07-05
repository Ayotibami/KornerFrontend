"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
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
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Stories
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF8E1] dark:bg-[#3a2e05]">
          <BookOpen size={14} className="text-[#C77F00] dark:text-[#FFC700]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map(({ label, href, count, icon, iconBg, iconColor, pillBg, pillColor }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(href);
            }}
            className="flex items-center justify-between rounded-xl px-2 py-2 -mx-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                {icon}
              </div>
              <span className={`text-sm font-medium ${iconColor}`}>
                {label}
              </span>
            </div>
            <span className={`text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center ${pillBg} ${pillColor}`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </Link>
  );
}
