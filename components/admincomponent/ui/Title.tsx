import { nunito } from "@/lib/font";

export default function Title({
  mode,
  placeholder,
  title,
  setTitle,
}: {
  mode?: string;
  placeholder?: string;
  title: string;
  setTitle?: (value: string) => void;
}) {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle?.(e.target.value)}
        placeholder={placeholder ?? "Story title…"}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 800,
          color: "#0f1e3d",
          background: "none",
          border: "none",
          borderBottom: "2px solid #B4CFF6",
          outline: "none",
          width: "100%",
          padding: "8px 0",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <h1
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
        fontWeight: 800,
        color: "#0f1e3d",
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {title || "Title goes here"}
    </h1>
  );
}
