"use client";

import CreateStori from "@/app/admin/stories/create/action";
import React, { useState, useTransition, useContext } from "react";
import { toast } from "sonner";

export type ContentBlock = {
  block_type: string;
  content: string;
  image_url: string;
  position: number;
  id: string;
};

type CreateStoriContextType = {
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
  contentBlocks: ContentBlock[];
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
  isDrafting: boolean;
  onuploadDraft: () => void;
  insertBlock: (contentType: string, atPosition: number) => void;
  UpdateBlock: (pos: number, value: string) => void;
  updateImageBlock: (pos: number, url: string) => void;
  deleteBlock: (pos: number) => void;
};

const CreateStoriContext = React.createContext<CreateStoriContextType>({} as CreateStoriContextType);

export default function CreateStoriProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrafting, startDrafting] = useTransition();
  const [coverImage, setCoverImage] = React.useState<string | null>(null);
  const [mode, setMode] = useState<"write" | "read">("write");
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [readTime, setReadTime] = React.useState("");
  const [contentBlocks, setContentBlocks] = React.useState<ContentBlock[]>([]);

  const onuploadDraft = () => {
    startDrafting(async () => {
      const result = await CreateStori(title, subTitle, excerpt, readTime, coverImage, contentBlocks);
      if (result && "error" in result) {
        toast.error(result.error);
      }
    });
  };

  // Inserts a new block at atPosition, shifting all existing blocks at or
  // after that position up by one so there are no position conflicts.
  const insertBlock = (contentType: string, atPosition: number) => {
    const shifted = contentBlocks.map((block) =>
      block.position >= atPosition
        ? { ...block, position: block.position + 1 }
        : block
    );
    const newBlock: ContentBlock = {
      block_type: contentType,
      content: "",
      image_url: "",
      position: atPosition,
      id: crypto.randomUUID(),
    };
    setContentBlocks(
      [...shifted, newBlock].sort((a, b) => a.position - b.position)
    );
  };

  const UpdateBlock = (pos: number, value: string) => {
    setContentBlocks((prev) =>
      prev.map((block) =>
        block.position === pos && block.block_type !== "image"
          ? { ...block, content: value }
          : block
      )
    );
  };

  const updateImageBlock = (pos: number, url: string) => {
    setContentBlocks((prev) =>
      prev.map((block) =>
        block.position === pos ? { ...block, image_url: url } : block
      )
    );
  };

  const deleteBlock = (pos: number) => {
    const filtered = contentBlocks.filter((block) => block.position !== pos);
    // Renumber remaining blocks sequentially after deletion
    setContentBlocks(
      filtered.map((block, index) => ({ ...block, position: index + 1 }))
    );
  };

  return (
    <CreateStoriContext.Provider
      value={{
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
        contentBlocks,
        setContentBlocks,
        isDrafting,
        onuploadDraft,
        insertBlock,
        UpdateBlock,
        updateImageBlock,
        deleteBlock,
      }}
    >
      {children}
    </CreateStoriContext.Provider>
  );
}

export const useCreateStori = () => useContext(CreateStoriContext);
