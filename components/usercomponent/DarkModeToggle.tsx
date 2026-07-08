"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { nunito } from "@/lib/font";
import { useStoryTheme } from "@/context/StoryThemeContext";

export default function DarkModeToggle() {
  const { dark, toggle } = useStoryTheme();
  const [visible, setVisible] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTemporarily = () => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2500);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 2500);
    window.addEventListener("scroll", showTemporarily);
    return () => {
      window.removeEventListener("scroll", showTemporarily);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleToggle = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    toggle();
    showTemporarily();
  };

  return (
    <>
      <style>{`
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .dm-icon-spin { animation: spin-once 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>

      <button
        onClick={handleToggle}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "none",
          cursor: "pointer",
          color: "white",
          background: dark
            ? "rgba(14, 34, 80, 0.55)"
            : "rgba(22, 90, 191, 0.09)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 12,
          padding: "10px 16px",
          boxShadow: dark
            ? "0 2px 16px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 12px rgba(0,0,0,0.08)",
          outline: dark
            ? "1px solid rgba(59, 130, 246, 0.3)"
            : "1px solid rgba(100, 160, 255, 0.35)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, outline 0.4s ease",
        }}
      >
        <span className={spinning ? "dm-icon-spin" : ""} style={{ display: "flex", alignItems: "center" }}>
          {dark
            ? <Sun size={14} strokeWidth={2.5} />
            : <Moon size={14} strokeWidth={2.5} />
          }
        </span>
        <span
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          {dark ? "Light" : "Dark"}
        </span>
      </button>
    </>
  );
}
