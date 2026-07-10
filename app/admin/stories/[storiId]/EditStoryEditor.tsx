"use client";

// Edit story editor — client component that receives server-fetched story data as props
// and seeds the StoryEditorContext so all editor sub-components can read/write it.
//
// Image upload is deferred: picking a file just shows a local blob preview.
// The actual Cloudinary upload happens on Save so no orphaned images are created
// while the admin drafts and refines their image choice.
//
// isDirty — how it works:
//   When the page loads, we snapshot the story's initial values (from the server props).
//   On every render, we compare the current context state against that snapshot.
//   If anything differs → isDirty = true → show the save button.
//   We also include pending files (picked but not yet uploaded) as a dirty signal.

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, BookCheck, Eye, Loader2, Mail, Pencil, SendHorizonal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStoryEditor } from "@/context/StoryEditorContext";
import CoverImage from "@/components/admin/editor/CoverImage";
import StoryEditor from "@/components/admin/editor/StoryEditor";
import {
  TitleField,
  SubTitleField,
  ExcerptField,
  ReadTimeField,
} from "@/components/admin/editor/MetaFields";
import { updateStory, submitStoryForReview, type StoriDetail } from "./action";
import { autosaveExistingStory } from "@/app/admin/stories/autosaveActions";
import { useAutosave } from "@/hooks/useAutosave";
import MailModal from "@/components/admin/stories/MailModal";
import MasterStoryActions from "@/components/admin/stories/MasterStoryActions";
import DeleteStoriModal from "@/components/admin/stories/DeleteStoriModal";
import SaveIndicator from "@/components/admin/editor/SaveIndicator";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { EditorBlock } from "@/context/StoryEditorContext";
import type { BlockType } from "@/types/story";

const FAB_BASE   = "w-10 h-10 sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90 flex-shrink-0";
const FAB_AMBER  = `${FAB_BASE} bg-[#FEF3C7] dark:bg-[#422006]  text-[#92400E] dark:text-[#FDE68A]`;
const FAB_TEAL   = `${FAB_BASE} bg-[#CCFBF1] dark:bg-[#022C22]  text-[#065F46] dark:text-[#6EE7B7]`;
const FAB_VIOLET = `${FAB_BASE} bg-[#EDE9FE] dark:bg-[#2E1065]  text-[#5B21B6] dark:text-[#C4B5FD]`;
const FAB_BLUE   = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f]  text-primary   dark:text-[#93b8f0]`;
const FAB_RED      = `${FAB_BASE} bg-[#FEE2E2] dark:bg-[#450a0a]  text-[#DC2626] dark:text-[#FCA5A5]`;
const FAB_RED_SOLID = `${FAB_BASE} bg-[#DC2626] text-white`;

function blockWithoutId({ id: _id, ...rest }: EditorBlock) {
  return rest;
}

export default function EditStoryEditor({
  stori,
  storiId,
  role,
}: {
  stori: StoriDetail;
  storiId: string;
  role: "master" | "writer";
}) {
  const {
    mode,
    setMode,
    title,
    setTitle,
    subTitle,
    setSubTitle,
    excerpt,
    setExcerpt,
    readTime,
    setReadTime,
    coverImage,
    setCoverImage,
    blocks,
    setBlocks,
    insertBlock,
    updateBlock,
    updateImageBlock,
    deleteBlock,
    moveBlock,
    pendingCoverFile, setPendingCoverFile,
    pendingBlockFiles, setPendingBlockFile, clearPendingFiles,
  } = useStoryEditor();
  const router = useRouter();

  const DRAFT_KEY = `korner-edit-draft-${storiId}`;
  const [recoveryData, setRecoveryData] = useState<{
    title: string;
    subTitle: string;
    excerpt: string;
    readTime: string;
    coverImage: string | null;
    blocks: EditorBlock[];
  } | null>(null);

  const initialTitleRef     = useRef(stori.title ?? "");
  const initialSubTitleRef  = useRef(stori.subtitle ?? "");
  const initialExcerptRef   = useRef(stori.excerpt ?? "");
  const initialReadTimeRef  = useRef(stori.readingTime ?? "");
  const initialCoverRef     = useRef<string | null>(stori.coverImage ?? null);
  const initialBlocksRef    = useRef<EditorBlock[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMode("read");
    setTitle(stori.title ?? "");
    setSubTitle(stori.subtitle ?? "");
    setExcerpt(stori.excerpt ?? "");
    setReadTime(stori.readingTime ?? "");
    setCoverImage(stori.coverImage ?? null);

    const transformedBlocks: EditorBlock[] = (stori.blocks ?? [])
      .sort((a, b) => a.position - b.position)
      .map((b) => ({
        id: b.blockId,
        block_type: b.blockType as BlockType,
        content: b.content ?? "",
        image_url: b.image_url ?? "",
        image_public_id: b.imagePublicId,
        position: b.position,
      }));

    setBlocks(transformedBlocks);

    initialTitleRef.current    = stori.title ?? "";
    initialSubTitleRef.current = stori.subtitle ?? "";
    initialExcerptRef.current  = stori.excerpt ?? "";
    initialReadTimeRef.current = stori.readingTime ?? "";
    initialCoverRef.current    = stori.coverImage ?? null;
    initialBlocksRef.current   = transformedBlocks;

    const saved = localStorage.getItem(`korner-edit-draft-${storiId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const blocksDiffer =
          JSON.stringify((parsed.blocks ?? []).map(blockWithoutId)) !==
          JSON.stringify(transformedBlocks.map(blockWithoutId));
        const fieldsDiffer =
          parsed.title      !== (stori.title      ?? "") ||
          parsed.subTitle   !== (stori.subtitle   ?? "") ||
          parsed.excerpt    !== (stori.excerpt    ?? "") ||
          parsed.readTime   !== (stori.readingTime ?? "") ||
          parsed.coverImage !== (stori.coverImage ?? null);
        if (blocksDiffer || fieldsDiffer) {
          setRecoveryData(parsed);
        } else {
          localStorage.removeItem(`korner-edit-draft-${storiId}`);
        }
      } catch {
        localStorage.removeItem(`korner-edit-draft-${storiId}`);
      }
    }

    return () => {
      setMode("read");
      setTitle("");
      setSubTitle("");
      setExcerpt("");
      setReadTime("");
      setCoverImage(null);
      setBlocks([]);
      initialBlocksRef.current = [];
    };
  }, []); // intentionally empty — seed once on mount only

  const simpleFieldsChanged =
    title     !== initialTitleRef.current    ||
    subTitle  !== initialSubTitleRef.current ||
    excerpt   !== initialExcerptRef.current  ||
    readTime  !== initialReadTimeRef.current ||
    coverImage !== initialCoverRef.current;

  const blocksChanged =
    JSON.stringify(blocks.map(blockWithoutId)) !==
    JSON.stringify(initialBlocksRef.current.map(blockWithoutId));

  const hasPendingFiles =
    pendingCoverFile !== null || Object.keys(pendingBlockFiles).length > 0;

  const isDirty = simpleFieldsChanged || blocksChanged || hasPendingFiles;

  useEffect(() => {
    const isCurrentlyDirty =
      title     !== initialTitleRef.current    ||
      subTitle  !== initialSubTitleRef.current ||
      excerpt   !== initialExcerptRef.current  ||
      readTime  !== initialReadTimeRef.current ||
      coverImage !== initialCoverRef.current   ||
      JSON.stringify(blocks.map(blockWithoutId)) !==
        JSON.stringify(initialBlocksRef.current.map(blockWithoutId));
    if (!isCurrentlyDirty) return;
    localStorage.setItem(
      `korner-edit-draft-${storiId}`,
      JSON.stringify({ title, subTitle, excerpt, readTime, coverImage, blocks }),
    );
  }, [storiId, title, subTitle, excerpt, readTime, coverImage, blocks]);

  useEffect(() => {
    const savedId = localStorage.getItem("korner-create-draft-id");
    if (savedId === storiId) {
      localStorage.removeItem("korner-create-draft-id");
    }
  }, [storiId]);

  const autosaveCallback = useCallback(
    () => autosaveExistingStory(storiId, title, subTitle, excerpt, readTime, coverImage, blocks),
    [storiId, title, subTitle, excerpt, readTime, coverImage, blocks],
  );
  const { status: saveStatus, cancel: cancelAutosave } = useAutosave(autosaveCallback, [title, subTitle, excerpt, readTime, coverImage, blocks], {
    enabled: isDirty,
  });

  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdating, startUpdating] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();

  const busy = isUpdating;

  const handleUpdate = () => {
    cancelAutosave();
    startUpdating(async () => {
      try {
        // Upload any pending files before saving
        let finalCoverImage = coverImage;
        let coverPublicId: string | undefined;

        if (pendingCoverFile) {
          const result = await uploadToCloudinary(pendingCoverFile);
          finalCoverImage = result.url;
          coverPublicId = result.publicId;
        }

        const updatedBlocks = await Promise.all(
          blocks.map(async (block) => {
            const file = pendingBlockFiles[block.id];
            if (file) {
              const result = await uploadToCloudinary(file);
              return { ...block, image_url: result.url, image_public_id: result.publicId };
            }
            return block;
          }),
        );

        const result = await updateStory(
          storiId,
          title,
          subTitle,
          excerpt,
          readTime,
          finalCoverImage,
          coverPublicId,
          updatedBlocks,
        );

        if (result.ok) {
          // Reset initial refs so isDirty becomes false — action buttons reappear
          initialTitleRef.current    = title;
          initialSubTitleRef.current = subTitle;
          initialExcerptRef.current  = excerpt;
          initialReadTimeRef.current = readTime;
          initialCoverRef.current    = finalCoverImage ?? coverImage;
          initialBlocksRef.current   = updatedBlocks;
          // Commit the new URLs into context so subsequent saves/autosaves use them
          if (finalCoverImage !== coverImage) setCoverImage(finalCoverImage);
          setBlocks(updatedBlocks);
          clearPendingFiles();
          toast.success("Story updated.");
          localStorage.removeItem(DRAFT_KEY);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Image upload failed. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <MailModal storiId={storiId} isOpen={isMailOpen} onClose={() => setIsMailOpen(false)} />
      {role === "master" && (
        <DeleteStoriModal
          storiId={storiId}
          title={title}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => router.push("/admin/home")}
        />
      )}
      <SaveIndicator status={saveStatus} />
      <div className="fixed z-[100] flex flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1 bottom-4 left-1/2 -translate-x-1/2 max-w-[94vw] sm:flex-col sm:gap-2.5 sm:justify-start sm:overflow-visible sm:px-0 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:max-w-none sm:top-20 sm:right-[clamp(12px,3vw,24px)]">

        {/* 1. Mode toggle — always visible */}
        {mode === "read" ? (
          <button
            title="Edit story"
            className={`${FAB_BLUE} cursor-pointer`}
            onClick={() => setMode("write")}
          >
            <Pencil size={20} />
          </button>
        ) : (
          <button
            title="Preview story"
            className={`${FAB_VIOLET} cursor-pointer`}
            onClick={() => setMode("read")}
          >
            <Eye size={20} />
          </button>
        )}

        {/* 2–end: everything else only in preview/read mode */}
        {mode === "read" && (
          <>
            {/* Save — both roles, only when dirty */}
            {isDirty && (
              <button
                title="Save as draft"
                className={`${FAB_TEAL} ${busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => { if (!busy) handleUpdate(); }}
              >
                {busy ? <Loader2 size={20} className="animate-spin" /> : <BookCheck size={20} />}
              </button>
            )}

            {/* Writer: submit for review — only when clean */}
            {role === "writer" && !isDirty && stori.status === "Draft" && (
              <button
                title="Submit for review"
                className={`${FAB_AMBER} ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (isSubmitting) return;
                  startSubmitting(async () => {
                    const result = await submitStoryForReview(storiId);
                    if (!result.ok) toast.error(result.message);
                  });
                }}
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
              </button>
            )}

            {/* Master: publish / approve / reject / unpublish — dirty-gated inside */}
            {role === "master" && (
              <MasterStoryActions
                storiId={storiId}
                status={stori.status as "Draft" | "Pending" | "Published"}
                title={title}
                isDirty={isDirty}
              />
            )}

            {/* Mail — both roles, always in preview mode */}
            <button
              title="Email"
              className={`${FAB_RED} cursor-pointer`}
              onClick={() => setIsMailOpen(true)}
            >
              <Mail size={20} />
            </button>

            {/* Delete — master only, always in preview mode */}
            {role === "master" && (
              <button
                title="Delete story"
                className={`${FAB_RED_SOLID} cursor-pointer`}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 size={20} />
              </button>
            )}
          </>
        )}
      </div>

      <div
        className="mx-auto px-4 sm:px-6 pb-24 sm:pb-10"
        style={{ maxWidth: 1140, paddingTop: "clamp(16px, 4vw, 32px)" }}
      >
        <div className="bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-sm px-5 sm:px-10 py-8 flex flex-col gap-6">

          {stori.rejectionReason && stori.status === "Draft" && (
            <div className="flex items-start gap-3 bg-[#FEF3C7] dark:bg-[#422006] border border-[#FDE68A]/40 rounded-2xl px-4 py-3">
              <span className="text-base flex-shrink-0 text-[#92400E] dark:text-[#FDE68A]">✕</span>
              <div>
                <p className="text-sm font-semibold text-[#92400E] dark:text-[#FDE68A]">Returned for revision</p>
                <p className="text-sm text-[#92400E] dark:text-[#FDE68A] mt-0.5">{stori.rejectionReason}</p>
              </div>
            </div>
          )}

          {recoveryData && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FEF3C7] dark:bg-[#422006] border border-[#FDE68A]/40 rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-[#92400E] dark:text-[#FDE68A]">
                You have unsaved local changes from your last session.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    localStorage.removeItem(DRAFT_KEY);
                    setRecoveryData(null);
                  }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/60 dark:bg-black/20 text-[#92400E] dark:text-[#FDE68A] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setTitle(recoveryData.title);
                    setSubTitle(recoveryData.subTitle);
                    setExcerpt(recoveryData.excerpt);
                    setReadTime(recoveryData.readTime);
                    setCoverImage(recoveryData.coverImage);
                    setBlocks(recoveryData.blocks);
                    setRecoveryData(null);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#92400E] dark:bg-[#FDE68A] text-white dark:text-[#422006] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Restore →
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Go back
            </button>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                stori.status === "Draft"
                  ? "bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
                  : stori.status === "Pending"
                    ? "bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]"
                    : "bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]"
              }`}
            >
              {stori.status}
            </span>
          </div>

        <CoverImage
          mode={mode}
          url={coverImage}
          onFilePicked={setPendingCoverFile}
        />

        <div className="flex flex-col gap-5">
          <TitleField mode={mode} value={title} onChange={setTitle} />
          <SubTitleField mode={mode} value={subTitle} onChange={setSubTitle} />
          <ExcerptField mode={mode} value={excerpt} onChange={setExcerpt} />
          <ReadTimeField
            mode={mode}
            value={readTime}
            onChange={setReadTime}
          />
        </div>

        <StoryEditor
          blocks={blocks}
          mode={mode}
          onUpdate={updateBlock}
          onImageUpload={updateImageBlock}
          onDelete={deleteBlock}
          onInsert={insertBlock}
          onMove={moveBlock}
          onImageFilePicked={setPendingBlockFile}
        />
        </div>
      </div>
    </div>
  );
}
