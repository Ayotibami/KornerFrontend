// Server component — no "use client" needed because there's no interactivity.
// The quote-shake animation is pure CSS injected via a <style> tag,
// which works fine in server components.

import { nunito } from "@/lib/font";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

// Block is the shape of each piece of story content coming from the backend.
// position determines the order they render in (sorted before rendering).
// block_type decides which sub-component handles it.
type Block = {
  id: string;
  position: number;
  block_type: "heading" | "paragraph" | "quote" | "image";
  content: string;
  image_url?: string; // only present on image blocks
};

// ── SUB-COMPONENTS ──────────────────────────────────────────────────────────
// Each block type has its own component so styling stays isolated and easy to change.

function HeadingBlock({ content }: { content: string }) {
  return (
    <h2
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
        fontWeight: 800,
        color: "#0f1e3d",
        margin: 0,
        lineHeight: 1.3,
      }}
    >
      {content}
    </h2>
  );
}

// content for paragraph/quote blocks is real HTML (TipTap's output from the
// editor, e.g. "<p>some text</p>", possibly with <strong>/<em>/<u>/<s>
// inside) — never plain text. Dropping it in as a JSX child would just print
// the literal tags on screen instead of rendering them, since React escapes
// string children by default. dangerouslySetInnerHTML actually parses it as
// markup — same approach the admin editor's own read mode already uses for
// these two block types in EditorBlock.tsx.
//
// Margins reset + reapplied via this scoped class because TipTap content can
// contain multiple <p> tags (multiple paragraphs typed within one block),
// which need consistent spacing instead of relying on the browser's default
// <p> margins.
const RICH_HTML_CSS = `
  .stori-rich-html p { margin: 0; }
  .stori-rich-html p + p { margin-top: 0.5em; }
`;

function ParagraphBlock({ content }: { content: string }) {
  return (
    <>
      <style>{RICH_HTML_CSS}</style>
      {/* lineHeight: 1.85 gives generous spacing between lines — important
          for long-form reading comfort, especially on mobile. */}
      <div
        className="stori-rich-html"
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
          fontWeight: 500,
          color: "#374151",
          lineHeight: 1.85,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

function QuoteBlock({ content }: { content: string }) {
  return (
    // Column layout: big quote icon on top, italic text below.
    // gap: 12 between icon and text — keeps them close but not touching.
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* quote-shake: the icon rocks left and right on a 2.5s loop.
          We use FaQuoteLeft (react-icons) instead of the " character because
          font-rendered quotation marks carry large invisible line-height
          that creates unwanted vertical space. An SVG icon has no such issue. */}
      <style>{`
        @keyframes quote-shake {
          0%, 100% { transform: rotate(0deg); }
          15%       { transform: rotate(-8deg); }
          30%       { transform: rotate(8deg); }
          45%       { transform: rotate(-5deg); }
          60%       { transform: rotate(5deg); }
          75%       { transform: rotate(-2deg); }
        }
      `}</style>
      <FaQuoteLeft
        size="clamp(5rem, 12vw, 8rem)"
        color="#112C4A"
        style={{ animation: "quote-shake 2.5s ease-in-out infinite" }}
      />

      <style>{RICH_HTML_CSS}</style>
      <div
        className="stori-rich-html"
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#112C4A",
          lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

function ImageBlock({
  content,
  image_url,
}: {
  content: string;
  image_url?: string;
}) {
  // image_url is the primary source; content is used as fallback.
  // If neither exists, we render the grey placeholder div only (no <Image>).
  const src = image_url || content;

  return (
    // aspectRatio: "16/9" keeps the image at a widescreen ratio regardless of width.
    // position: relative is required for Next.js <Image fill> to work —
    // fill makes the image stretch to cover its parent, so the parent needs
    // explicit dimensions (which aspectRatio + width: 100% provides).
    // overflow: hidden clips the image to the rounded corners.
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        borderRadius: "clamp(8px, 2vw, 16px)",
        overflow: "hidden",
        backgroundColor: "#e2e8f0", // grey shown while image loads or when no src
      }}
    >
      {src ? (
        <Image
          src={src}
          alt="Story image"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 768px"
        />
      ) : null}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function StoriBody({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null;

  // Sort by position before rendering so the order is always correct
  // regardless of what order the API returns them in.
  // [...blocks] creates a copy first — sort() mutates the array in place,
  // and we don't want to mutate the prop that was passed in.
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(16px, 3vw, 28px)",
        padding: "clamp(16px, 4vw, 32px)",
        backgroundColor: "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        width: "100%",
      }}
    >
      {sorted.map((block) => {
        if (block.block_type === "heading")
          return <HeadingBlock key={block.id} content={block.content} />;
        if (block.block_type === "paragraph")
          return <ParagraphBlock key={block.id} content={block.content} />;
        if (block.block_type === "quote")
          return <QuoteBlock key={block.id} content={block.content} />;
        if (block.block_type === "image")
          return (
            <ImageBlock
              key={block.id}
              content={block.content}
              image_url={block.image_url}
            />
          );
        return null; // unknown block types are silently ignored
      })}
    </div>
  );
}
