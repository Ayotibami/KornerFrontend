"use client";

// Edit story editor — client component that receives server-fetched story data as props
// and seeds the StoryEditorContext so all editor sub-components can read/write it.
//
// Why useEffect for seeding instead of just using the props directly?
//   The editor state lives in StoryEditorContext (title, blocks, etc.) because multiple
//   deeply nested components (MetaFields, EditorBlock, CoverImage) all need to read and
//   write it. Props can't be shared that deeply without prop-drilling every component.
//   useEffect on mount seeds the context once with the server data.
//
// Why empty dependency array [] with eslint-disable?
//   We only want to seed the context ONCE when the component mounts (with the initial
//   server data). If we included the setter functions in deps, the effect would re-run
//   on every render. The setters are stable references so excluding them is safe.
//
// Edit mode vs. Create mode differences:
//   - Starts in "read" mode (preview) instead of "write" mode
//   - Has an "Go back" link to the home page
//   - Shows a status badge (Draft / Published) next to the read time
//   - Save shows a success toast instead of redirecting (admin stays to keep editing)
//   - maxWidth is 1100px (wider than create's 800px) for more reading comfort

import { useEffect, useTransition } from "react";
import { ArrowLeft, BookCheck, Eye, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
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
import { updateStory, type StoriDetail } from "./action";
import type { BlockType } from "@/types/story";

const FAB =
  "w-[52px] h-[52px] flex items-center justify-center rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90";

export default function EditStoryEditor({
  stori,
  storiId,
}: {
  stori: StoriDetail;
  storiId: string;
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
    uploadingCount,
    incrementUploading,
    decrementUploading,
    insertBlock,
    updateBlock,
    updateImageBlock,
    deleteBlock,
  } = useStoryEditor();

  // Seed the context with server-fetched story data on first render.
  // Cleanup resets the context when navigating away so the next story never
  // sees this story's stale blocks during its initial render.
  // (The layout's StoryEditorProvider persists across [storiId] navigations —
  // without the cleanup, navigating A→B briefly shows A's blocks on B.)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMode("read"); // edit page opens in preview mode by default
    setTitle(stori.title ?? "");
    setSubTitle(stori.subtitle ?? "");
    setExcerpt(stori.excerpt ?? "");
    setReadTime(stori.readingTime ?? "");
    setCoverImage(stori.coverImage ?? null);
    setBlocks(
      (stori.blocks ?? [])
        .sort((a, b) => a.position - b.position)
        .map((b) => ({
          id: b.blockId, // blockId from API becomes the React key
          block_type: b.blockType as BlockType,
          content: b.content ?? "",
          image_url: b.image_url ?? "",
          position: b.position,
        })),
    );

    return () => {
      // Reset to neutral state so the next story's first render is always clean
      setMode("read");
      setTitle("");
      setSubTitle("");
      setExcerpt("");
      setReadTime("");
      setCoverImage(null);
      setBlocks([]);
    };
  }, []); // intentionally empty — seed once on mount only

  const [isUpdating, startUpdating] = useTransition();
  const busy = isUpdating || uploadingCount > 0;
  console.log(blocks, "omo debug sha ");

  const handleUpdate = () => {
    startUpdating(async () => {
      const result = await updateStory(
        storiId,
        title,
        subTitle,
        excerpt,
        readTime,
        coverImage,
        blocks,
      );
      if (result.ok) toast.success("Story updated.");
      else toast.error(result.message);
      // Unlike create, we stay on the page after saving so the admin can keep editing.
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117] font-nunito">
      {/* Floating action buttons — layout changes depending on current mode */}
      <div
        className="fixed z-[100] flex flex-col gap-2.5"
        style={{ top: "calc(14vh + 16px)", right: "clamp(12px, 3vw, 24px)" }}
      >
        {mode === "read" ? (
          // Read mode: single button to enter edit mode
          <button
            title="Edit story"
            className={`${FAB} cursor-pointer`}
            onClick={() => setMode("write")}
          >
            <Pencil size={20} />
          </button>
        ) : (
          // Write mode: save button + button to return to read/preview mode
          <>
            <button
              title="Save as draft"
              className={`${FAB} ${busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                if (!busy) handleUpdate();
              }}
            >
              {busy ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <BookCheck size={20} />
              )}
            </button>
            <button
              title="Preview story"
              className={`${FAB} ${uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                if (uploadingCount === 0) setMode("read");
              }}
            >
              <Eye size={20} />
            </button>
          </>
        )}
      </div>

      {/* Page content — wider than create page (1100px) for reading comfort */}
      <div
        className="mx-auto flex flex-col gap-6"
        style={{ maxWidth: 1100, padding: "clamp(16px, 4vw, 40px)" }}
      >
        <Link
          href="/admin/home"
          className="flex items-center gap-1.5 text-[#0f1e3d] dark:text-gray-300 no-underline font-nunito font-bold text-sm"
        >
          <ArrowLeft size={18} />
          Go back
        </Link>

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
          <div className="flex items-center gap-3">
            <ReadTimeField
              mode={mode}
              value={readTime}
              onChange={setReadTime}
            />
            {/* Status badge — shows the current publish state from when the page loaded.
                It doesn't update if the story is published while the page is open,
                but that's acceptable since publishing is done via the backend/dashboard. */}
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold font-nunito flex-shrink-0 ${
                stori.status === "Draft"
                  ? "bg-secondary text-[#0E3E87]"
                  : "bg-primary text-white"
              }`}
            >
              {stori.status}
            </span>
          </div>
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
