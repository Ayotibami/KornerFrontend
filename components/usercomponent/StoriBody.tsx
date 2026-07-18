"use client";

import { nunito } from "@/lib/font";
import { cloudinaryUrl } from "@/lib/utils";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { useStoryTheme } from "@/context/StoryThemeContext";

type Block = {
  id: string;
  position: number;
  block_type: "heading" | "paragraph" | "quote" | "image";
  content: string;
  image_url?: string;
};

const RICH_HTML_BASE = `
  .stori-rich-html p { margin: 0; }
  .stori-rich-html p + p { margin-top: 0.5em; }
  .stori-rich-html p::first-letter { text-transform: uppercase; }
  .stori-rich-html ul,
  .stori-rich-html ol  { padding-left: 1.5em; margin: 0.4em 0; }
  .stori-rich-html ul  { list-style-type: disc; }
  .stori-rich-html ol  { list-style-type: decimal; }
  .stori-rich-html li  { margin: 0.2em 0; }
  .stori-rich-html li p { margin: 0; }
`;

function HeadingBlock({ content, dark }: { content: string; dark: boolean }) {
  return (
    <h2
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
        fontWeight: 800,
        color: dark ? "#ccd6f6" : "#0f1e3d",
        margin: 0,
        lineHeight: 1.3,
        textTransform: "capitalize",
        transition: "color 0.45s ease",
      }}
    >
      {content}
    </h2>
  );
}

function ParagraphBlock({ content, dark }: { content: string; dark: boolean }) {
  return (
    <>
      <style>{`
        ${RICH_HTML_BASE}
        .stori-rich-html-dark p,
        .stori-rich-html-dark li { color: #8ba3c7; }
        .stori-rich-html-dark strong { color: #ccd6f6; }
        .stori-rich-html-dark em { color: #93b8e8; }
      `}</style>
      <div
        className={`stori-rich-html${dark ? " stori-rich-html-dark" : ""}`}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
          fontWeight: 500,
          color: dark ? "#8ba3c7" : "#374151",
          lineHeight: 1.85,
          transition: "color 0.45s ease",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

function QuoteBlock({ content, dark }: { content: string; dark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "clamp(16px, 3vw, 24px)",
        borderRadius: "clamp(12px, 2vw, 18px)",
        background: dark
          ? "linear-gradient(135deg, rgba(14,34,80,0.6) 0%, rgba(10,20,50,0.4) 100%)"
          : "linear-gradient(135deg, rgba(17,44,74,0.04) 0%, rgba(17,44,74,0.08) 100%)",
        border: dark ? "1px solid rgba(59,130,246,0.15)" : "1px solid rgba(17,44,74,0.08)",
        transition: "background 0.45s ease, border 0.45s ease",
      }}
    >
      <style>{`
        @keyframes quote-shake {
          0%, 100% { transform: rotate(0deg); }
          15%       { transform: rotate(-8deg); }
          30%       { transform: rotate(8deg); }
          45%       { transform: rotate(-5deg); }
          60%       { transform: rotate(5deg); }
          75%       { transform: rotate(-2deg); }
        }
        ${RICH_HTML_BASE}
        .stori-rich-html-dark p,
        .stori-rich-html-dark li { color: #5b9af5; }
      `}</style>

      <FaQuoteLeft
        size="clamp(5rem, 12vw, 8rem)"
        color={dark ? "#1d3a6e" : "#112C4A"}
        style={{
          animation: "quote-shake 2.5s ease-in-out infinite",
          transition: "color 0.45s ease",
        }}
      />

      <div
        className={`stori-rich-html${dark ? " stori-rich-html-dark" : ""}`}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          fontWeight: 600,
          fontStyle: "italic",
          color: dark ? "#5b9af5" : "#112C4A",
          lineHeight: 1.7,
          textTransform: "capitalize",
          transition: "color 0.45s ease",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

function ImageBlock({
  content,
  image_url,
  storyTitle,
  dark,
}: {
  content: string;
  image_url?: string;
  storyTitle: string;
  dark: boolean;
}) {
  const src = cloudinaryUrl(image_url || content, 1200);
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        borderRadius: "clamp(8px, 2vw, 16px)",
        overflow: "hidden",
        backgroundColor: dark ? "#0f1e35" : "#e2e8f0",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        transition: "background-color 0.45s ease",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={storyTitle}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 768px"
        />
      ) : null}
    </div>
  );
}

export default function StoriBody({ blocks, title }: { blocks: Block[]; title: string }) {
  const { dark } = useStoryTheme();

  if (!blocks || blocks.length === 0) return null;

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(16px, 3vw, 28px)",
        padding: "clamp(20px, 4vw, 36px)",
        backgroundColor: dark ? "#0a1628" : "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        width: "100%",
        border: dark ? "1px solid rgba(59, 130, 246, 0.08)" : "none",
        boxShadow: dark
          ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "background-color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
      }}
    >
      {sorted.map((block) => {
        if (block.block_type === "heading")
          return <HeadingBlock key={block.id} content={block.content} dark={dark} />;
        if (block.block_type === "paragraph")
          return <ParagraphBlock key={block.id} content={block.content} dark={dark} />;
        if (block.block_type === "quote")
          return <QuoteBlock key={block.id} content={block.content} dark={dark} />;
        if (block.block_type === "image")
          return (
            <ImageBlock
              key={block.id}
              content={block.content}
              image_url={block.image_url}
              storyTitle={title}
              dark={dark}
            />
          );
        return null;
      })}
    </div>
  );
}
