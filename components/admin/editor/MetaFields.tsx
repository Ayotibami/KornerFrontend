// MetaFields — the four story metadata inputs above the content blocks.
// Write mode: transparent input with bottom border — feels like typing directly on the page.
// Read mode: styled HTML elements so the preview looks like a finished article.
// All font sizes use clamp() for fluid responsive scaling.

import { Clock } from "lucide-react";

export function TitleField({ mode, value, onChange, placeholder = "Story title…" }: {
  mode: "write" | "read"; value: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b-2 border-secondary dark:border-[#2a4a7a] outline-none font-extrabold text-[#0f1e3d] dark:text-gray-50 py-2 placeholder:text-gray-300 dark:placeholder:text-gray-600"
        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
      />
    );
  }
  return (
    <h1 className="font-extrabold text-[#0f1e3d] dark:text-gray-50 m-0 leading-tight" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
      {value || "Title goes here"}
    </h1>
  );
}

export function SubTitleField({ mode, value, onChange, placeholder = "Subtitle…" }: {
  mode: "write" | "read"; value: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b-2 border-secondary dark:border-[#2a4a7a] outline-none font-medium text-[#374151] dark:text-gray-300 py-1.5 placeholder:text-gray-300 dark:placeholder:text-gray-600"
        style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)" }}
      />
    );
  }
  return (
    <p className="font-medium text-[#374151] dark:text-gray-300 m-0 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)" }}>
      {value || "Subtitle goes here"}
    </p>
  );
}

export function ExcerptField({ mode, value, onChange, placeholder = "Excerpt" }: {
  mode: "write" | "read"; value: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  if (mode === "write") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent border-0 border-b-2 border-secondary dark:border-[#2a4a7a] outline-none font-medium italic text-[#374151] dark:text-gray-300 py-1.5 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none leading-[1.7]"
        style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
      />
    );
  }
  return (
    <div className="bg-[#F0F5FF] dark:bg-[#1e2a3a] rounded-2xl px-5 py-3.5">
      <p className="font-medium italic text-[#374151] dark:text-gray-300 m-0 leading-[1.7]" style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
        {value || "Excerpt goes here"}
      </p>
    </div>
  );
}

export function ReadTimeField({ mode, value, onChange, placeholder = "e.g. 5 min read" }: {
  mode: "write" | "read"; value: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  if (mode === "write") {
    return (
      <div className="flex items-center gap-2 border-b-2 border-secondary dark:border-[#2a4a7a] pb-1.5">
        <Clock size={16} className="text-primary flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none font-medium text-[#374151] dark:text-gray-300 w-full p-0 placeholder:text-gray-300 dark:placeholder:text-gray-600"
          style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)" }}
        />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <Clock size={14} className="text-primary" />
      <p className="font-medium text-[#374151] dark:text-gray-300 m-0" style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)" }}>
        {value || "Read time"}
      </p>
    </div>
  );
}
