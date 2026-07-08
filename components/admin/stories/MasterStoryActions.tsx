"use client";

// Master-only action buttons for the single-story view/edit page — Publish,
// Approve/Reject, Unpublish, Delete, depending on the story's current status.
// Pulled into its own component (rather than inline in EditStoryEditor) so
// the page only has to render it conditionally based on role, instead of
// branching on role for every individual button.
//
// Same underlying actions/modals as MasterStoryCard.tsx on the dashboard —
// Publish/Approve both confirm first (going live fires a mail blast + push
// to everyone, same blast radius as the newsletter/push sends that already
// get a preview screen), Delete needs a typed DELETE confirm. Visual shape
// is the page's floating circular action buttons (FABs) instead of
// MasterStoryCard's inline pills, to match everything else on this page.
//
// No ownership-aware publish copy here (unlike MasterStoryCard) — on this
// page master has already read the full story before reaching for Publish,
// so the "this isn't yours yet" warning that matters on a list view matters
// less here. Kept simple on purpose.
//
// The no-mail warning is checked FRESH every time the Publish confirm opens
// (via the same getMail used by the Mail modal) rather than relying on
// whatever mail status the page had at load time — attaching a mail just
// before clicking Publish, in the same visit, must not show a stale warning.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket, EyeOff, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  publishStoriMaster,
  unpublishStoriMaster,
  approveStoriMaster,
  rejectStoriMaster,
} from "@/app/admin/stories/[storiId]/action";
import { getMail } from "@/app/admin/stories/[storiId]/mailAction";
import ConfirmPublishModal from "@/components/admin/stories/ConfirmPublishModal";
import DeleteStoriModal from "@/components/admin/stories/DeleteStoriModal";
import RejectReasonModal from "@/components/admin/stories/RejectReasonModal";

// w-10/h-10 (40px) on small screens to match EditStoryEditor's FAB_BASE —
// these buttons render inline with that page's own FABs in the same row, so
// they need to shrink at the same breakpoint to stay visually consistent.
const FAB_BASE = "w-10 h-10 sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0";
const FAB_GREEN = `${FAB_BASE} bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]`; // publish / approve
const FAB_BLUE = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0]`; // unpublish / reject
const FAB_RED_SOLID = `${FAB_BASE} bg-[#DC2626] text-white`; // delete

export default function MasterStoryActions({
  storiId,
  status,
  title,
  mode,
}: {
  storiId: string;
  status: "Draft" | "Pending" | "Published";
  title: string;
  mode: "write" | "read";
}) {
  const router = useRouter();

  const [confirmAction, setConfirmAction] = useState<"publish" | "approve" | null>(null);
  // Re-checked fresh every time Publish is clicked — see file header comment.
  const [mailCheck, setMailCheck] = useState<"checking" | "has-mail" | "no-mail">("checking");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isPublishing, startPublishing] = useTransition();
  const [isUnpublishing, startUnpublishing] = useTransition();
  const [isApproving, startApproving] = useTransition();
  const [isRejecting, startRejecting] = useTransition();

  const handlePublishClick = () => {
    setConfirmAction("publish");
    setMailCheck("checking");
    getMail(storiId).then((result) => {
      setMailCheck(result.ok && result.data !== null ? "has-mail" : "no-mail");
    });
  };

  const doPublish = () => {
    if (isPublishing) return;
    startPublishing(async () => {
      const result = await publishStoriMaster(storiId);
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
      const result = await approveStoriMaster(storiId);
      if (result.ok) {
        toast.success("Story approved and published.");
        setConfirmAction(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUnpublish = () => {
    if (isUnpublishing) return;
    startUnpublishing(async () => {
      const result = await unpublishStoriMaster(storiId);
      if (result.ok) toast.success("Story unpublished.");
      else toast.error(result.message);
    });
  };

  const handleReject = (reason: string) => {
    if (isRejecting) return;
    startRejecting(async () => {
      const result = await rejectStoriMaster(storiId, reason);
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
      <ConfirmPublishModal
        icon={
          confirmAction === "approve"
            ? <CheckCircle2 size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
            : <Rocket size={16} className="text-[#065F46] dark:text-[#6EE7B7]" />
        }
        title={confirmAction === "approve" ? "Approve This Story?" : "Publish This Story?"}
        description={
          <>
            {confirmAction === "approve" ? (
              <>
                Approving <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{title}&rdquo;</span> will publish it immediately and email/push notify everyone on the list.
              </>
            ) : (
              <>
                Publishing <span className="font-bold text-[#0f1e3d] dark:text-gray-50">&ldquo;{title}&rdquo;</span> will make it live right now and email/push notify everyone on the list.
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

      <DeleteStoriModal
        storiId={storiId}
        title={title}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => router.push("/admin/home")}
      />

      <RejectReasonModal
        isOpen={isRejectOpen}
        isProcessing={isRejecting}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
      />

      {status === "Draft" && mode === "read" && (
        <button
          title="Publish"
          className={`${FAB_GREEN} cursor-pointer`}
          onClick={handlePublishClick}
        >
          <Rocket size={20} />
        </button>
      )}

      {status === "Published" && (
        <button
          title="Unpublish"
          className={`${FAB_BLUE} ${isUnpublishing ? "" : "cursor-pointer"}`}
          disabled={isUnpublishing}
          onClick={handleUnpublish}
        >
          {isUnpublishing ? <Loader2 size={20} className="animate-spin" /> : <EyeOff size={20} />}
        </button>
      )}

      {status === "Pending" && (
        <>
          <button
            title="Approve"
            className={`${FAB_GREEN} cursor-pointer`}
            onClick={() => setConfirmAction("approve")}
          >
            <CheckCircle2 size={20} />
          </button>
          <button
            title="Reject"
            className={`${FAB_BLUE} cursor-pointer`}
            onClick={() => setIsRejectOpen(true)}
          >
            <XCircle size={20} />
          </button>
        </>
      )}

      <button
        title="Delete"
        className={`${FAB_RED_SOLID} cursor-pointer`}
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 size={20} />
      </button>
    </>
  );
}
