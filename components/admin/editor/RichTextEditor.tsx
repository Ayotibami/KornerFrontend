"use client";

// Rich text editor built on TipTap (ProseMirror).
// Used for paragraph and quote blocks inside the story editor.
//
// Why onMouseDown + e.preventDefault() on toolbar buttons:
//   Clicking a button normally blurs the editor first, clearing TipTap's selection.
//   onMouseDown + preventDefault keeps the editor focused through the click.
//
// Why a <style> tag for ProseMirror CSS:
//   Tailwind can't target .ProseMirror p — only elements in your own template.
//   Scoped CSS via the rte-box wrapper class is the only clean solution.
//
// Why forceUpdate via useReducer:
//   TipTap's isActive() state changes inside ProseMirror without triggering React renders.
//   onTransaction fires on every change and forceUpdate() keeps the toolbar in sync.

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered } from "lucide-react";
import { useReducer } from "react";

// CSS scoped to .rte-box — covers both light and dark mode.
// Dark mode rules override the inherited text color via the .dark ancestor class.
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
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
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
  .rte-box .ProseMirror ul,
  .rte-box .ProseMirror ol  { padding-left: 1.5em; margin: 0.4em 0; }
  .rte-box .ProseMirror ul  { list-style-type: disc; }
  .rte-box .ProseMirror ol  { list-style-type: decimal; }
  .rte-box .ProseMirror li  { margin: 0.15em 0; }
  .rte-box .ProseMirror li p { margin: 0; }

  /* Dark mode overrides — .dark class on an ancestor activates these */
  .dark .rte-box .ProseMirror {
    color: #D1D5DB;
  }
  .dark .rte-box .ProseMirror:empty::before,
  .dark .rte-box .ProseMirror p.is-empty:first-child::before {
    color: #4B5563;
  }
`;

function ToolbarBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-7 h-7 flex items-center justify-center rounded flex-shrink-0 border transition-colors duration-150 ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-transparent text-primary border-secondary dark:border-[#2a4a7a]"
      }`}
    >
      {children}
    </button>
  );
}

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
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
    ],
    content: content || "",
    editorProps: {
      attributes: { "data-placeholder": placeholder ?? "" },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    onTransaction: () => forceUpdate(),
  });

  return (
    <div
      className="rte-box border-2 border-secondary dark:border-[#2a4a7a] rounded-xl overflow-hidden bg-[#F0F5FF] dark:bg-[#1e2a3a] leading-[1.85]"
      style={
        {
          fontSize,
          fontWeight,
          color,
          fontStyle,
          "--rte-min-height": `${minHeight}px`,
        } as React.CSSProperties
      }
    >
      <style>{EDITOR_CSS}</style>

      {/* Formatting toolbar */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-secondary dark:border-[#2a4a7a] bg-white dark:bg-[#1a1f2e] flex-wrap">
        <ToolbarBtn active={editor?.isActive("bold") ?? false} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold size={13} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive("italic") ?? false} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic size={13} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive("underline") ?? false} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive("strike") ?? false} onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <Strikethrough size={13} />
        </ToolbarBtn>
        <span className="w-px h-5 bg-secondary dark:bg-[#2a4a7a] self-center mx-0.5" />
        <ToolbarBtn active={editor?.isActive("bulletList") ?? false} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List size={13} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive("orderedList") ?? false} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={13} />
        </ToolbarBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
