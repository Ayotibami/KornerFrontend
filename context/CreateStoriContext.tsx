"use client";

import CreateStori from "@/app/admin/stories/create/action";
import React, { useState, useTransition } from "react";
const CreateStoriContext = React.createContext({});
import { useContext } from "react";
export default function CreateStoriProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrafting, startDrafting] = useTransition();
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [mode, setMode] = useState<"write" | "read">("write");
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [readTime, setReadTime] = React.useState("");
  const [contentBlocks, setContentBlocks] = React.useState<ContentBlock[]>([]);

  type ContentBlock = {
    block_type: string;
    content: string;
    image_url: string;
    position: number;
    id: string;
  };
  const onuploadDraft = () => {
    startDrafting(async () => {
      const response = await CreateStori(
        title,
        subTitle,
        excerpt,
        readTime,
        coverImage,
        contentBlocks
      );
    });
  };

  const appendBlock = (contentType: string) => {
    const newContent: ContentBlock = {
      block_type: contentType,
      content: "",
      image_url: "",
      position: contentBlocks.length + 1,
      id: crypto.randomUUID(),
    };
    setContentBlocks([...contentBlocks, newContent]);
  };

  const UpdateBlock = (pos: number, value: string) => {
    const newContents = contentBlocks.map((content) => {
      if (content.position == pos && content.block_type !== "image") {
        return {
          ...content,
          content: value,
        };
      } else {
        return content;
      }
    });
    setContentBlocks([...newContents]);
  };

  const updateImageBlock = (pos: number, url: string) => {
    const newContents = contentBlocks.map((content) => {
      if (content.position == pos) {
        return {
          ...content,
          image_url: url,
        };
      } else {
        return content;
      }
    });
    setContentBlocks(newContents);
  };

  const deleteBlock = (pos: number) => {
    const newContents = contentBlocks.filter(
      (content) => content.position !== pos
    );
    const rightContents = newContents.map((content, index) => {
      return {
        ...content,
        position: index + 1,
      };
    });
    setContentBlocks(rightContents);
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
        appendBlock,
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
