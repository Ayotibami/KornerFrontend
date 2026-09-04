"use client";

// Admin-scoped 404. Without this file, notFound() anywhere under /admin
// (a deleted/invalid story's edit, view, or analytics page — all three call
// it) falls through to the root app/not-found.tsx instead — the *public*
// site's 404, whose only escape routes point to "/" and the public brand.
// An admin landing there via a dead internal link gets dumped onto the
// public marketing site instead of back into their own dashboard.

import Link from "next/link";
import { Home } from "lucide-react";

export default function AdminNotFound() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
        Korner Admin
      </p>
      <h1 className="text-2xl font-bold text-[#0f1e3d] dark:text-gray-50">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
        This page doesn&apos;t exist — it may have been deleted, or the link is out of date.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
        <button
          onClick={() => history.back()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1f2e] text-gray-500 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          Go back
        </button>
        <Link
          href="/admin/home"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Home size={14} />
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
