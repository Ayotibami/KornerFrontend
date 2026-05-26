import { nunito } from "@/lib/font";

export default function Excerpt({
  mode,
  placeholder,
  excerpt,
  setExcerpt,
}: {
  mode?: string;
  placeholder?: string;
  excerpt: string;
  setExcerpt?: (value: string) => void;
}) {
  if (mode === "write") {
    return (
      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt?.(e.target.value)}
        placeholder={placeholder ?? "Short teaser — what is this story about?"}
        rows={3}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          fontWeight: 500,
          fontStyle: "italic",
          color: "#374151",
          background: "none",
          border: "none",
          borderBottom: "2px solid #B4CFF6",
          outline: "none",
          width: "100%",
          padding: "6px 0",
          boxSizing: "border-box",
          resize: "none",
          lineHeight: 1.7,
        }}
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F0F5FF",
        borderRadius: 16,
        padding: "14px 20px",
      }}
    >
      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          fontWeight: 500,
          fontStyle: "italic",
          color: "#374151",
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        {excerpt || "Excerpt goes here"}
      </p>
    </div>
  );
}
