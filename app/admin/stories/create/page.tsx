"use client";

import Excerpt from "@/components/admincomponent/ui/Excerpt";
import ReadTime from "@/components/admincomponent/ui/ReadTime";
import StoriContents from "@/components/admincomponent/ui/StoriContents";
import SubsideTitle from "@/components/admincomponent/ui/SubTitle";
import Title from "@/components/admincomponent/ui/Title";
import StoriImage from "@/components/admincomponent/ui/StoriImage";
import { BookCheck, Loader2, Pencil, Save } from "lucide-react";
import { useCreateStori } from "@/context/CreateStoriContext";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";

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
    setCoverImage,
    contentBlocks,
    isDrafting,
    onuploadDraft,
    insertBlock,
    UpdateBlock,
    updateImageBlock,
    deleteBlock,
  } = useCreateStori();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: nunito.style.fontFamily,
      }}
    >
      {/* ── FLOATING ACTION BUTTONS ─────────────────────────────────────────
          top: calc(14vh + 16px) clears the fixed navbar (which is 14vh tall). */}
      <div
        style={{
          position: "fixed",
          zIndex: 100,
          top: "calc(14vh + 16px)",
          right: "clamp(12px, 3vw, 24px)",
          display: "flex",
          gap: 10,
          flexDirection: "column",
        }}
      >
        {/* Draft button */}
        <div
          className="transition-all duration-300 hover:scale-95 active:scale-90"
          style={{
            padding: 10,
            backgroundColor: secondaryColor,
            color: primaryColor,
            borderRadius: 30,
            width: 52,
            height: 52,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}
          onClick={onuploadDraft}
        >
          {isDrafting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <BookCheck size={20} />
          )}
        </div>

        {/* Write / preview toggle */}
        <div
          className="transition-all duration-300 hover:scale-95 active:scale-90"
          style={{
            padding: 10,
            backgroundColor: secondaryColor,
            color: primaryColor,
            borderRadius: 30,
            width: 52,
            height: 52,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}
          onClick={() => setMode(mode === "write" ? "read" : "write")}
        >
          {mode === "write" ? <Save size={20} /> : <Pencil size={20} />}
        </div>
      </div>

      {/* ── PAGE CONTENT ──────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 40px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Cover image */}
        <StoriImage updateImage={setCoverImage} mode={mode} />

        {/* Story metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Title
            mode={mode}
            placeholder="Story title…"
            title={title}
            setTitle={setTitle}
          />
          <SubsideTitle
            mode={mode}
            placeholder="Subtitle…"
            subTitle={subTitle}
            setSubTitle={setSubTitle}
          />
          <Excerpt
            mode={mode}
            placeholder="Short teaser — what is this story about?"
            excerpt={excerpt}
            setExcerpt={setExcerpt}
          />
          <ReadTime
            mode={mode}
            placeholder="e.g. 5 min read"
            readTime={readTime}
            setReadTime={setReadTime}
          />
        </div>

        {/* Content blocks with inline insert rows */}
        <StoriContents
          contents={contentBlocks}
          mode={mode}
          editContent={UpdateBlock}
          deleteContent={deleteBlock}
          updateImage={updateImageBlock}
          onInsert={insertBlock}
        />
      </div>
    </div>
  );
}
