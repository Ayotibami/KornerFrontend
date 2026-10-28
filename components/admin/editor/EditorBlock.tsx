// EditorBlock — renders a single content block based on its block_type.
// Routes to HeadingBlock, ParagraphBlock, QuoteBlock, or ImageUploader.
// Both write and read modes are handled per sub-component.

import type { EditorBlock as BlockData } from "@/context/StoryEditorContext";
import { FaQuoteLeft } from "react-icons/fa";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import { headingToEditorHtml, headingToSafeHtml } from "@/lib/headingHtml";

// Bold inside a heading goes one step heavier than the heading's own 800.
const HEADING_READ_CSS = `
  .heading-read strong { font-weight: 900; }
`;

// Strips default browser margins from TipTap's <p> output in read mode.
// Dark mode overrides ensure the text color adapts.
const RICH_READ_CSS = `
  .rich-read p { margin: 0; }
  .rich-read p + p { margin-top: 0.5em; }
  .dark .rich-read { color: #D1D5DB; }
`;

// Wobble animation for the decorative quote icon.
const QUOTE_SHAKE_CSS = `
  @keyframes quote-shake {
    0%, 100% { transform: rotate(0deg); }
    15%       { transform: rotate(-8deg); }
    30%       { transform: rotate(8deg); }
    45%       { transform: rotate(-5deg); }
    60%       { transform: rotate(5deg); }
    75%       { transform: rotate(-2deg); }
  }
`;

// Headings use the same rich editor as paragraphs (bold, italic, underline,
// strikethrough), limited to one line. Older headings were saved as plain text;
// headingToEditorHtml / headingToSafeHtml keep those working unchanged.
function HeadingBlock({ block, mode, onChange }: { block: BlockData; mode: "write" | "read"; onChange: (v: string) => void }) {
  if (mode === "write") {
    return (
      <RichTextEditor
        content={headingToEditorHtml(block.content)}
        onChange={onChange}
        placeholder="Heading goes here…"
        minHeight={0}
        singleLine
        fontSize="clamp(1.2rem, 3vw, 1.75rem)"
        fontWeight={800}
        color="#0f1e3d"
        darkColor="#f9fafb"
      />
    );
  }
  const html = headingToSafeHtml(block.content);
  return (
    <>
      <style>{HEADING_READ_CSS}</style>
      <h2
        className="heading-read font-extrabold text-[#0f1e3d] dark:text-gray-50 m-0 leading-snug"
        style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
        dangerouslySetInnerHTML={{ __html: html || "Heading goes here" }}
      />
    </>
  );
}

function ParagraphBlock({ block, mode, onChange }: { block: BlockData; mode: "write" | "read"; onChange: (v: string) => void }) {
  if (mode === "write") {
    return (
      <RichTextEditor
        content={block.content}
        onChange={onChange}
        placeholder="Write paragraph here…"
        minHeight={120}
      />
    );
  }
  return (
    <>
      <style>{RICH_READ_CSS}</style>
      <div
        className="rich-read font-medium text-[#374151] dark:text-gray-300 leading-[1.85]"
        style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)" }}
        dangerouslySetInnerHTML={{ __html: block.content || "<p>Paragraph goes here</p>" }}
      />
    </>
  );
}

function QuoteBlock({ block, mode, onChange }: { block: BlockData; mode: "write" | "read"; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <style>{QUOTE_SHAKE_CSS}</style>
      <FaQuoteLeft
        className="text-[#112C4A] dark:text-[#93b8f0]"
        style={{
          fontSize: mode === "write" ? "clamp(2.5rem, 6vw, 4rem)" : "clamp(5rem, 12vw, 8rem)",
          animation: "quote-shake 2.5s ease-in-out infinite",
        }}
      />
      {mode === "write" ? (
        <RichTextEditor
          content={block.content}
          onChange={onChange}
          placeholder="Write your quote here…"
          minHeight={80}
          fontSize="clamp(1rem, 2.5vw, 1.2rem)"
          fontWeight={600}
          color="#112C4A"
          fontStyle="italic"
        />
      ) : (
        <>
          <style>{RICH_READ_CSS}</style>
          <div
            className="rich-read font-semibold italic text-[#112C4A] dark:text-[#93b8f0] leading-[1.7]"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}
            dangerouslySetInnerHTML={{ __html: block.content || "<p>Quote goes here</p>" }}
          />
        </>
      )}
    </div>
  );
}

export default function EditorBlock({
  block, mode, onChange, onImageUpload, onImageFilePicked,
}: {
  block: BlockData;
  mode: "write" | "read";
  onChange: (value: string) => void;
  onImageUpload: (url: string) => void;
  onImageFilePicked: (file: File) => void;
}) {
  switch (block.block_type) {
    case "heading":
      return <HeadingBlock block={block} mode={mode} onChange={onChange} />;
    case "paragraph":
      return <ParagraphBlock block={block} mode={mode} onChange={onChange} />;
    case "quote":
      return <QuoteBlock block={block} mode={mode} onChange={onChange} />;
    case "image":
      return <ImageUploader mode={mode} url={block.image_url || block.content} onFilePicked={onImageFilePicked} />;
  }
}
