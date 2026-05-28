"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { getStori, updateStori } from "./action";
import { useCreateStori } from "@/context/CreateStoriContext";
import StoriImage from "@/components/admincomponent/ui/StoriImage";
import Title from "@/components/admincomponent/ui/Title";
import SubsideTitle from "@/components/admincomponent/ui/SubTitle";
import Excerpt from "@/components/admincomponent/ui/Excerpt";
import ReadTime from "@/components/admincomponent/ui/ReadTime";
import StoriContents from "@/components/admincomponent/ui/StoriContents";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";
import { ArrowLeft, BookCheck, Loader2, Pencil, Save } from "lucide-react";
import Link from "next/link";

export default function StoriPage() {
  const { storiId } = useParams<{ storiId: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState("");
  const [isUpdating, startUpdating] = useTransition();

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
    insertBlock,
    UpdateBlock,
    updateImageBlock,
    deleteBlock,
  } = useCreateStori();

  useEffect(() => {
    getStori(storiId).then((stori) => {
      if (!stori) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setMode("read");
      setTitle(stori.title ?? "");
      setSubTitle(stori.subtitle ?? "");
      setExcerpt(stori.excerpt ?? "");
      setReadTime(stori.readingTime ?? "");
      setCoverImage(stori.coverImage ?? null);
      setStatus(stori.status ?? "");
      setContentBlocks(
        (stori.blocks ?? [])
          .sort((a, b) => a.position - b.position)
          .map((b) => ({
            block_type: b.blockType,
            content: b.content ?? "",
            image_url: b.image_url ?? "",
            position: b.position,
            id: b.blockId,
          })),
      );

      setLoading(false);
    });
  }, [storiId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = () => {
    startUpdating(async () => {
      await updateStori(
        storiId,
        title,
        subTitle,
        excerpt,
        readTime,
        coverImage,
        contentBlocks,
      );
    });
  };

  // ── LOADING ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2 size={36} color={primaryColor} className="animate-spin" />
      </div>
    );
  }

  // ── NOT FOUND ─────────────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: nunito.style.fontFamily,
        }}
      >
        <p style={{ color: "#6B7280", fontSize: 16, margin: 0 }}>
          Story not found.
        </p>
      </div>
    );
  }

  // ── STORY VIEW / EDIT ─────────────────────────────────────────────────────────

  const btnStyle: React.CSSProperties = {
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
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: nunito.style.fontFamily,
      }}
    >
      {/* ── FLOATING ACTION BUTTONS ─────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          zIndex: 100,
          top: "calc(14vh + 16px)",
          right: "clamp(12px, 3vw, 24px)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {mode === "read" ? (
          // Read mode — pencil only
          <div
            className="transition-all duration-300 hover:scale-95 active:scale-90"
            style={btnStyle}
            onClick={() => setMode("write")}
          >
            <Pencil size={20} />
          </div>
        ) : (
          // Edit mode — save draft + back to read
          <>
            <div
              className="transition-all duration-300 hover:scale-95 active:scale-90"
              style={btnStyle}
              onClick={handleUpdate}
            >
              {isUpdating ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <BookCheck size={20} />
              )}
            </div>
            <div
              className="transition-all duration-300 hover:scale-95 active:scale-90"
              style={btnStyle}
              onClick={() => setMode("read")}
            >
              <Save size={20} />
            </div>
          </>
        )}
      </div>

      {/* ── PAGE CONTENT ──────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 40px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Link
          href="/admin/home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#0f1e3d",
            textDecoration: "none",
            fontFamily: nunito.style.fontFamily,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <ArrowLeft size={18} />
          Go back
        </Link>

        <StoriImage
          updateImage={setCoverImage}
          mode={mode}
          existingUrl={coverImage ?? undefined}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Title mode={mode} title={title} setTitle={setTitle} />
          <SubsideTitle
            mode={mode}
            subTitle={subTitle}
            setSubTitle={setSubTitle}
          />
          <Excerpt mode={mode} excerpt={excerpt} setExcerpt={setExcerpt} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ReadTime
              mode={mode}
              readTime={readTime}
              setReadTime={setReadTime}
            />
            <span
              style={{
                padding: "4px 14px",
                backgroundColor:
                  status === "Draft" ? secondaryColor : primaryColor,
                color: status === "Draft" ? "#0E3E87" : "white",
                borderRadius: 30,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: nunito.style.fontFamily,
              }}
            >
              {status}
            </span>
          </div>
        </div>

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
