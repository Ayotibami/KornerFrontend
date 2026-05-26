"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough } from "lucide-react";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";

// Scoped styles for the ProseMirror editable area.
// .rte-box is placed on the wrapper div so these rules don't bleed elsewhere.
const EDITOR_CSS = `
  .rte-box .ProseMirror {
    outline: none;
    padding: 12px 16px;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    font-style: inherit;
    color: inherit;
    line-height: inherit;
    min-height: var(--rte-min-height, 100px);
  }
  .rte-box .ProseMirror p            { margin: 0; }
  .rte-box .ProseMirror p + p        { margin-top: 0.5em; }
  .rte-box .ProseMirror:empty::before,
  .rte-box .ProseMirror p.is-empty:first-child::before {
    content: attr(data-placeholder);
    color: #9CA3AF;
    pointer-events: none;
    float: left;
    height: 0;
  }
`;

// ── TOOLBAR BUTTON ────────────────────────────────────────────────────────────

const ToolbarBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    // onMouseDown prevents the editor from losing focus when clicking toolbar
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    style={{
      backgroundColor: active ? primaryColor : "transparent",
      color: active ? "white" : primaryColor,
      border: `1.5px solid ${active ? primaryColor : secondaryColor}`,
      borderRadius: 6,
      width: 28,
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
      transition: "background 0.15s, color 0.15s",
    }}
  >
    {children}
  </button>
);

// ── MAIN ─────────────────────────────────────────────────────────────────────

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
  minHeight = 100,
  fontSize = "clamp(0.95rem, 2vw, 1.05rem)",
  fontWeight = 500,
  color = "#374151",
  fontStyle = "normal",
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  fontStyle?: string;
}) {
  const editor = useEditor({
    extensions: [
      // StarterKit already includes: Bold, Italic, Strike, History (undo/redo).
      // We disable block-level extensions we don't need in a story block.
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        // data-placeholder is read by the CSS rule above
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Treat a completely empty editor as an empty string so the
      // context doesn't store the bare "<p></p>" Tiptap default.
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  return (
    <div
      className="rte-box"
      style={
        {
          border: `2px solid ${secondaryColor}`,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#F0F5FF",
          fontFamily: nunito.style.fontFamily,
          fontSize,
          fontWeight,
          color,
          fontStyle,
          lineHeight: 1.85,
          // CSS custom property picked up by the scoped EDITOR_CSS rule
          "--rte-min-height": `${minHeight}px`,
        } as React.CSSProperties
      }
    >
      <style>{EDITOR_CSS}</style>

      {/* ── TOOLBAR ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "8px 12px",
          borderBottom: `1.5px solid ${secondaryColor}`,
          backgroundColor: "white",
          flexWrap: "wrap",
        }}
      >
        <ToolbarBtn
          active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={13} />
        </ToolbarBtn>

        <ToolbarBtn
          active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={13} />
        </ToolbarBtn>

        <ToolbarBtn
          active={editor?.isActive("underline") ?? false}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={13} />
        </ToolbarBtn>

        <ToolbarBtn
          active={editor?.isActive("strike") ?? false}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={13} />
        </ToolbarBtn>
      </div>

      {/* ── EDITOR CONTENT ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
