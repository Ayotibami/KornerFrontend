"use client";

// Create story page — the main editor for new stories.
// Reads all state from StoryEditorContext (provided by the layout above it).
//
// Autosave behaviour:
//   Three seconds after the user stops typing (and a title exists), the page
//   automatically creates a Draft in the backend and stores its ID in
//   localStorage ("korner-create-draft-id"). From that point on, every
//   subsequent autosave PATCHes that draft rather than creating more drafts.
//   The URL stays at /create — no mid-write redirect.
//
//   If the user closes the browser before manually saving, reopening /create
//   shows a recovery banner: "You have a draft in progress — Continue editing."
//   Clicking it navigates to the existing draft's edit page on any device.

import { useCallback, useRef, useState, useTransition } from "react";
import { ArrowLeft, BookCheck, Eye, FeatherIcon, Loader2, Pencil, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useStoryEditor } from "@/context/StoryEditorContext";
import { useAdmin } from "@/context/AdminContext";
import CoverImage from "@/components/admin/editor/CoverImage";
import StoryEditor from "@/components/admin/editor/StoryEditor";
import { TitleField, SubTitleField, ExcerptField, ReadTimeField } from "@/components/admin/editor/MetaFields";
import { autosaveExistingStory, autosaveNewStory } from "@/app/admin/stories/autosaveActions";
import { useAutosave } from "@/hooks/useAutosave";
import SaveIndicator from "@/components/admin/editor/SaveIndicator";
import createStory from "./action";
import submitForReview from "./submitForReview";
import { submitStoryForReview } from "@/app/admin/stories/[storiId]/action";

const DRAFT_KEY = "korner-create-draft-id";

const FAB_BASE   = "w-10 h-10 sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90 flex-shrink-0";
const FAB_AMBER  = `${FAB_BASE} bg-[#FEF3C7] dark:bg-[#422006]  text-[#92400E] dark:text-[#FDE68A]`;
const FAB_TEAL   = `${FAB_BASE} bg-[#CCFBF1] dark:bg-[#022C22]  text-[#065F46] dark:text-[#6EE7B7]`;
const FAB_VIOLET = `${FAB_BASE} bg-[#EDE9FE] dark:bg-[#2E1065]  text-[#5B21B6] dark:text-[#C4B5FD]`;
const FAB_BLUE   = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f]  text-primary   dark:text-[#93b8f0]`;

export default function CreatePage() {
  const { profile } = useAdmin();
  const isWriter = profile?.role === "writer";

  const {
    mode, setMode,
    title, setTitle,
    subTitle, setSubTitle,
    excerpt, setExcerpt,
    readTime, setReadTime,
    coverImage, setCoverImage,
    blocks,
    uploadingCount,
    incrementUploading,
    decrementUploading,
    insertBlock,
    updateBlock,
    updateImageBlock,
    deleteBlock,
    moveBlock,
  } = useStoryEditor();

  // ── Recovery banner ────────────────────────────────────────────────────
  // Lazy initializer reads localStorage once at mount; avoids the
  // react-hooks/set-state-in-effect lint error from calling setState inside useEffect.
  const [recoveryStoriId, setRecoveryStoriId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null
  );

  // ── Autosave ───────────────────────────────────────────────────────────
  // storiIdRef tracks the backend ID of the draft created by the first
  // autosave. Subsequent autosaves PATCH that same draft instead of creating
  // a new one. A ref (not state) so updating it doesn't cause a re-render.
  const storiIdRef = useRef<string | null>(null);

  const autosaveCallback = useCallback(async () => {
    if (storiIdRef.current) {
      // Draft already exists — just update it
      return autosaveExistingStory(storiIdRef.current, title, subTitle, excerpt, readTime, coverImage, blocks);
    }
    // First autosave — create the Draft in the backend
    const result = await autosaveNewStory(title, subTitle, excerpt, readTime, coverImage, blocks);
    if (result.ok) {
      storiIdRef.current = result.data.storiId;
      localStorage.setItem(DRAFT_KEY, result.data.storiId);
    }
    return result;
  }, [title, subTitle, excerpt, readTime, coverImage, blocks]);

  const saveStatus = useAutosave(
    autosaveCallback,
    [title, subTitle, excerpt, readTime, coverImage, blocks],
    { enabled: title.trim().length > 0 },
  );

  // ── Manual save handlers ───────────────────────────────────────────────
  const [isDrafting, startDrafting] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const busy = isDrafting || uploadingCount > 0;

  const handleDraft = () => {
    startDrafting(async () => {
      if (storiIdRef.current) {
        // Autosave already created the draft — do a final explicit save then go home
        localStorage.removeItem(DRAFT_KEY);
        const result = await autosaveExistingStory(storiIdRef.current, title, subTitle, excerpt, readTime, coverImage, blocks);
        if (!result.ok) { toast.error(result.message); return; }
        window.location.href = "/admin/home";
      } else {
        // Nothing autosaved yet — use the original create action
        const result = await createStory(title, subTitle, excerpt, readTime, coverImage, blocks);
        if (!result.ok) toast.error(result.message);
        // On success createStory redirects, so nothing more to do
      }
    });
  };

  const handleSubmit = () => {
    if (isSubmitting || uploadingCount > 0) return;
    startSubmitting(async () => {
      if (storiIdRef.current) {
        // Draft already exists — save current state then submit it
        localStorage.removeItem(DRAFT_KEY);
        const saveResult = await autosaveExistingStory(storiIdRef.current, title, subTitle, excerpt, readTime, coverImage, blocks);
        if (!saveResult.ok) { toast.error("Failed to save before submitting"); return; }
        await submitStoryForReview(storiIdRef.current); // redirects on success
      } else {
        // Nothing autosaved — use the original combined create+submit action
        const result = await submitForReview(title, subTitle, excerpt, readTime, coverImage, blocks);
        if (!result.ok) toast.error(result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <div className="fixed z-[100] flex flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1 bottom-4 left-1/2 -translate-x-1/2 max-w-[94vw] sm:flex-col sm:gap-2.5 sm:justify-start sm:overflow-visible sm:px-0 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:max-w-none sm:top-20 sm:right-[clamp(12px,3vw,24px)]">
        {mode === "read" && (
          <>
            {isWriter && (
              <button
                title="Submit for review"
                className={`${FAB_AMBER} ${isSubmitting || uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleSubmit}
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
              </button>
            )}

            <button
              title="Save as draft"
              className={`${FAB_TEAL} ${busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => { if (!busy) handleDraft(); }}
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <BookCheck size={20} />}
            </button>
          </>
        )}

        <button
          title={mode === "write" ? "Preview story" : "Edit story"}
          className={`${mode === "write" ? FAB_VIOLET : FAB_BLUE} ${uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => { if (uploadingCount === 0) setMode(mode === "write" ? "read" : "write"); }}
        >
          {mode === "write" ? <Eye size={20} /> : <Pencil size={20} />}
        </button>
      </div>

      <div
        className="mx-auto px-4 sm:px-6 pb-24 sm:pb-10"
        style={{ maxWidth: 1000, paddingTop: "clamp(16px, 4vw, 32px)" }}
      >
        <div className="bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-sm px-5 sm:px-10 py-8 flex flex-col gap-6">

          {/* Recovery banner */}
          {recoveryStoriId && (
            <div className="flex items-center justify-between gap-3 bg-[#FEF3C7] dark:bg-[#422006] border border-[#FDE68A]/40 rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-[#92400E] dark:text-[#FDE68A]">
                You have a draft in progress from your last session.
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
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
              onClick={() => { window.location.href = "/admin/home"; }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Go back
            </button>
            <SaveIndicator status={saveStatus} />
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
            onChange={setCoverImage}
            onUploadStart={incrementUploading}
            onUploadEnd={decrementUploading}
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
            onUploadStart={incrementUploading}
            onUploadEnd={decrementUploading}
          />
        </div>
      </div>
    </div>
  );
}
