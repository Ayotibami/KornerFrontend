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
import { Loader2, Rocket, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  publishStoriMaster,
  unpublishStoriMaster,
  approveStoriMaster,
  rejectStoriMaster,
} from "@/app/admin/stories/[storiId]/action";
import { getMail } from "@/app/admin/stories/[storiId]/mailAction";
import ConfirmPublishModal from "@/components/admin/stories/ConfirmPublishModal";
import RejectReasonModal from "@/components/admin/stories/RejectReasonModal";
import FabButton from "@/components/admin/ui/FabButton";

export default function MasterStoryActions({
  storiId,
  status,
  title,
  isDirty,
}: {
  storiId: string;
  status: "Draft" | "Pending" | "Published";
  title: string;
  isDirty: boolean;
}) {
  const [confirmAction, setConfirmAction] = useState<"publish" | "approve" | null>(null);
  const [mailCheck, setMailCheck] = useState<"checking" | "has-mail" | "no-mail">("checking");
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

      <RejectReasonModal
        isOpen={isRejectOpen}
        isProcessing={isRejecting}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
      />

      {!isDirty && status === "Draft" && (
        <FabButton label="Publish" icon={<Rocket size={20} />} tone="green" onClick={handlePublishClick} />
      )}

      {!isDirty && status === "Published" && (
        <FabButton
          label="Unpublish"
          icon={isUnpublishing ? <Loader2 size={20} className="animate-spin" /> : <EyeOff size={20} />}
          tone="blue"
          disabled={isUnpublishing}
          onClick={handleUnpublish}
        />
      )}

      {!isDirty && status === "Pending" && (
        <>
          <FabButton label="Approve" icon={<CheckCircle2 size={20} />} tone="green" onClick={() => setConfirmAction("approve")} />
          <FabButton label="Reject" icon={<XCircle size={20} />} tone="blue" onClick={() => setIsRejectOpen(true)} />
        </>
      )}
    </>
  );
}
