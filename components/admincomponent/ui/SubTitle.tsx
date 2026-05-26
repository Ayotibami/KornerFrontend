import { nunito } from "@/lib/font";

export default function SubsideTitle({
  mode,
  placeholder,
  subTitle,
  setSubTitle,
}: {
  mode?: string;
  placeholder?: string;
  subTitle: string;
  setSubTitle?: (value: string) => void;
}) {
  if (mode === "write") {
    return (
      <input
        type="text"
        value={subTitle}
        onChange={(e) => setSubTitle?.(e.target.value)}
        placeholder={placeholder ?? "Subtitle…"}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
          fontWeight: 500,
          color: "#374151",
          background: "none",
          border: "none",
          borderBottom: "2px solid #B4CFF6",
          outline: "none",
          width: "100%",
          padding: "6px 0",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <p
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
        fontWeight: 500,
        color: "#374151",
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {subTitle || "Subtitle goes here"}
    </p>
  );
}
