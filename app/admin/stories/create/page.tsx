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

const FAB_BASE = "w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90";
const FAB_AMBER  = `${FAB_BASE} bg-[#FEF3C7] dark:bg-[#422006]  text-[#92400E] dark:text-[#FDE68A]`;
const FAB_TEAL   = `${FAB_BASE} bg-[#CCFBF1] dark:bg-[#022C22]  text-[#065F46] dark:text-[#6EE7B7]`;
const FAB_VIOLET = `${FAB_BASE} bg-[#EDE9FE] dark:bg-[#2E1065]  text-[#5B21B6] dark:text-[#C4B5FD]`;
const FAB_BLUE   = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f]  text-primary   dark:text-[#93b8f0]`;

export default function CreatePage() {
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
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117] font-nunito">
      {/* Fixed floating action buttons */}
      <div
        className="fixed z-[100] flex flex-col gap-2.5"
        style={{ top: "calc(14vh + 16px)", right: "clamp(12px, 3vw, 24px)" }}
      >
        {mode === "read" && (
          <>
            <button
              title="Submit for review"
              className={`${FAB_AMBER} ${isSubmitting || uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={handleSubmit}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
            </button>

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
        className="mx-auto flex flex-col gap-6"
        style={{ maxWidth: 800, padding: "clamp(16px, 4vw, 40px)" }}
      >
        {/* Recovery banner */}
        {recoveryStoriId && (
          <div className="flex items-center justify-between gap-3 bg-[#FEF3C7] dark:bg-[#422006] border border-[#FDE68A]/40 rounded-2xl px-4 py-3">
            <p className="text-sm font-semibold font-nunito text-[#92400E] dark:text-[#FDE68A]">
              You have a draft in progress from your last session.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  localStorage.removeItem(DRAFT_KEY);
                  setRecoveryStoriId(null);
                }}
                className="text-xs font-bold font-nunito px-3 py-1.5 rounded-full bg-white/60 dark:bg-black/20 text-[#92400E] dark:text-[#FDE68A] hover:opacity-80 transition-opacity cursor-pointer"
              >
                Dismiss
              </button>
              <Link
                href={`/admin/stories/${recoveryStoriId}`}
                onClick={() => localStorage.removeItem(DRAFT_KEY)}
                className="text-xs font-bold font-nunito px-3 py-1.5 rounded-full bg-[#92400E] dark:bg-[#FDE68A] text-white dark:text-[#422006] hover:opacity-90 transition-opacity no-underline"
              >
                Continue editing →
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { window.location.href = "/admin/home"; }}
            className="flex items-center gap-1.5 text-[#0f1e3d] dark:text-gray-300 font-nunito font-bold text-sm cursor-pointer bg-transparent border-0 p-0"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
          <SaveIndicator status={saveStatus} />
        </div>

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
            <FeatherIcon size={20} className="text-primary dark:text-[#93b8f0]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f1e3d] dark:text-gray-50 leading-tight">
              Create Story
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Write freely — save as a draft to keep working later, or submit it for review right away if it&apos;s ready to go
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
  );
}
