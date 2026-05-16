import { nunito } from "@/lib/font";
import React from "react";

export default function AuxillaryText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        borderRadius: 36,
        margin: "30px 0",
        padding: "16px 32px",
      }}
    >
      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#0f1e3d",
          textAlign: "center",
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}
