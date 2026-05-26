import { nunito } from "@/lib/font";
import { primaryColor } from "@/app/constants/color";
import { Clock } from "lucide-react";

export default function ReadTime({
  mode,
  placeholder,
  readTime,
  setReadTime,
}: {
  mode?: string;
  placeholder?: string;
  readTime: string;
  setReadTime?: (value: string) => void;
}) {
  if (mode === "write") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "2px solid #B4CFF6",
          paddingBottom: 6,
        }}
      >
        <Clock size={16} color={primaryColor} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={readTime}
          onChange={(e) => setReadTime?.(e.target.value)}
          placeholder={placeholder ?? "e.g. 5 min read"}
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
            fontWeight: 500,
            color: "#374151",
            background: "none",
            border: "none",
            outline: "none",
            width: "100%",
            padding: 0,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color={primaryColor} />
      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
          fontWeight: 500,
          color: "#374151",
          margin: 0,
        }}
      >
        {readTime || "Read time"}
      </p>
    </div>
  );
}
