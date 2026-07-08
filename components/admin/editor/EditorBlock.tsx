// EditorBlock — renders a single content block based on its block_type.
// Routes to HeadingBlock, ParagraphBlock, QuoteBlock, or ImageUploader.
// Both write and read modes are handled per sub-component.

import type { EditorBlock as BlockData } from "@/context/StoryEditorContext";
import { FaQuoteLeft } from "react-icons/fa";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

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

function HeadingBlock({ block, mode, onChange }: { block: BlockData; mode: "write" | "read"; onChange: (v: string) => void }) {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Heading goes here…"
        className="w-full px-4 py-3 bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a] rounded-xl outline-none font-extrabold text-[#0f1e3d] dark:text-gray-50 placeholder:text-gray-300 dark:placeholder:text-gray-600 box-border"
        style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
      />
    );
  }
  const text = block.content.replace(/<[^>]*>/g, "").trim();
  return (
    <h2
      className="font-extrabold text-[#0f1e3d] dark:text-gray-50 m-0 leading-snug"
      style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
    >
      {text || "Heading goes here"}
    </h2>
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
      return <ImageUploader mode={mode} url={block.image_url} onFilePicked={onImageFilePicked} />;
  }
}
