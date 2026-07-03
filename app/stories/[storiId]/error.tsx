"use client";

import Link from "next/link";
import { RefreshCw, FileX } from "lucide-react";
import { nunito } from "@/lib/font";

export default function StoriError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        fontFamily: nunito.style.fontFamily,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(239,68,68,0.25)",
          marginBottom: 20,
        }}
      >
        <FileX size={26} color="white" />
      </div>

      <h1
        style={{
          fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
          fontWeight: 800,
          color: "#0f1e3d",
          margin: "0 0 10px",
        }}
      >
        Wahala dey o, but no panic 🏃💨
      </h1>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#64748b",
          lineHeight: 1.7,
          maxWidth: 320,
          margin: "0 0 28px",
        }}
      >
        We tried to load am but e comot before we reach. Try again —
        sometimes na just network misbehaving.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 22px",
            borderRadius: 12,
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 700,
            fontFamily: nunito.style.fontFamily,
            border: "none",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} />
          Try again
        </button>

        <Link
          href="/stories"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "11px 22px",
            borderRadius: 12,
            border: "2px solid #B4CFF6",
            color: "#165ABF",
            fontSize: "0.875rem",
            fontWeight: 700,
            fontFamily: nunito.style.fontFamily,
            textDecoration: "none",
          }}
        >
          See other stories
        </Link>
      </div>

    </main>
  );
}
