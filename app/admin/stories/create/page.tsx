"use client";

import Excerpt from "@/components/ui/Excerpt";
import ReadTime from "@/components/ui/ReadTime";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StoriContents from "@/components/ui/StoriContents";
import SubsideTitle from "@/components/ui/SubTitle";
import Title from "@/components/ui/Title";
import StoriImage from "@/components/ui/StoriImage";
import { BookCheck, Loader2, Pencil, Save } from "lucide-react";
import { useCreateStori } from "@/context/CreateStoriContext";

export default function Create() {
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
    contentBlocks,
    setContentBlocks,
    isDrafting,
    onuploadDraft,
    appendBlock,
    UpdateBlock,
    updateImageBlock,
    deleteBlock,
  } = useCreateStori();
  console.log("====================================");
  console.log(contentBlocks);
  console.log("====================================");
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
          {isDrafting ? (
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
          contents={contentBlocks}
          mode={mode}
          editContent={UpdateBlock}
          deleteContent={deleteBlock}
          updateImage={updateImageBlock}
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
          <SecondaryButton onClick={() => appendBlock("heading")}>
            Heading
          </SecondaryButton>
          <SecondaryButton onClick={() => appendBlock("paragraph")}>
            Paragraph
          </SecondaryButton>
          <SecondaryButton onClick={() => appendBlock("quote")}>
            Quote
          </SecondaryButton>
          <SecondaryButton onClick={() => appendBlock("image")}>
            Image
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
