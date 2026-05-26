import { nunito } from "@/lib/font";
import type { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: nunito.style.fontFamily,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: "clamp(28px, 5vw, 48px)",
          width: "clamp(300px, 90vw, 460px)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}
