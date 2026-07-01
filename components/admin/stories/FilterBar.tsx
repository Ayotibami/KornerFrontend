"use client";

// Filter bar that toggles between Draft and Published views.
// One state is always active — there is no "show all" state.
// Initial state is Draft (controlled by the home page defaulting to "Draft").
//
// Clicking the inactive button switches to it.
// Clicking the already-active button does nothing.
//
// Wrapped in <Suspense> by the parent because useSearchParams() requires it
// in Next.js App Router to avoid blocking the page.
//
// Not self-positioning — just the row of pills. Each caller wraps it in its
// own fixed bar, since /admin/stories needs to share that bar with a back
// button (stacked above the pills, both touching the Navbar directly) while
// /admin/home (writers) just needs the pills on their own.

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const FILTERS = ["Draft", "Pending", "Published"] as const;

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get("status") ?? "Draft";

  const setFilter = (status: string) => {
    if (active === status) return;
    // Push to the current path, not a hardcoded one — FilterBar now renders
    // on both /admin/home (writers) and /admin/stories (master).
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  };

  const ACTIVE_STYLES: Record<string, string> = {
    Draft:     "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]",
    Pending:   "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]",
    Published: "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]",
  };

  const btnClass = (status: string) =>
    `px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-sm font-nunito transition-colors duration-200 ${
      active === status
        ? `${ACTIVE_STYLES[status]} shadow-md cursor-default`
        : "bg-slate-200 text-slate-700 cursor-pointer dark:bg-[#1e2130] dark:text-slate-200 hover:opacity-80 transition-opacity"
    }`;

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 py-3">
      {FILTERS.map((status) => (
        <button
          key={status}
          className={btnClass(status)}
          onClick={() => setFilter(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
