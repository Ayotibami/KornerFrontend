"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { nunito } from "@/lib/font";

export default function GoBackButton({ href }: { href: string }) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTemporarily = () => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2500);
  };

  useEffect(() => {
    // Auto-hide after initial load
    timerRef.current = setTimeout(() => setVisible(false), 2500);
    window.addEventListener("scroll", showTemporarily);
    return () => {
      window.removeEventListener("scroll", showTemporarily);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Link
      href={href}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        color: "#0f1e3d",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: 12,
        padding: "10px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
    >
      <FaArrowLeft size={14} />
      <span
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "0.875rem",
          fontWeight: 700,
        }}
      >
        Go back
      </span>
    </Link>
  );
}
