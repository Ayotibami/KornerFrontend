"use client";

// Card used everywhere master views stories — the "all admins" grid, "only
// mine", or a single specific admin's stories. Same shell/sizing as the
// writer-facing StoryCard, plus an author row (avatar + name) that only
// renders when admin_name is present — callers where the author is already
// known from the page itself (only mine, one specific admin) simply omit it,
// rather than this card having different variants per context.
//
// Action buttons are larger than the writer card's (w-11 vs w-8) and
// color-coded by destination status, matching the existing status badge
// palette (Draft=blue, Pending=amber, Published=green):
//   Draft     -> Publish   (green, since it leads to Published)
//   Published -> Unpublish (blue, since it leads to Draft)
//   Pending   -> Approve (green) + Reject (blue) — distinct from the
//               generic publish/unpublish toggle since Pending is a
//               review state, not just "not published yet"
// Mail stays the existing soft-red action. Delete is solid red (not soft
// tint like the rest) to visually read as more severe — it opens a
// confirmation modal instead of acting immediately.

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Loader2, Mail, Rocket, EyeOff, Eye, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { capitalize, formatDate, formatFullDate } from "@/lib/utils";
import {
  publishStoriMaster,
  unpublishStoriMaster,
  approveStoriMaster,
  rejectStoriMaster,
} from "@/app/admin/stories/[storiId]/action";
import { getMail } from "@/app/admin/stories/[storiId]/mailAction";
import type { MasterStory } from "@/types/story";
import { PRIMARY } from "@/constants/theme";
import MailModal from "@/components/admin/stories/MailModal";
import DeleteStoriModal from "@/components/admin/stories/DeleteStoriModal";
import ConfirmPublishModal from "@/components/admin/stories/ConfirmPublishModal";
import RejectReasonModal from "@/components/admin/stories/RejectReasonModal";

const ACTION_BTN = "w-11 h-11 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
const GREEN_SOFT = "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]";
const BLUE_SOFT = "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]";
const RED_SOFT = "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5]";
const RED_SOLID = "bg-[#DC2626] text-white";

export default function MasterStoryCard({ story }: { story: MasterStory }) {
  const isDraft = story.status === "Draft";
  const isPending = story.status === "Pending";
  const isPublished = story.status === "Published";

  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  // Publish and Approve are both "this goes live right now and blasts
  // everyone" actions, so they share one confirm modal — this tracks which
  // of the two (if either) is currently being confirmed.
  const [confirmAction, setConfirmAction] = useState<"publish" | "approve" | null>(null);
  // Re-checked fresh every time Publish is clicked — see handlePublish.
  // Attaching a mail right before clicking Publish, in the same visit, must
  // not show a warning based on stale data from when the page first loaded.
  const [mailCheck, setMailCheck] = useState<"checking" | "has-mail" | "no-mail">("checking");
  const [isPublishing, startPublishing] = useTransition();
  const [isUnpublishing, startUnpublishing] = useTransition();
  const [isApproving, startApproving] = useTransition();
  const [isRejecting, startRejecting] = useTransition();

  const stopAnd = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const doPublish = () => {
    if (isPublishing) return;
    startPublishing(async () => {
      const result = await publishStoriMaster(story.stori_id);
      if (result.ok) {
        toast.success("Story published.");
        setConfirmAction(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const doApprove = () => {
    if (isApproving) return;
    startApproving(async () => {
      const result = await approveStoriMaster(story.stori_id);
      if (result.ok) {
        toast.success("Story approved and published.");
        setConfirmAction(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  // Both publish and approve always confirm first now — going live fires a
  // mail blast + push notification to everyone, same blast radius as the
  // newsletter/push sends that already get a preview before sending.
  const handlePublish = stopAnd(() => {
    setConfirmAction("publish");
    setMailCheck("checking");
    getMail(story.stori_id).then((result) => {
      setMailCheck(result.ok && result.data !== null ? "has-mail" : "no-mail");
    });
  });
  const handleApprove = stopAnd(() => setConfirmAction("approve"));

  const handleUnpublish = stopAnd(() => {
    if (isUnpublishing) return;
    startUnpublishing(async () => {
      const result = await unpublishStoriMaster(story.stori_id);
      if (result.ok) toast.success("Story unpublished.");
      else toast.error(result.message);
    });
  });

  const handleReject = stopAnd(() => setIsRejectOpen(true));

  const doReject = (reason: string) => {
    if (isRejecting) return;
    startRejecting(async () => {
      const result = await rejectStoriMaster(story.stori_id, reason);
      if (result.ok) {
        toast.success("Story sent back to draft.");
        setIsRejectOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <MailModal
        storiId={story.stori_id}
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
      />
      <DeleteStoriModal
        storiId={story.stori_id}
        title={story.title}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
      <RejectReasonModal
        isOpen={isRejectOpen}
        isProcessing={isRejecting}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={doReject}
      />
      <ConfirmPublishModal
        icon={
          confirmAction === "approve"
            ? <CheckCircle2 size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
            : <Rocket size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
        }
        title={confirmAction === "approve" ? "Approve This Story?" : "Publish This Draft?"}
        description={
          <>
            {confirmAction === "approve" ? (
              <>
                Approving <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{story.title}&rdquo;</span> will publish it immediately and email/push notify everyone on the list.
              </>
            ) : story.is_own_story ? (
              <>
                Publishing <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{story.title}&rdquo;</span> will make it live right now and email/push notify everyone on the list.
              </>
            ) : (
              <>
                This story belongs to <span className="font-bold text-[#0f1e3d] dark:text-gray-50">{story.admin_name ?? "this admin"}</span> and is still in Draft — it hasn&apos;t been submitted for review. Publishing will email/push notify everyone on the list.
              </>
            )}
            {/* Approve never hits this — a story can't reach Pending without
                a mail already attached (enforced at submit time). Only the
                direct-publish path can skip a mail entirely. */}
            {confirmAction === "publish" && mailCheck === "no-mail" && (
              <p className="mt-3 text-sm font-semibold text-[#92400E] dark:text-[#FDE68A] bg-[#FEF3C7] dark:bg-[#422006] rounded-lg px-3 py-2">
                ⚠️ No mail is attached — subscribers will not be emailed about this.
              </p>
            )}
          </>
        }
        confirmLabel={confirmAction === "approve" ? "Yes, Approve It" : "Yes, Publish It"}
        isOpen={confirmAction !== null}
        isProcessing={confirmAction === "approve" ? isApproving : isPublishing}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmAction === "approve" ? doApprove : doPublish}
      />
      <Link href={`/admin/stories/${story.stori_id}`} className="block">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1f2e] shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col gap-3 overflow-hidden transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">

          {/* Author row (only when known) + Draft/Pending/Published badge */}
          <div className={`flex items-center ${story.admin_name ? "justify-between" : "justify-end"}`}>
            {story.admin_name && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex-shrink-0">
                  {story.avatar_url && (
                    <Image
                      src={story.avatar_url}
                      alt={story.admin_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">
                  {story.is_own_story ? "Me" : story.admin_name}
                </span>
              </div>
            )}
            <span
              className={`text-xs px-2.5 py-1 rounded-xl font-semibold flex-shrink-0 ${
                isDraft
                  ? BLUE_SOFT
                  : isPending
                    ? "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]"
                    : GREEN_SOFT
              }`}
            >
              {capitalize(story.status)}
            </span>
          </div>

          {/* Cover image — shows a placeholder if none is set */}
          <div className="relative h-[180px] sm:h-[210px] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center flex-shrink-0">
            {story.cover_image ? (
              <Image
                src={story.cover_image}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">No cover image</p>
            )}
          </div>

          {/* Story metadata */}
          <p className="font-bold text-lg sm:text-xl leading-snug line-clamp-1 text-[#0f1e3d] dark:text-gray-50">{story.title}</p>
          <p className="text-sm sm:text-base italic text-gray-700 dark:text-gray-300 line-clamp-1">{story.subtitle}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{story.excerpt}</p>

          {/* Reading time + view count — views only ever accrues from the
              real public reader page, so it's always an accurate read count,
              never inflated by admin/master previewing their own draft. */}
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <Clock size={12} color={PRIMARY} />
              <span>{story.reading_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{story.views} {story.views === 1 ? "view" : "views"}</span>
            </div>
          </div>

          {/* Dates + actions */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Last updated {formatDate(story.updated_at)}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Created {formatFullDate(story.created_at)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isDraft && (
                <button
                  title="Publish"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className={`${ACTION_BTN} ${GREEN_SOFT}`}
                >
                  {isPublishing
                    ? <Loader2 size={20} className="animate-spin" />
                    : <Rocket size={20} />
                  }
                </button>
              )}

              {isPublished && (
                <button
                  title="Unpublish"
                  onClick={handleUnpublish}
                  disabled={isUnpublishing}
                  className={`${ACTION_BTN} ${BLUE_SOFT}`}
                >
                  {isUnpublishing
                    ? <Loader2 size={20} className="animate-spin" />
                    : <EyeOff size={20} />
                  }
                </button>
              )}

              {isPending && (
                <>
                  <button
                    title="Approve"
                    onClick={handleApprove}
                    disabled={isApproving}
                    className={`${ACTION_BTN} ${GREEN_SOFT}`}
                  >
                    {isApproving
                      ? <Loader2 size={20} className="animate-spin" />
                      : <CheckCircle2 size={20} />
                    }
                  </button>
                  <button
                    title="Reject"
                    onClick={handleReject}
                    disabled={isRejecting}
                    className={`${ACTION_BTN} ${BLUE_SOFT}`}
                  >
                    {isRejecting
                      ? <Loader2 size={20} className="animate-spin" />
                      : <XCircle size={20} />
                    }
                  </button>
                </>
              )}

              <button
                title="Email"
                onClick={stopAnd(() => setIsMailOpen(true))}
                className={`${ACTION_BTN} ${RED_SOFT}`}
              >
                <Mail size={20} />
              </button>

              <button
                title="Delete"
                onClick={stopAnd(() => setIsDeleteOpen(true))}
                className={`${ACTION_BTN} ${RED_SOLID}`}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
