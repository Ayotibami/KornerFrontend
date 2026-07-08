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

// EditorBlock extends the API's Block type with client-side fields.
// `id` is a UUID generated with crypto.randomUUID() and used as the React key.
// `image_public_id` is the Cloudinary public_id for image blocks — returned
// by the server on load and sent back on save for orphan cleanup.
export type EditorBlock = {
  id: string;
  block_type: BlockType;
  content: string;        // HTML string for text blocks; empty for image blocks
  image_url: string;      // Cloudinary URL for image blocks; empty otherwise
  image_public_id?: string; // tracked for Cloudinary cleanup; undefined on new blocks
  position: number;       // 1-based display order
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
  // Pending files — set when user picks a new image but before Save is clicked.
  // Uploads happen on Save so only the final chosen image is ever sent to Cloudinary.
  pendingCoverFile: File | null;
  setPendingCoverFile: (file: File | null) => void;
  pendingBlockFiles: Record<string, File>; // keyed by block.id
  setPendingBlockFile: (blockId: string, file: File | null) => void;
  clearPendingFiles: () => void;
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
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [pendingBlockFiles, setPendingBlockFilesState] = useState<Record<string, File>>({});

  const setPendingBlockFile = (blockId: string, file: File | null) => {
    setPendingBlockFilesState((prev) => {
      if (file === null) {
        const { [blockId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [blockId]: file };
    });
  };

  const clearPendingFiles = () => {
    setPendingCoverFile(null);
    setPendingBlockFilesState({});
  };

  // Inserts a new block at `atPosition`, shifting all existing blocks
  // at or after that position up by 1 to make room.
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
        image_public_id: undefined,
        position: atPosition,
      };
      return [...shifted, newBlock].sort((a, b) => a.position - b.position);
    });
  };

  const updateBlock = (pos: number, value: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.position === pos && block.block_type !== "image"
          ? { ...block, content: value }
          : block,
      ),
    );
  };

  const updateImageBlock = (pos: number, url: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.position === pos ? { ...block, image_url: url } : block,
      ),
    );
  };

  const deleteBlock = (pos: number) => {
    setBlocks((prev) => {
      const blockToDelete = prev.find((b) => b.position === pos);
      if (blockToDelete) {
        setPendingBlockFilesState((files) => {
          const { [blockToDelete.id]: _, ...rest } = files;
          return rest;
        });
      }
      const filtered = prev.filter((block) => block.position !== pos);
      return filtered.map((block, index) => ({ ...block, position: index + 1 }));
    });
  };

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
        pendingCoverFile, setPendingCoverFile,
        pendingBlockFiles,
        setPendingBlockFile,
        clearPendingFiles,
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
