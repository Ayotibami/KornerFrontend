"use client";

// One row on the writers page — avatar, name, verified status badge, and a
// Verify/Unverify button. is_self hides the Unverify button entirely, since
// the backend already rejects a master trying to unverify their own account.
//
// Verified badge reuses check-pop-active (the same confident pop used on the
// "Published" stat icon) — unverified gets attention-pulse-active instead,
// a pulsing red glow specifically meant to draw the eye toward admins
// still waiting on a decision.
//
// The whole row links to /admin/stories?admin=<id> (that admin's stories).
// Avatar and Verify/Unverify override that with preventDefault/stopPropagation
// — same nested-clickable pattern as StoryCard.tsx and StoriesCardClient.tsx.

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { verifyAdmin, unverifyAdmin } from "@/app/admin/writers/action";
import AdminDetailModal from "./AdminDetailModal";
import type { AdminListItem } from "@/types/admin";

const BTN_GREEN_SOFT =
  "flex items-center gap-2 bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7] rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_RED_SOFT =
  "flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export default function WriterCard({
  admin: initialAdmin,
  storyCount,
}: {
  admin: AdminListItem;
  storyCount: number;
}) {
  // Optimistic local copy so the badge/button flip immediately on success
  // instead of waiting on revalidatePath to round-trip back down.
  const [admin, setAdmin] = useState(initialAdmin);
  const [isPending, startTransition] = useTransition();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleVerify = () => {
    startTransition(async () => {
      const result = await verifyAdmin(admin.admin_id);
      if (result.ok) {
        setAdmin((a) => ({ ...a, is_verified: true }));
        toast.success(`${admin.admin_name} verified.`);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUnverify = () => {
    if (admin.is_protected) {
      toast.error("You wan unverify ceo ke ? you get mind o");
      return;
    }
    startTransition(async () => {
      const result = await unverifyAdmin(admin.admin_id);
      if (result.ok) {
        setAdmin((a) => ({ ...a, is_verified: false }));
        toast.success(`${admin.admin_name} unverified.`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <AdminDetailModal
        adminId={admin.admin_id}
        isSelf={admin.is_self}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <Link
        href={`/admin/stories?admin=${admin.admin_id}`}
        className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4 transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
      >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          title={`View ${admin.admin_name}'s profile`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDetailOpen(true);
          }}
          className={`relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex-shrink-0 ring-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
            admin.is_verified
              ? "ring-[#22C55E] dark:ring-[#22C55E]"
              : "ring-[#DC2626] dark:ring-[#DC2626]"
          }`}
        >
          {admin.avatar_url && (
            <Image
              src={admin.avatar_url}
              alt={admin.admin_name}
              fill
              className="object-cover"
              sizes="48px"
            />
          )}
        </button>

        <div className="flex flex-col gap-1 min-w-0">
          <p className="font-semibold text-[#0f1e3d] dark:text-gray-50 truncate">
            {admin.admin_name}
          </p>
          {/* Stacked on mobile so the two pieces don't crowd into each
              other on narrow screens — inline (with a separator) from sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-1.5">
              {admin.is_verified ? (
                <>
                  <ShieldCheck size={14} className="text-[#065F46] dark:text-[#6EE7B7] check-pop-active" />
                  <span className="text-xs font-semibold text-[#065F46] dark:text-[#6EE7B7]">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert size={14} className="text-[#DC2626] dark:text-[#FCA5A5] attention-pulse-active" />
                  <span className="text-xs font-semibold text-[#DC2626] dark:text-[#FCA5A5]">
                    Not verified
                  </span>
                </>
              )}
            </div>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">·</span>
            <div className="flex items-center gap-1">
              <BookOpen size={13} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {storyCount} {storyCount === 1 ? "story" : "stories"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!admin.is_self && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            (admin.is_verified ? handleUnverify : handleVerify)();
          }}
          disabled={isPending}
          className={admin.is_verified ? BTN_RED_SOFT : BTN_GREEN_SOFT}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : admin.is_verified ? (
            <ShieldAlert size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          {admin.is_verified ? "Unverify" : "Verify"}
        </button>
      )}
      </Link>
    </>
  );
}
