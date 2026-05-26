import { nunito } from "@/lib/font";
import { FaQuoteLeft } from "react-icons/fa";
import StoriImage from "./StoriImage";
import RichTextEditor from "./RichTextEditor";

// Scoped CSS reset for rich-text read output.
// Tiptap writes <p> tags — we strip their default browser margins here so
// the surrounding layout gap controls spacing, not the browser user-agent sheet.
const RICH_READ_CSS = `
  .rich-read p            { margin: 0; }
  .rich-read p + p        { margin-top: 0.5em; }
`;

// ── HEADING BLOCK ────────────────────────────────────────────────────────────
// Headings are plain text — no inline formatting needed.

const HeadingBlock = ({ content, mode, editContent }) => {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={content.content}
        onChange={(e) => editContent(content.position, e.target.value)}
        placeholder="Heading goes here…"
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
          fontWeight: 800,
          color: "#0f1e3d",
          backgroundColor: "#F0F5FF",
          border: "2px solid #B4CFF6",
          borderRadius: 12,
          outline: "none",
          width: "100%",
          padding: "12px 16px",
          boxSizing: "border-box",
        }}
      />
    );
  }
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
      {content.content || "Heading goes here"}
    </h2>
  );
};

// ── PARAGRAPH BLOCK ──────────────────────────────────────────────────────────
// Uses RichTextEditor in write mode so the admin can apply bold / italic /
// underline / strikethrough.  Read mode renders the stored HTML.

const ParagraphBlock = ({ content, mode, editContent }) => {
  if (mode === "write") {
    return (
      <RichTextEditor
        content={content.content}
        onChange={(html) => editContent(content.position, html)}
        placeholder="Write paragraph here…"
        minHeight={120}
      />
    );
  }
  return (
    <>
      <style>{RICH_READ_CSS}</style>
      <div
        className="rich-read"
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
          fontWeight: 500,
          color: "#374151",
          lineHeight: 1.85,
        }}
        dangerouslySetInnerHTML={{
          __html: content.content || "<p>Paragraph goes here</p>",
        }}
      />
    </>
  );
};

// ── QUOTE BLOCK ──────────────────────────────────────────────────────────────
// Quote text is italic by default; the admin can still apply bold / underline
// etc. inside the quote using RichTextEditor.

const QUOTE_SHAKE = `
  @keyframes quote-shake {
    0%, 100% { transform: rotate(0deg); }
    15%       { transform: rotate(-8deg); }
    30%       { transform: rotate(8deg); }
    45%       { transform: rotate(-5deg); }
    60%       { transform: rotate(5deg); }
    75%       { transform: rotate(-2deg); }
  }
`;

const QuoteBlock = ({ content, mode, editContent }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <style>{QUOTE_SHAKE}</style>

    <FaQuoteLeft
      size={mode === "write" ? "clamp(2.5rem, 6vw, 4rem)" : "clamp(5rem, 12vw, 8rem)"}
      color="#112C4A"
      style={{ animation: "quote-shake 2.5s ease-in-out infinite" }}
    />

    {mode === "write" ? (
      <RichTextEditor
        content={content.content}
        onChange={(html) => editContent(content.position, html)}
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
          className="rich-read"
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#112C4A",
            lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{
            __html: content.content || "<p>Quote goes here</p>",
          }}
        />
      </>
    )}
  </div>
);

// ── IMAGE BLOCK ──────────────────────────────────────────────────────────────

const ImageBlock = ({ mode, content, updateImage }) => (
  <StoriImage mode={mode} content={content} updateImage={updateImage} />
);

// ── MAIN ─────────────────────────────────────────────────────────────────────

export default function StoriContent({ content, mode, editContent, updateImage }) {
  if (content.block_type === "heading")
    return <HeadingBlock content={content} mode={mode} editContent={editContent} />;
  if (content.block_type === "paragraph")
    return <ParagraphBlock content={content} mode={mode} editContent={editContent} />;
  if (content.block_type === "quote")
    return <QuoteBlock content={content} mode={mode} editContent={editContent} />;
  if (content.block_type === "image")
    return <ImageBlock mode={mode} content={content} updateImage={updateImage} />;
  return null;
}
