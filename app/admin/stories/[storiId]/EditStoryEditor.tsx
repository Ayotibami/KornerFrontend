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
import FabButton from "@/components/admin/ui/FabButton";
import HelpTrigger from "@/components/admin/ui/HelpTrigger";
import {
  TitleField,
  SubTitleField,
  ExcerptField,
  ReadTimeField,
} from "@/components/admin/editor/MetaFields";
import { updateStory, submitStoryForReview, type StoriDetail } from "./action";
import { autosaveExistingStory } from "@/app/admin/stories/autosaveActions";
import { useAutosave } from "@/hooks/useAutosave";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import MailModal from "@/components/admin/stories/MailModal";
import MasterStoryActions from "@/components/admin/stories/MasterStoryActions";
import DeleteStoriModal from "@/components/admin/stories/DeleteStoriModal";
import SaveIndicator from "@/components/admin/editor/SaveIndicator";
import CharacterCount from "@/components/admin/editor/CharacterCount";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { EditorBlock } from "@/context/StoryEditorContext";
import type { BlockType } from "@/types/story";

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
        image_url: b.imageUrl ?? "",
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
        // Discard snapshots with an empty title — these are stale writes from
        // the first-render bug where the effect fired before context was seeded.
        if (!parsed.title && !parsed.subTitle && !parsed.excerpt && !(parsed.blocks?.length)) {
          localStorage.removeItem(`korner-edit-draft-${storiId}`);
        } else {
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

  // Skip the very first invocation of the localStorage write effect.
  // On the first render the context state is still empty (context defaults)
  // while initialRefs already hold the real story data — this makes
  // isCurrentlyDirty spuriously true, causing empty data to be written to
  // localStorage and the recovery banner to appear on every page open.
  const localStorageReadyRef = useRef(false);

  useEffect(() => {
    if (!localStorageReadyRef.current) {
      localStorageReadyRef.current = true;
      return;
    }
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

  // Mobile only — hide the fixed FAB row while scrolling down through a long
  // story so it doesn't sit over the content being read/written; desktop's
  // side column is unaffected (see the sm: overrides on the container below).
  const fabVisible = useHideOnScroll();

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
          onDeleted={() => router.push("/admin/stories")}
        />
      )}
      <SaveIndicator status={saveStatus} />
      <CharacterCount blocks={blocks} />
      <div
        className={`fixed z-[100] flex flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1 bottom-4 left-1/2 -translate-x-1/2 max-w-[94vw] transition duration-300 ease-out ${
          fabVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        } sm:flex-col sm:gap-2.5 sm:justify-start sm:overflow-visible sm:px-0 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto sm:max-w-none sm:top-20 sm:right-[clamp(12px,3vw,24px)]`}
      >

        {/* 1. Mode toggle — always visible */}
        {mode === "read" ? (
          <FabButton label="Edit" icon={<Pencil size={20} />} tone="blue" onClick={() => setMode("write")} />
        ) : (
          <FabButton label="Preview" icon={<Eye size={20} />} tone="violet" onClick={() => setMode("read")} />
        )}

        {/* 2–end: everything else only in preview/read mode */}
        {mode === "read" && (
          <>
            {/* Save — both roles, only when dirty */}
            {isDirty && (
              <FabButton
                label="Save Draft"
                icon={busy ? <Loader2 size={20} className="animate-spin" /> : <BookCheck size={20} />}
                tone="teal"
                disabled={busy}
                onClick={handleUpdate}
              />
            )}

            {/* Writer: submit for review — only when clean */}
            {role === "writer" && !isDirty && stori.status === "Draft" && (
              <FabButton
                label="Submit"
                icon={isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
                tone="amber"
                disabled={isSubmitting}
                onClick={() => {
                  startSubmitting(async () => {
                    const result = await submitStoryForReview(storiId);
                    if (!result.ok) toast.error(result.message);
                  });
                }}
              />
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
            <FabButton label="Mail" icon={<Mail size={20} />} tone="red" onClick={() => setIsMailOpen(true)} />

            {/* Delete — master only, always in preview mode */}
            {role === "master" && (
              <FabButton label="Delete" icon={<Trash2 size={20} />} tone="redSolid" onClick={() => setIsDeleteOpen(true)} />
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
              onClick={() => router.push(role === "master" ? "/admin/stories" : "/admin/home")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Go back
            </button>
            <div className="flex items-center gap-2">
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
              <HelpTrigger href="/admin/help#block-editor" />
            </div>
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
