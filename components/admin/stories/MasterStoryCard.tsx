"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Loader2, Mail, Rocket, EyeOff, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { capitalize, formatDate, formatLongDateTime } from "@/lib/utils";
import {
  publishStoriMaster,
  unpublishStoriMaster,
  approveStoriMaster,
  rejectStoriMaster,
} from "@/app/admin/stories/[storiId]/action";
import { getMail } from "@/app/admin/stories/[storiId]/mailAction";
import type { MasterStory } from "@/types/story";
import MailModal from "@/components/admin/stories/MailModal";
import DeleteStoriModal from "@/components/admin/stories/DeleteStoriModal";
import ConfirmPublishModal from "@/components/admin/stories/ConfirmPublishModal";
import RejectReasonModal from "@/components/admin/stories/RejectReasonModal";

const ACTION_BTN = "w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
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
  const [confirmAction, setConfirmAction] = useState<"publish" | "approve" | null>(null);
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
      if (result.ok) { toast.success("Story published."); setConfirmAction(null); }
      else toast.error(result.message);
    });
  };

  const doApprove = () => {
    if (isApproving) return;
    startApproving(async () => {
      const result = await approveStoriMaster(story.stori_id);
      if (result.ok) { toast.success("Story approved and published."); setConfirmAction(null); }
      else toast.error(result.message);
    });
  };

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
      if (result.ok) { toast.success("Story sent back to draft."); setIsRejectOpen(false); }
      else toast.error(result.message);
    });
  };

  const statusBadge = isDraft
    ? "bg-[#DBEAFE]/90 text-[#1e40af] dark:bg-[#1e3a5f]/90 dark:text-[#93c5fd]"
    : isPending
      ? "bg-[#FEF3C7]/90 text-[#92400E] dark:bg-[#422006]/90 dark:text-[#FDE68A]"
      : "bg-[#D1FAE5]/90 text-[#065F46] dark:bg-[#022C22]/90 dark:text-[#6EE7B7]";

  return (
    <>
      <MailModal storiId={story.stori_id} isOpen={isMailOpen} onClose={() => setIsMailOpen(false)} />
      <DeleteStoriModal storiId={story.stori_id} title={story.title} isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
      <RejectReasonModal isOpen={isRejectOpen} isProcessing={isRejecting} onClose={() => setIsRejectOpen(false)} onConfirm={doReject} />
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
              <>Approving <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{story.title}&rdquo;</span> will publish it immediately and email/push notify everyone on the list.</>
            ) : story.is_own_story ? (
              <>Publishing <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{story.title}&rdquo;</span> will make it live right now and email/push notify everyone on the list.</>
            ) : (
              <>This story belongs to <span className="font-bold text-[#0f1e3d] dark:text-gray-50">{story.admin_name ?? "this admin"}</span> and is still in Draft. Publishing will email/push notify everyone on the list.</>
            )}
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

      <Link href={`/admin/stories/${story.stori_id}`} className="block group h-full">
        <div className="h-full flex flex-col bg-white dark:bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5">

          {/* Author row (only when known) */}
          {story.admin_name && (
            <div className="flex items-center gap-2 px-4 pt-3.5 pb-0">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] flex-shrink-0 ring-1 ring-gray-100 dark:ring-white/10">
                {story.avatar_url && (
                  <Image src={story.avatar_url} alt={story.admin_name} fill className="object-cover" sizes="24px" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                {story.is_own_story ? "Me" : story.admin_name}
              </span>
            </div>
          )}

          {/* Cover image with status badge overlay */}
          <div className={`relative h-[185px] bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center flex-shrink-0 ${story.admin_name ? "mt-3 mx-4 rounded-xl overflow-hidden" : ""}`}>
            {story.cover_image ? (
              <Image src={story.cover_image} alt="Cover" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-xs">No cover image</p>
            )}
            <span className={`absolute top-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm ${statusBadge}`}>
              {capitalize(story.status)}
            </span>
          </div>

          {/* Content — flex-1 fills remaining height */}
          <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
            <p className="font-semibold text-[15px] leading-snug line-clamp-2 text-[#0f1e3d] dark:text-gray-50">
              {story.title}
            </p>
            <p className="text-sm italic text-gray-500 dark:text-gray-400 line-clamp-1">
              {story.subtitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed flex-1">
              {story.excerpt}
            </p>

            {/* Footer — mt-auto pins it to the bottom */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-white/[0.06]">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[12.5px] font-medium text-gray-500 dark:text-gray-400">
                  Updated {formatDate(story.updated_at)}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  Created {formatLongDateTime(story.created_at)}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-primary" />
                    {story.reading_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {story.views} {story.views === 1 ? "view" : "views"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isDraft && (
                  <button title="Publish" onClick={handlePublish} disabled={isPublishing} className={`${ACTION_BTN} ${GREEN_SOFT}`}>
                    {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                  </button>
                )}
                {isPublished && (
                  <button title="Unpublish" onClick={handleUnpublish} disabled={isUnpublishing} className={`${ACTION_BTN} ${BLUE_SOFT}`}>
                    {isUnpublishing ? <Loader2 size={16} className="animate-spin" /> : <EyeOff size={16} />}
                  </button>
                )}
                {isPending && (
                  <>
                    <button title="Approve" onClick={handleApprove} disabled={isApproving} className={`${ACTION_BTN} ${GREEN_SOFT}`}>
                      {isApproving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    </button>
                    <button title="Reject" onClick={handleReject} disabled={isRejecting} className={`${ACTION_BTN} ${BLUE_SOFT}`}>
                      {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    </button>
                  </>
                )}
                <button title="Email" onClick={stopAnd(() => setIsMailOpen(true))} className={`${ACTION_BTN} ${RED_SOFT}`}>
                  <Mail size={16} />
                </button>
                <button title="Delete" onClick={stopAnd(() => setIsDeleteOpen(true))} className={`${ACTION_BTN} ${RED_SOLID}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
