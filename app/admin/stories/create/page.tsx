"use client";
import Button from "@/components/ui/Button";
import CreateImage from "@/components/ui/StoriImage";
import Excerpt from "@/components/ui/Excerpt";
import ReadTime from "@/components/ui/ReadTime";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StoriContents from "@/components/ui/StoriContents";
import StoriContent from "@/components/ui/StoriContents";
import SubsideTitle from "@/components/ui/SubTitle";

import Title from "@/components/ui/Title";

import React, { useState, useTransition } from "react";
import StoriImage from "@/components/ui/StoriImage";
import { ActivityIcon, BookCheck, Loader2, Pencil, Save } from "lucide-react";
import CreateStori from "./action";

export default function Create() {
  const [isPending, startTransition] = useTransition();
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [mode, setMode] = useState<"write" | "read">("write");
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [readTime, setReadTime] = React.useState("");
  const [contents, setContents] = React.useState([]);

  const onuploadDraft = async () => {
    startTransition(async () => {
      const response = await CreateStori(
        title,
        subTitle,
        excerpt,
        readTime,
        coverImage,
        contents
      );
    });
  };

  const appendContent = (contentType) => {
    const newContent = {
      block_type: contentType,
      content: "",
      image_url: "",
      position: contents.length + 1,
    };
    setContents([...contents, newContent]);
  };
  const editContent = (pos, value) => {
    const newContents = contents.map((content) => {
      if (content.position == pos && content.block_type !== "image") {
        return {
          ...content,
          content: value,
        };
      } else {
        return content;
      }
    });
    setContents([...newContents]);
  };
  const uploadImageBlock = (pos, url) => {
    const newContents = contents.map((content) => {
      if (content.position == pos) {
        return {
          ...content,
          image_url: url,
        };
      } else {
        return content;
      }
    });
    setContents(newContents);
  };
  const deleteContent = (pos) => {
    const newContents = contents.filter((content) => content.position !== pos);
    let rightContents = newContents.map((content, index) => {
      return {
        ...content,
        position: index + 1,
      };
    });
    setContents(rightContents);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          position: "fixed",
          zIndex: 100,
          top: 20,
          right: 20,

          display: "flex",
          gap: 10,
          flexDirection: "column",
        }}
      >
        <div
          className="transition-all duration-300 hover:scale-95 active:scale-90"
          style={{
            padding: 10,
            backgroundColor: "#B4CFF6",
            color: "#0E3E87",
            borderRadius: 30,
            width: 60,
            display: "flex",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookCheck
              onClick={() => {
                onuploadDraft();
              }}
            ></BookCheck>
          )}
        </div>
        <div
          className="transition-all duration-300 hover:scale-95 active:scale-90"
          style={{
            padding: 10,
            backgroundColor: "#B4CFF6",
            color: "#0E3E87",
            borderRadius: 30,
            width: 60,
            display: "flex",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {mode === "write" ? (
            <Save onClick={() => setMode("read")}></Save>
          ) : (
            <Pencil onClick={() => setMode("write")}></Pencil>
          )}
        </div>
      </div>
      <StoriImage updateImage={setCoverImage} mode={mode} />
      <div
        style={{
          padding: 20,
          gap: 20,

          display: "flex",
          flexDirection: "column",
        }}
      >
        <Title
          mode={mode}
          placeholder="Title"
          title={title}
          setTitle={setTitle}
        />
        <SubsideTitle
          mode={mode}
          placeholder="Subtitle"
          subTitle={subTitle}
          setSubTitle={setSubTitle}
        />
        <Excerpt
          mode={mode}
          placeholder="Excerpt"
          excerpt={excerpt}
          setExcerpt={setExcerpt}
        />
        <ReadTime
          mode={mode}
          placeholder="Reading Time"
          readTime={readTime}
          setReadTime={setReadTime}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 30,
          padding: 40,
        }}
      >
        <StoriContents
          contents={contents}
          mode={mode}
          editContent={editContent}
          deleteContent={deleteContent}
          updateImage={uploadImageBlock}
        ></StoriContents>
      </div>

      {mode === "write" && (
        <div
          style={{
            padding: 40,
            // backgroundColor: "red",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <SecondaryButton onClick={() => appendContent("heading")}>
            Heading
          </SecondaryButton>
          <SecondaryButton onClick={() => appendContent("paragraph")}>
            Paragraph
          </SecondaryButton>
          <SecondaryButton onClick={() => appendContent("quote")}>
            Quote
          </SecondaryButton>
          <SecondaryButton onClick={() => appendContent("image")}>
            Image
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
