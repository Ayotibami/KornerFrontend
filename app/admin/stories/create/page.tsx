"use client";

// Create story page — the main editor for new stories.
// Reads all state from StoryEditorContext (provided by the layout above it).
//
// Image upload is deferred: picking a file just shows a local blob preview.
// The actual Cloudinary upload happens on Save so no orphaned images are created
// while the admin drafts and refines their image choice.
//
// Autosave behaviour:
//   Three seconds after the user stops typing (and a title exists), the page
//   automatically creates a Draft in the backend and stores its ID in
//   localStorage ("korner-create-draft-id"). From that point on, every
//   subsequent autosave PATCHes that draft rather than creating more drafts.
//   The URL stays at /create — no mid-write redirect.

import { useCallback, useRef, useState, useTransition } from "react";
import { ArrowLeft, BookCheck, Eye, FeatherIcon, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStoryEditor } from "@/context/StoryEditorContext";
import { useAdmin } from "@/context/AdminContext";
import CoverImage from "@/components/admin/editor/CoverImage";
import StoryEditor from "@/components/admin/editor/StoryEditor";
import FabButton from "@/components/admin/ui/FabButton";
import HelpTrigger from "@/components/admin/ui/HelpTrigger";
import { TitleField, SubTitleField, ExcerptField, ReadTimeField } from "@/components/admin/editor/MetaFields";
import { autosaveExistingStory, autosaveNewStory } from "@/app/admin/stories/autosaveActions";
import { useAutosave } from "@/hooks/useAutosave";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import SaveIndicator from "@/components/admin/editor/SaveIndicator";
import CharacterCount from "@/components/admin/editor/CharacterCount";
import createStory from "./action";
import { updateStory } from "@/app/admin/stories/[storiId]/action";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { EditorBlock } from "@/context/StoryEditorContext";

const DRAFT_KEY = "korner-create-draft-id";

export default function CreatePage() {
  const router = useRouter();
  const { profile } = useAdmin();
  const {
    mode, setMode,
    title, setTitle,
    subTitle, setSubTitle,
    excerpt, setExcerpt,
    readTime, setReadTime,
    coverImage, setCoverImage,
    blocks, setBlocks,
    pendingCoverFile, setPendingCoverFile,
    pendingBlockFiles, setPendingBlockFile, clearPendingFiles,
    insertBlock,
    updateBlock,
    updateImageBlock,
    deleteBlock,
    moveBlock,
  } = useStoryEditor();

  // ── Recovery banner ────────────────────────────────────────────────────
  const [recoveryStoriId, setRecoveryStoriId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null
  );

  // ── Autosave ───────────────────────────────────────────────────────────
  const storiIdRef = useRef<string | null>(
    typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null,
  );

  const autosaveCallback = useCallback(async () => {
    if (storiIdRef.current) {
      return autosaveExistingStory(storiIdRef.current, title, subTitle, excerpt, readTime, coverImage, blocks);
    }
    const result = await autosaveNewStory(title, subTitle, excerpt, readTime, coverImage, blocks);
    if (result.ok) {
      storiIdRef.current = result.data.storiId;
      localStorage.setItem(DRAFT_KEY, result.data.storiId);
    }
    return result;
  }, [title, subTitle, excerpt, readTime, coverImage, blocks]);

  const hasPendingFiles = pendingCoverFile !== null || Object.keys(pendingBlockFiles).length > 0;

  const { status: saveStatus, cancel: cancelAutosave } = useAutosave(
    autosaveCallback,
    [title, subTitle, excerpt, readTime, coverImage, blocks],
    { enabled: title.trim().length > 0 },
  );

  // Mobile only — hide the fixed FAB row while scrolling down through a long
  // draft so it doesn't sit over the content being read/written; desktop's
  // side column is unaffected (see the sm: overrides on the container below).
  const fabVisible = useHideOnScroll();

  // ── Upload pending files before save ──────────────────────────────────
  // Uploads any pending image files (deferred from when user picked them),
  // returns an updated blocks array and cover image URL + publicId.
  const uploadPendingFiles = async (currentBlocks: EditorBlock[]) => {
    let finalCoverImage = coverImage;
    let coverPublicId: string | undefined;

    if (pendingCoverFile) {
      const result = await uploadToCloudinary(pendingCoverFile);
      finalCoverImage = result.url;
      coverPublicId = result.publicId;
    }

    const updatedBlocks = await Promise.all(
      currentBlocks.map(async (block) => {
        const file = pendingBlockFiles[block.id];
        if (file) {
          const result = await uploadToCloudinary(file);
          return { ...block, image_url: result.url, image_public_id: result.publicId };
        }
        return block;
      }),
    );

    return { finalCoverImage, coverPublicId, updatedBlocks };
  };

  // ── Manual save handlers ───────────────────────────────────────────────
  const [isDrafting, startDrafting] = useTransition();
  const busy = isDrafting;

  const handleDraft = () => {
    cancelAutosave();
    startDrafting(async () => {
      try {
        const { finalCoverImage, coverPublicId, updatedBlocks } = await uploadPendingFiles(blocks);

        if (storiIdRef.current) {
          localStorage.removeItem(DRAFT_KEY);
          // Use updateStory (not autosaveExistingStory) so cover_image_public_id is stored
          const result = await updateStory(
            storiIdRef.current, title, subTitle, excerpt, readTime, finalCoverImage, coverPublicId, updatedBlocks,
          );
          if (!result.ok) { toast.error(result.message); return; }
          if (finalCoverImage !== coverImage) setCoverImage(finalCoverImage);
          setBlocks(updatedBlocks);
          clearPendingFiles();
          router.push("/admin/home");
        } else {
          const result = await createStory(
            title, subTitle, excerpt, readTime, finalCoverImage, coverPublicId, updatedBlocks,
          );
          if (!result.ok) { toast.error(result.message); return; }
          clearPendingFiles();
        }
      } catch {
        toast.error("Image upload failed. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <SaveIndicator status={saveStatus} />
      <CharacterCount blocks={blocks} />
      <div
        className={`fixed z-[100] flex flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1 bottom-4 left-1/2 -translate-x-1/2 max-w-[94vw] transition duration-300 ease-out ${
          fabVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        } sm:flex-col sm:gap-2.5 sm:justify-start sm:overflow-visible sm:px-0 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto sm:max-w-none sm:top-20 sm:right-[clamp(12px,3vw,24px)]`}
      >
        <FabButton
          label={mode === "write" ? "Preview" : "Edit"}
          icon={mode === "write" ? <Eye size={20} /> : <Pencil size={20} />}
          tone={mode === "write" ? "violet" : "blue"}
          onClick={() => setMode(mode === "write" ? "read" : "write")}
        />

        {mode === "read" && (
          <FabButton
            label="Save Draft"
            icon={busy ? <Loader2 size={20} className="animate-spin" /> : <BookCheck size={20} />}
            tone="teal"
            disabled={busy}
            onClick={handleDraft}
          />
        )}
      </div>

      <div
        className="mx-auto px-4 sm:px-6 pb-24 sm:pb-10"
        style={{ maxWidth: 1000, paddingTop: "clamp(16px, 4vw, 32px)" }}
      >
        <div className="bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-sm px-5 sm:px-10 py-8 flex flex-col gap-6">

          {/* Recovery banner */}
          {recoveryStoriId && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FEF3C7] dark:bg-[#422006] border border-[#FDE68A]/40 rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-[#92400E] dark:text-[#FDE68A]">
                You have a draft in progress from your last session.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    localStorage.removeItem(DRAFT_KEY);
                    setRecoveryStoriId(null);
                  }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/60 dark:bg-black/20 text-[#92400E] dark:text-[#FDE68A] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Dismiss
                </button>
                <Link
                  href={`/admin/stories/${recoveryStoriId}`}
                  onClick={() => localStorage.removeItem(DRAFT_KEY)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#92400E] dark:bg-[#FDE68A] text-white dark:text-[#422006] hover:opacity-90 transition-opacity no-underline"
                >
                  Continue editing →
                </Link>
              </div>
            </div>
          )}

          {/* Header row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/admin/home")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Go back
            </button>
            <HelpTrigger href="/admin/help#creating-story" />
          </div>

          {/* Page heading */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
              <FeatherIcon size={18} className="text-primary dark:text-[#93b8f0]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0f1e3d] dark:text-gray-50 leading-tight">
                Create Story
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Write freely — save as a draft or submit for review when ready
              </p>
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
            <ReadTimeField mode={mode} value={readTime} onChange={setReadTime} />
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
