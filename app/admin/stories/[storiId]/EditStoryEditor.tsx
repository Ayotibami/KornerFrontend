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
//   - Has a "Go back" link to the home page
//   - Shows a status badge (Draft / Published) next to the read time
//   - Save button only appears when the admin has actually changed something (isDirty)
//   - Save shows a success toast instead of redirecting (admin stays to keep editing)
//   - maxWidth is 1100px (wider than create's 800px) for more reading comfort
//
// isDirty — how it works:
//   When the page loads, we snapshot the story's initial values (from the server props).
//   On every render, we compare the current context state against that snapshot.
//   If anything differs → isDirty = true → show the save button.
//   If nothing changed → isDirty = false → hide the save button.
//   This prevents the admin from accidentally saving a story with no actual changes.
//
//   For simple string fields (title, subtitle, etc.) we just compare with !==.
//   For blocks (an array of objects) we can't use !== because two arrays are never
//   equal in JavaScript even if they contain the same data. Instead we:
//     1. Strip the client-only `id` field from each block (it's a UUID used as React key,
//        not real content — a user adding then deleting a block would change UUIDs even
//        though the content is identical, giving a false dirty signal)
//     2. JSON.stringify both arrays and compare the resulting strings
//   This means isDirty only becomes true when the actual block content/type/position
//   changes, not just because UUIDs were regenerated.

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, BookCheck, Eye, Loader2, Mail, Pencil, SendHorizonal } from "lucide-react";
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
import { updateStory, submitStoryForReview, type StoriDetail } from "./action";
import MailModal from "@/components/admin/stories/MailModal";
import type { EditorBlock } from "@/context/StoryEditorContext";
import type { BlockType } from "@/types/story";

const FAB_BASE   = "w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-95 active:scale-90";
const FAB_AMBER  = `${FAB_BASE} bg-[#FEF3C7] dark:bg-[#422006]  text-[#92400E] dark:text-[#FDE68A]`; // submit for review
const FAB_TEAL   = `${FAB_BASE} bg-[#CCFBF1] dark:bg-[#022C22]  text-[#065F46] dark:text-[#6EE7B7]`; // save as draft
const FAB_VIOLET = `${FAB_BASE} bg-[#EDE9FE] dark:bg-[#2E1065]  text-[#5B21B6] dark:text-[#C4B5FD]`; // preview
const FAB_BLUE   = `${FAB_BASE} bg-secondary dark:bg-[#1e3a5f]  text-primary   dark:text-[#93b8f0]`; // edit
const FAB_RED    = `${FAB_BASE} bg-[#FEE2E2] dark:bg-[#450a0a]  text-[#DC2626] dark:text-[#FCA5A5]`; // mail

// Strips the `id` field from a block before comparison.
// `id` is a client-only UUID used as a React key — it is NOT content.
// We exclude it so that adding then deleting a block doesn't falsely mark the story dirty.
function blockWithoutId({ id: _id, ...rest }: EditorBlock) {
  return rest;
}

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

  // ─── Initial snapshot ref ─────────────────────────────────────────────────
  // A ref is a value that persists across re-renders without causing a re-render
  // itself (unlike useState). We use it to hold the story's starting state so we
  // can compare against it later.
  //
  // Why a ref instead of a state variable?
  //   We never want reading this snapshot to trigger a re-render. It's a fixed
  //   reference point — it should only ever be written once (on mount) and read
  //   during the isDirty comparison on every render.
  const initialTitleRef     = useRef(stori.title ?? "");
  const initialSubTitleRef  = useRef(stori.subtitle ?? "");
  const initialExcerptRef   = useRef(stori.excerpt ?? "");
  const initialReadTimeRef  = useRef(stori.readingTime ?? "");
  const initialCoverRef     = useRef<string | null>(stori.coverImage ?? null);
  // Blocks are more complex — we store them as the TRANSFORMED EditorBlock shape
  // (same shape the context uses), not the raw API shape. This makes the later
  // JSON.stringify comparison work correctly without any extra mapping.
  const initialBlocksRef    = useRef<EditorBlock[]>([]);

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

    // Transform blocks from the API shape (camelCase) to the editor shape (snake_case).
    // We compute this once and use it for BOTH seeding the context AND storing the
    // initial snapshot — so both are always in the exact same format.
    const transformedBlocks: EditorBlock[] = (stori.blocks ?? [])
      .sort((a, b) => a.position - b.position)
      .map((b) => ({
        id: b.blockId,                    // blockId from API becomes the React key
        block_type: b.blockType as BlockType,
        content: b.content ?? "",
        image_url: b.image_url ?? "",
        position: b.position,
      }));

    // Seed the context so the editor renders the story content
    setBlocks(transformedBlocks);

    // Save the snapshot — this is what isDirty compares against.
    // We update the refs directly (not setState) because updating them
    // should not trigger a re-render.
    initialTitleRef.current    = stori.title ?? "";
    initialSubTitleRef.current = stori.subtitle ?? "";
    initialExcerptRef.current  = stori.excerpt ?? "";
    initialReadTimeRef.current = stori.readingTime ?? "";
    initialCoverRef.current    = stori.coverImage ?? null;
    initialBlocksRef.current   = transformedBlocks;

    return () => {
      // Reset to neutral state so the next story's first render is always clean
      setMode("read");
      setTitle("");
      setSubTitle("");
      setExcerpt("");
      setReadTime("");
      setCoverImage(null);
      setBlocks([]);
      // Also reset the snapshot so isDirty starts clean for the next story
      initialBlocksRef.current = [];
    };
  }, []); // intentionally empty — seed once on mount only

  // ─── Dirty state detection ────────────────────────────────────────────────
  // Check each simple field with a direct string comparison.
  // These are cheap operations — no concern running them on every render.
  const simpleFieldsChanged =
    title     !== initialTitleRef.current    ||
    subTitle  !== initialSubTitleRef.current ||
    excerpt   !== initialExcerptRef.current  ||
    readTime  !== initialReadTimeRef.current ||
    coverImage !== initialCoverRef.current;

  // Check blocks with a JSON string comparison (since arrays can't be compared with ===).
  // We strip the `id` field before comparing — see blockWithoutId() above for why.
  const blocksChanged =
    JSON.stringify(blocks.map(blockWithoutId)) !==
    JSON.stringify(initialBlocksRef.current.map(blockWithoutId));

  // isDirty is true if ANY field has changed from the original server data.
  // The save button renders only when isDirty is true.
  const isDirty = simpleFieldsChanged || blocksChanged;

  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isUpdating, startUpdating] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();

  // busy covers both "save in progress" and "image still uploading".
  // We don't want the admin to save while an image is mid-upload because
  // the block would still contain a blob:// URL (local to the browser)
  // instead of the final Cloudinary URL — the saved story would have a broken image.
  const busy = isUpdating || uploadingCount > 0;

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
      <MailModal storiId={storiId} isOpen={isMailOpen} onClose={() => setIsMailOpen(false)} />
      {/* Floating action buttons — layout changes depending on current mode */}
      <div
        className="fixed z-[100] flex flex-col gap-2.5"
        style={{ top: "calc(14vh + 16px)", right: "clamp(12px, 3vw, 24px)" }}
      >
        {mode === "read" ? (
          // Read mode: submit for review (draft only) + save as draft (only if dirty) + edit button
          <>
            {stori.status === "Draft" && (
              <button
                title="Submit for review"
                className={`${FAB_AMBER} ${isSubmitting || uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (isSubmitting || uploadingCount > 0) return;
                  startSubmitting(async () => {
                    const result = await submitStoryForReview(storiId);
                    if (!result.ok) toast.error(result.message);
                  });
                }}
              >
                {isSubmitting
                  ? <Loader2 size={20} className="animate-spin" />
                  : <SendHorizonal size={20} />
                }
              </button>
            )}

            {/* Save button only renders when the admin has actually changed something.
                isDirty compares the current editor state against the initial server data.
                If nothing changed, there is nothing to save — hiding the button prevents
                accidental no-op saves and makes the UX clearer. */}
            {isDirty && (
              <button
                title="Save as draft"
                className={`${FAB_TEAL} ${busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => { if (!busy) handleUpdate(); }}
              >
                {busy ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <BookCheck size={20} />
                )}
              </button>
            )}

            <button
              title="Edit story"
              className={`${FAB_BLUE} cursor-pointer`}
              onClick={() => setMode("write")}
            >
              <Pencil size={20} />
            </button>
          </>
        ) : (
          // Write mode: only preview button
          <button
            title="Preview story"
            className={`${FAB_VIOLET} ${uploadingCount > 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => { if (uploadingCount === 0) setMode("read"); }}
          >
            <Eye size={20} />
          </button>
        )}

        {/* Mail — always visible, red family, same shape/size as other FABs */}
        <button title="Email" className={`${FAB_RED} cursor-pointer`} onClick={() => setIsMailOpen(true)}>
          <Mail size={20} />
        </button>
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
