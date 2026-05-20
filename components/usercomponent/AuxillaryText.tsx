import { nunito } from "@/lib/font";
import React from "react";

// Small pill-shaped text block used for cheeky side notes on the page.
// Accepts any text as children — just wraps it in a styled rounded container.
// Example usage: <AuxillaryText>Abeg it is spelt Korner o</AuxillaryText>
export default function AuxillaryText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        borderRadius: 36, // fully rounded pill shape
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
