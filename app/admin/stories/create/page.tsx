"use client";

// Create story page — the main editor for new stories.
// Reads all state from StoryEditorContext (provided by the layout above it).
// Calls the createStory server action via useTransition so the UI stays
// responsive during the network request.
//
// Floating action buttons (FAB):
//   Top    — Save as Draft (BookCheck icon): calls createStory and redirects on success
//   Bottom — Toggle write/read mode (Pencil ↔ Save icon): previews the story
//
// `busy` combines isDrafting and uploadingCount:
//   - isDrafting: the save action is in progress
//   - uploadingCount > 0: one or more images are still uploading to Cloudinary
//   Both disable the save button to prevent saving with incomplete data.
//
// FAB position: `top: calc(14vh + 16px)` places it just below the fixed Navbar.

import { useTransition } from "react";
import { BookCheck, Eye, Loader2, Pencil, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { useStoryEditor } from "@/context/StoryEditorContext";
import CoverImage from "@/components/admin/editor/CoverImage";
import StoryEditor from "@/components/admin/editor/StoryEditor";
import { TitleField, SubTitleField, ExcerptField, ReadTimeField } from "@/components/admin/editor/MetaFields";
import createStory from "./action";
import submitForReview from "./submitForReview";

const FAB_BASE = "w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90";
const FAB_AMBER  = `${FAB_BASE} bg-[#FEF3C7] dark:bg-[#422006]  text-[#92400E] dark:text-[#FDE68A]`; // submit for review
const FAB_TEAL   = `${FAB_BASE} bg-[#CCFBF1] dark:bg-[#022C22]  text-[#065F46] dark:text-[#6EE7B7]`; // save as draft
const FAB_VIOLET = `${FAB_BASE} bg-[#EDE9FE] dark:bg-[#2E1065]  text-[#5B21B6] dark:text-[#C4B5FD]`; // preview
const FAB_BLUE   = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f]  text-primary   dark:text-[#93b8f0]`; // edit

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
  } = useStoryEditor();

  const [isDrafting, startDrafting] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const busy = isDrafting || uploadingCount > 0;

  const handleDraft = () => {
    startDrafting(async () => {
      const result = await createStory(title, subTitle, excerpt, readTime, coverImage, blocks);
      if (!result.ok) toast.error(result.message);
      // On success, the server action redirects — no need to handle result.ok here.
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117] font-nunito">
      {/* Fixed floating action buttons — stay visible while scrolling */}
      <div
        className="fixed z-[100] flex flex-col gap-2.5"
        style={{ top: "calc(14vh + 16px)", right: "clamp(12px, 3vw, 24px)" }}
      >
        {mode === "read" && (
          <>
            {/* Submit for review */}
            <button
              title="Submit for review"
              className={`${FAB_AMBER} ${isSubmitting || uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                if (isSubmitting || uploadingCount > 0) return;
                startSubmitting(async () => {
                  const result = await submitForReview(title, subTitle, excerpt, readTime, coverImage, blocks);
                  if (!result.ok) toast.error(result.message);
                });
              }}
            >
              {isSubmitting
                ? <Loader2 size={20} className="animate-spin" />
                : <SendHorizonal size={20} />
              }
            </button>

            {/* Save as draft */}
            <button
              title="Save as draft"
              className={`${FAB_TEAL} ${busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => { if (!busy) handleDraft(); }}
            >
              {busy
                ? <Loader2 size={20} className="animate-spin" />
                : <BookCheck size={20} />
              }
            </button>
          </>
        )}

        {/* Toggle write ↔ read mode — violet in write (preview), blue in read (edit) */}
        <button
          title={mode === "write" ? "Preview story" : "Edit story"}
          className={`${mode === "write" ? FAB_VIOLET : FAB_BLUE} ${uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => { if (uploadingCount === 0) setMode(mode === "write" ? "read" : "write"); }}
        >
          {mode === "write" ? <Eye size={20} /> : <Pencil size={20} />}
        </button>
      </div>

      {/* Page content — max 800px centred, fluid padding */}
      <div
        className="mx-auto flex flex-col gap-6"
        style={{ maxWidth: 800, padding: "clamp(16px, 4vw, 40px)" }}
      >
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
          onUploadStart={incrementUploading}
          onUploadEnd={decrementUploading}
        />
      </div>
    </div>
  );
}
