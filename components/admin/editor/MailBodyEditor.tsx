"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered,
} from "lucide-react";
import { useEffect, useReducer } from "react";

const EDITOR_CSS = `
  .mail-editor .ProseMirror {
    outline: none;
    padding: 12px 16px;
    font-family: inherit;
    font-size: 0.95rem;
    color: inherit;
    line-height: 1.65;
    min-height: var(--mail-editor-min-h, 192px);
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .mail-editor .ProseMirror p            { margin: 0.375rem 0; }
  .mail-editor .ProseMirror h1           { font-size: 1.5rem; font-weight: 800; line-height: 1.25; margin: 0.5rem 0; }
  .mail-editor .ProseMirror h2           { font-size: 1.25rem; font-weight: 700; line-height: 1.35; margin: 0.375rem 0; }
  .mail-editor .ProseMirror h3           { font-size: 1.125rem; font-weight: 600; line-height: 1.45; margin: 0.25rem 0; }
  .mail-editor .ProseMirror ul           { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
  .mail-editor .ProseMirror ol           { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
  .mail-editor .ProseMirror li           { margin-bottom: 0.125rem; }
  .mail-editor .ProseMirror strong       { font-weight: 700; }
  .mail-editor .ProseMirror em           { font-style: italic; }
  .mail-editor .ProseMirror s            { text-decoration: line-through; }
  .mail-editor .ProseMirror u            { text-decoration: underline; }

  .dark .mail-editor .ProseMirror { color: #D1D5DB; }
`;

// If value is plain text (no leading HTML tag), convert \n\n into <p> blocks
// so TipTap renders it as proper paragraphs instead of one long line.
function toHTML(value: string): string {
  if (!value) return "";
  if (value.trimStart().startsWith("<")) return value;
  return value
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export default function MailBodyEditor({
  value,
  onChange,
  placeholder = "Write your message here…",
  disabled = false,
  showNameButton = false,
  minHeight = 192,
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showNameButton?: boolean;
  minHeight?: number;
}) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
    ],
    content: toHTML(value ?? ""),
    editorProps: {
      attributes: { "data-placeholder": placeholder },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    onTransaction: () => forceUpdate(),
    editable: !disabled,
  });

  // Sync when parent updates value externally (template load, server fetch)
  useEffect(() => {
    if (!editor) return;
    const incoming = toHTML(value ?? "");
    const current  = editor.getHTML();
    if (current === incoming || (!incoming && current === "<p></p>")) return;
    editor.commands.setContent(incoming || "");
  }, [value, editor]);

  // Keep editable state in sync with disabled prop
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const press = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  const BTN =
    "w-7 h-7 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer select-none flex-shrink-0 disabled:opacity-40";
  const IDLE =
    "text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-[#1e3a5f]/60 hover:text-primary dark:hover:text-[#93b8f0]";
  const ON = "bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#93b8f0]";
  const blockBtn = (on: boolean) =>
    `flex items-center justify-center rounded-lg px-2 py-1 text-xs font-extrabold flex-shrink-0 transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 ${on ? ON : IDLE}`;

  return (
    <div
      className="mail-editor rounded-2xl border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-[border-color,box-shadow] duration-200 overflow-hidden"
      style={{ "--mail-editor-min-h": `${minHeight}px` } as React.CSSProperties}
    >
      <style>{EDITOR_CSS}</style>

      {/* ── Toolbar ── */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-secondary/50 dark:border-[#2a4a7a]/50 bg-white/40 dark:bg-[#1a1f2e]/40">

        {/* Block formats */}
        <button type="button" disabled={disabled} aria-label="Heading 1"
          onMouseDown={press(() => editor?.chain().focus().toggleHeading({ level: 1 }).run())}
          className={blockBtn(isActive("heading", { level: 1 }))}>H1</button>
        <button type="button" disabled={disabled} aria-label="Heading 2"
          onMouseDown={press(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())}
          className={blockBtn(isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" disabled={disabled} aria-label="Heading 3"
          onMouseDown={press(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())}
          className={blockBtn(isActive("heading", { level: 3 }))}>H3</button>
        <button type="button" disabled={disabled} aria-label="Paragraph"
          onMouseDown={press(() => editor?.chain().focus().setParagraph().run())}
          className={blockBtn(isActive("paragraph"))}>¶</button>

        <span className="w-px h-5 bg-secondary dark:bg-[#2a4a7a] mx-1 flex-shrink-0" />

        {/* Inline formats */}
        <button type="button" disabled={disabled} aria-label="Bold"
          onMouseDown={press(() => editor?.chain().focus().toggleBold().run())}
          className={`${BTN} ${isActive("bold") ? ON : IDLE}`}><Bold size={14} /></button>
        <button type="button" disabled={disabled} aria-label="Italic"
          onMouseDown={press(() => editor?.chain().focus().toggleItalic().run())}
          className={`${BTN} ${isActive("italic") ? ON : IDLE}`}><Italic size={14} /></button>
        <button type="button" disabled={disabled} aria-label="Strikethrough"
          onMouseDown={press(() => editor?.chain().focus().toggleStrike().run())}
          className={`${BTN} ${isActive("strike") ? ON : IDLE}`}><Strikethrough size={14} /></button>
        <button type="button" disabled={disabled} aria-label="Underline"
          onMouseDown={press(() => editor?.chain().focus().toggleUnderline().run())}
          className={`${BTN} ${isActive("underline") ? ON : IDLE}`}><UnderlineIcon size={14} /></button>

        <span className="w-px h-5 bg-secondary dark:bg-[#2a4a7a] mx-1 flex-shrink-0" />

        {/* List formats */}
        <button type="button" disabled={disabled} aria-label="Bullet list"
          onMouseDown={press(() => editor?.chain().focus().toggleBulletList().run())}
          className={`${BTN} ${isActive("bulletList") ? ON : IDLE}`}><List size={14} /></button>
        <button type="button" disabled={disabled} aria-label="Numbered list"
          onMouseDown={press(() => editor?.chain().focus().toggleOrderedList().run())}
          className={`${BTN} ${isActive("orderedList") ? ON : IDLE}`}><ListOrdered size={14} /></button>

        {showNameButton && (
          <>
            <span className="flex-1" />
            <button
              type="button"
              disabled={disabled}
              onMouseDown={press(() => editor?.chain().focus().insertContent("{{name}}").run())}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer select-none"
            >
              + name
            </button>
          </>
        )}
      </div>

      {/* ── Editor area ── */}
      <div className="relative">
        {editor?.isEmpty && (
          <p className="absolute top-0 left-0 px-4 py-3 text-gray-400 dark:text-gray-600 text-[0.95rem] pointer-events-none select-none leading-relaxed">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
