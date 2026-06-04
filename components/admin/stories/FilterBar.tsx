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

import { useSearchParams, useRouter } from "next/navigation";

const FILTERS = ["Draft", "Pending", "Published"] as const;

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams.get("status") ?? "Draft";

  const setFilter = (status: string) => {
    if (active === status) return;
    router.push(`/admin/home?status=${status}`);
  };

  const btnClass = (status: string) =>
    `px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-sm font-nunito transition-colors duration-200 ${
      active === status
        ? "bg-primary text-white shadow-md cursor-default"
        : "bg-secondary text-primary cursor-pointer dark:bg-[#1e3a5f] dark:text-[#93b8f0]"
    }`;

  return (
    <div className="fixed top-[14vh] left-0 right-0 z-[4] flex justify-center gap-3 sm:gap-4 py-3 bg-slate-100/90 dark:bg-[#0f1117]/90 backdrop-blur-sm">
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
