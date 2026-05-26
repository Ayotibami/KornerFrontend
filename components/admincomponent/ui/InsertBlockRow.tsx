"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";

const BLOCK_TYPES = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "quote", label: "Quote" },
  { type: "image", label: "Image" },
];

export default function InsertBlockRow({
  onInsert,
}: {
  onInsert: (type: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          padding: "10px 0",
        }}
      >
        {BLOCK_TYPES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => {
              onInsert(type);
              setOpen(false);
            }}
            style={{
              fontFamily: nunito.style.fontFamily,
              backgroundColor: secondaryColor,
              color: primaryColor,
              border: "none",
              borderRadius: 30,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + {label}
          </button>
        ))}
        <button
          onClick={() => setOpen(false)}
          style={{
            fontFamily: nunito.style.fontFamily,
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#9CA3AF",
            fontSize: 13,
            fontWeight: 600,
            padding: "8px",
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setOpen(true)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
        cursor: "pointer",
        opacity: 0.35,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.35")}
    >
      <div style={{ flex: 1, height: 1, backgroundColor: primaryColor }} />
      <Plus size={16} color={primaryColor} />
      <div style={{ flex: 1, height: 1, backgroundColor: primaryColor }} />
    </div>
  );
}
