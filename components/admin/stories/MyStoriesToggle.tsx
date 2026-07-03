"use client";

// Master-only toggle, shown alongside the status pills in FilterBar.
// Switches the home page between "All admins" (everyone's stories,
// MasterStoriesList) and "Only mine" (just the master's own, MyStoriesList).
//
// The circular button always keeps the same background as the inactive
// status pills — state reads through the crown itself, not the container:
// golden + swinging (crown-active, defined in globals.css) when active,
// flat gray and still when not.

import { useSearchParams, useRouter } from "next/navigation";

export default function MyStoriesToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = searchParams.get("mine") === "true";
  const status = searchParams.get("status") ?? "Draft";

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) params.delete("mine");
    else params.set("mine", "true");
    params.set("status", status);
    router.push(`/admin/home?${params.toString()}`);
  };

  const inactiveColor = "text-slate-400 dark:text-slate-500";

  return (
    <button
      onClick={toggle}
      title={isActive ? "Showing only my stories" : "Showing all admins' stories"}
      className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-200 dark:bg-[#1a1f2e] dark:border-white/[0.08] cursor-pointer transition-transform hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-5 h-5 sm:w-[22px] sm:h-[22px] ${isActive ? "crown-active" : ""}`}
      >
        <defs>
          <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="45%" stopColor="#FFC700" />
            <stop offset="100%" stopColor="#E8A300" />
          </linearGradient>
        </defs>
        <path
          d="M3 18.5L1.6 7.8a0.8 0.8 0 0 1 1.24-0.77L7 9.8l4.2-5.4a1 1 0 0 1 1.6 0L17 9.8l4.16-2.77a0.8 0.8 0 0 1 1.24 0.77L21 18.5H3Z"
          fill={isActive ? "url(#crownGold)" : "currentColor"}
          className={isActive ? "" : inactiveColor}
        />
        <rect
          x="3"
          y="18.5"
          width="18"
          height="2.2"
          rx="0.8"
          fill={isActive ? "url(#crownGold)" : "currentColor"}
          className={isActive ? "" : inactiveColor}
        />
        <circle cx="2.4" cy="7.4" r="1.5" fill={isActive ? "#FFE066" : "currentColor"} className={isActive ? "" : inactiveColor} />
        <circle cx="12" cy="4.3" r="1.6" fill={isActive ? "#FFE066" : "currentColor"} className={isActive ? "" : inactiveColor} />
        <circle cx="21.6" cy="7.4" r="1.5" fill={isActive ? "#FFE066" : "currentColor"} className={isActive ? "" : inactiveColor} />
      </svg>
    </button>
  );
}
