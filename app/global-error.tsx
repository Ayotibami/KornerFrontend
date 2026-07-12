"use client";

import { useState } from "react";

const IMAGES = ["/images/confused.png", "/images/facepalm.png"];

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [src] = useState(() => IMAGES[Math.floor(Math.random() * IMAGES.length)]);

  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif", backgroundColor: "#f8f9fb" }}>
        <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#f8f9fb" }}>

          <div style={{ padding: "20px 24px 0" }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 700, color: "#0f1e3d", textDecoration: "none" }}>
              Korner
            </a>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 320 }}>

              <div style={{ position: "relative", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", width: "85%", height: "85%", borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)", transform: "scale(1.5)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Kappy confused"
                  style={{ position: "relative", zIndex: 10, width: "min(240px, 70vw)", maxHeight: "45vh", objectFit: "contain" }}
                />
              </div>

              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 32, marginTop: 0 }}>
                Omo small wahalla dey but no worri na my fault
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
                <button
                  onClick={reset}
                  style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 24px", borderRadius: 12, backgroundColor: "#0f1e3d", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Try again
                </button>
                <a
                  href="/"
                  style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 24px", borderRadius: 12, border: "1px solid #e5e7eb", backgroundColor: "white", color: "#6b7280", fontSize: 14, fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}
                >
                  Go home
                </a>
              </div>

            </div>
          </div>

        </main>
      </body>
    </html>
  );
}
