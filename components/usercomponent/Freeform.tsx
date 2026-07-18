"use client";

import { useEffect, useRef, useState } from "react";
import { nunito } from "@/lib/font";

const TEXT = { fontFamily: nunito.style.fontFamily };

const PILLS = [
  { text: "Relatable",     bg: "#D6E4FF", color: "#1e3a8a", size: "lg", mt: 0  },
  { text: "Funny",         bg: "#FFD6D6", color: "#9b1c1c", size: "xl", mt: 14 },
  { text: "Engaging",      bg: "#D6F8FF", color: "#0c4a6e", size: "sm", mt: 4  },
  { text: "Insightful",    bg: "#EDD6FF", color: "#581c87", size: "sm", mt: 20 },
  { text: "Helpful",       bg: "#D6FFE0", color: "#14532d", size: "md", mt: 0  },
  { text: "Authentic",     bg: "#FFF9D6", color: "#7c6000", size: "sm", mt: 10 },
  { text: "Unfiltered",    bg: "#FFD6D6", color: "#9b1c1c", size: "md", mt: 22 },
  { text: "Real",          bg: "#D6E4FF", color: "#1e3a8a", size: "xl", mt: 2  },
  { text: "Friendly",      bg: "#D6F8FF", color: "#0c4a6e", size: "sm", mt: 16 },
  { text: "Trendy",        bg: "#EDD6FF", color: "#581c87", size: "md", mt: 6  },
  { text: "Vibey",         bg: "#D6FFE0", color: "#14532d", size: "lg", mt: 24 },
  { text: "Sharp",         bg: "#FFF9D6", color: "#7c6000", size: "md", mt: 0  },
  { text: "Student-First", bg: "#FFD6D6", color: "#9b1c1c", size: "sm", mt: 12 },
  { text: "Kappish",       bg: "#D6E4FF", color: "#1e3a8a", size: "lg", mt: 18 },
  { text: "Entertaining",  bg: "#D6FFE0", color: "#14532d", size: "sm", mt: 4  },
  { text: "Chill",         bg: "#FFF9D6", color: "#7c6000", size: "xl", mt: 10 },
];

const SIZES = {
  sm: { fontSize: "0.75rem",   py: 7,  px: 12 },
  md: { fontSize: "0.875rem",  py: 8,  px: 14 },
  lg: { fontSize: "0.9375rem", py: 9,  px: 16 },
  xl: { fontSize: "1.0625rem", py: 10, px: 18 },
};

export default function Freeform() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else setVisible(false);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes pill-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      <div
        ref={ref}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 10px",
          alignContent: "flex-start",
          padding: "8px 0",
        }}
      >
        {PILLS.map((pill, i) => {
          const { fontSize, py, px } = SIZES[pill.size as keyof typeof SIZES];
          const appearDelay = `${(i * 0.055).toFixed(2)}s`;
          const floatDelay  = `${(i * 0.055 + 0.5 + (i % 5) * 0.3).toFixed(2)}s`;
          const floatDur    = `${(2.2 + (i % 4) * 0.35).toFixed(2)}s`;

          return (
            // Outer wrapper: handles pop-in via opacity + scale transition
            <div
              key={pill.text}
              style={{
                marginTop: pill.mt,
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.5)",
                transition: visible
                  ? `opacity 0.4s ease ${appearDelay}, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${appearDelay}`
                  : "opacity 0.15s ease, transform 0.15s ease",
              }}
            >
              {/* Inner pill: float animation lives here so transforms never conflict */}
              <div
                style={{
                  backgroundColor: pill.bg,
                  color: pill.color,
                  paddingTop: py,
                  paddingBottom: py,
                  paddingLeft: px,
                  paddingRight: px,
                  borderRadius: 100,
                  fontSize,
                  fontWeight: 700,
                  ...TEXT,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  animation: visible
                    ? `pill-bob ${floatDur} ease-in-out ${floatDelay} infinite`
                    : "none",
                }}
              >
                {pill.text}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
