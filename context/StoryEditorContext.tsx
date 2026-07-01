"use client";

// StoryEditorContext — shared state for the story editor.
//
// This context is intentionally state-only. No API calls live here.
// The create page and edit page each make their own API calls using
// useTransition and server actions. Keeping API logic out of context
// makes the context simpler, testable, and easier to reason about.
//
// Provider is mounted in the layout files for /admin/stories/create
// and /admin/stories/[storiId], so both pages share the same state shape.

import React, { useState, useContext } from "react";
import type { BlockType } from "@/types/story";

// EditorBlock extends the API's Block type with a client-side `id` field.
// `id` is a UUID generated with crypto.randomUUID() and used as the React key.
// It is NOT sent to the API — the API uses `position` for ordering.
export type EditorBlock = {
  id: string;
  block_type: BlockType;
  content: string;    // HTML string for text blocks; empty for image blocks
  image_url: string;  // Cloudinary URL for image blocks; empty otherwise
  position: number;   // 1-based display order
};

type StoryEditorContextType = {
  mode: "write" | "read";
  setMode: React.Dispatch<React.SetStateAction<"write" | "read">>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  subTitle: string;
  setSubTitle: React.Dispatch<React.SetStateAction<string>>;
  excerpt: string;
  setExcerpt: React.Dispatch<React.SetStateAction<string>>;
  readTime: string;
  setReadTime: React.Dispatch<React.SetStateAction<string>>;
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  blocks: EditorBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EditorBlock[]>>;
  // uploadingCount tracks how many image uploads are in progress.
  // The save/update buttons stay disabled while uploadingCount > 0
  // to prevent saving with temporary blob URLs instead of permanent Cloudinary URLs.
  uploadingCount: number;
  incrementUploading: () => void;
  decrementUploading: () => void;
  insertBlock: (type: BlockType, atPosition: number) => void;
  updateBlock: (pos: number, value: string) => void;
  updateImageBlock: (pos: number, url: string) => void;
  deleteBlock: (pos: number) => void;
  // Reorders blocks after a drag-and-drop. activeId/overId are the client-
  // side UUIDs (block.id) that dnd-kit uses to identify which block moved
  // and where it landed. Positions are renumbered sequentially after the move.
  moveBlock: (activeId: string, overId: string) => void;
};

// Default value is an empty object — this is safe because StoryEditorProvider
// is always mounted as a parent before any component calls useStoryEditor().
const StoryEditorContext = React.createContext<StoryEditorContextType>(
  {} as StoryEditorContextType,
);

export default function StoryEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"write" | "read">("write");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readTime, setReadTime] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Math.max(0, ...) prevents uploadingCount from going below zero
  // in case a component calls decrementUploading more times than increment.
  const incrementUploading = () => setUploadingCount((c) => c + 1);
  const decrementUploading = () => setUploadingCount((c) => Math.max(0, c - 1));

  // Inserts a new block at `atPosition`, shifting all existing blocks
  // at or after that position up by 1 to make room.
  //
  // Uses the functional setBlocks((prev) => ...) updater pattern rather than
  // reading `blocks` directly from the closure. This is critical: if multiple
  // state updates happen in the same render cycle, the closure snapshot of
  // `blocks` could be stale, causing lost updates. The functional updater
  // always receives the latest state from React.
  const insertBlock = (type: BlockType, atPosition: number) => {
    setBlocks((prev) => {
      const shifted = prev.map((block) =>
        block.position >= atPosition
          ? { ...block, position: block.position + 1 }
          : block,
      );
      const newBlock: EditorBlock = {
        id: crypto.randomUUID(),
        block_type: type,
        content: "",
        image_url: "",
        position: atPosition,
      };
      return [...shifted, newBlock].sort((a, b) => a.position - b.position);
    });
  };

  // Updates the text content of a block at a given position.
  // Image blocks are excluded — they use updateImageBlock instead.
  const updateBlock = (pos: number, value: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.position === pos && block.block_type !== "image"
          ? { ...block, content: value }
          : block,
      ),
    );
  };

  // Updates the Cloudinary URL of an image block at a given position.
  // Separated from updateBlock because image blocks have no `content`.
  const updateImageBlock = (pos: number, url: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.position === pos ? { ...block, image_url: url } : block,
      ),
    );
  };

  // Removes a block and renumbers all remaining blocks so positions stay
  // sequential (1, 2, 3…). Without renumbering, positions would have gaps
  // and insertBlock's shift logic would break.
  const deleteBlock = (pos: number) => {
    setBlocks((prev) => {
      const filtered = prev.filter((block) => block.position !== pos);
      return filtered.map((block, index) => ({ ...block, position: index + 1 }));
    });
  };

  // Moves a block from wherever activeId is to wherever overId is, using the
  // client-side UUID (block.id) that dnd-kit tracks during a drag gesture.
  // Positions are renumbered sequentially after the move so they stay
  // contiguous — same guarantee as deleteBlock.
  const moveBlock = (activeId: string, overId: string) => {
    setBlocks((prev) => {
      const activeIndex = prev.findIndex((b) => b.id === activeId);
      const overIndex  = prev.findIndex((b) => b.id === overId);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return prev;
      const result = [...prev];
      const [removed] = result.splice(activeIndex, 1);
      result.splice(overIndex, 0, removed);
      return result.map((block, index) => ({ ...block, position: index + 1 }));
    });
  };

  return (
    <StoryEditorContext.Provider
      value={{
        mode, setMode,
        title, setTitle,
        subTitle, setSubTitle,
        excerpt, setExcerpt,
        readTime, setReadTime,
        coverImage, setCoverImage,
        blocks, setBlocks,
        uploadingCount,
        incrementUploading,
        decrementUploading,
        insertBlock,
        updateBlock,
        updateImageBlock,
        deleteBlock,
        moveBlock,
      }}
    >
      {children}
    </StoryEditorContext.Provider>
  );
}

// Hook for consuming the context. Import and call this in any editor component.
export const useStoryEditor = () => useContext(StoryEditorContext);
