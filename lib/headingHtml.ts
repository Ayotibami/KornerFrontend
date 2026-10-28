// Heading blocks hold one of two things:
//   1. Legacy plain text, from when headings were a plain text box
//      ("Fish & Chips", "Is 5 < 6?"). It was shown as text, never as HTML.
//   2. Formatted text from the rich heading editor: TipTap HTML such as
//      <p>Hello <strong>world</strong></p>.
//
// These helpers keep both working, and make the second safe to show: only
// bold, italic, underline and strikethrough survive; every other tag, and every
// attribute, is dropped.

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

// The rich editor always wraps its output in <p>…</p>. The old plain text box
// could not produce that, so it tells the two formats apart.
export function isRichHeading(content: string): boolean {
  return /^\s*<p>[\s\S]*<\/p>\s*$/.test(content);
}

// What to load into the editor: formatted headings as they are, legacy plain
// text escaped, so something like "<b>" typed in the old box stays literal text.
export function headingToEditorHtml(content: string): string {
  if (!content) return "";
  return isRichHeading(content) ? content : `<p>${escapeHtml(content)}</p>`;
}

const ALLOWED_TAGS = new Set(["strong", "em", "u", "s"]);

// Inline-only HTML that is safe to put inside an <h2>.
export function headingToSafeHtml(content: string): string {
  if (!content) return "";
  // Legacy text: escaped, which is exactly how React showed it before.
  if (!isRichHeading(content)) return escapeHtml(content);

  let out = "";
  let last = 0;
  const tag = /<[^>]*>/g;
  let m: RegExpExecArray | null;

  // Text between tags is already entity-escaped by the editor. Any stray < or >
  // left in it is escaped here so it can never start a tag.
  const text = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  while ((m = tag.exec(content)) !== null) {
    out += text(content.slice(last, m.index));
    last = m.index + m[0].length;

    const parsed = /^<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)/.exec(m[0]);
    if (!parsed) continue; // not a real tag: dropped
    const closing = parsed[1] === "/";
    const name = parsed[2].toLowerCase();

    if (ALLOWED_TAGS.has(name)) {
      out += closing ? `</${name}>` : `<${name}>`;
    } else if (name === "br" || (name === "p" && closing)) {
      out += " "; // line break or paragraph end: a heading is one line
    }
    // any other tag (script, img, a, …) is dropped
  }
  out += text(content.slice(last));

  return out.replace(/\s+/g, " ").trim();
}

// Plain text of a heading, for places that cannot show formatting.
export function headingToPlainText(content: string): string {
  return headingToSafeHtml(content)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
