import { nunito } from "@/lib/font";
import React from "react";

export default function AuxillaryText({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#FEFB8A",
        borderTop: "10px solid #F0E010",
        borderRadius: 3,
        padding: "18px 22px",
        transform: "rotate(-2deg)",
        boxShadow: "4px 5px 16px rgba(0,0,0,0.14)",
        maxWidth: "min(260px, 90vw)",
      }}
    >
      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
          fontWeight: 700,
          fontStyle: "italic",
          color: "#2a1f00",
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        {children}
      </p>
    </div>
  );
}
