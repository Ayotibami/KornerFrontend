"use client";

import { useEffect, useState, useRef } from "react";

const cards = [
  {
    id: 1,
    bg: "#FFF9D6",
    rotate: -18,
    baseY: 80,
    delay: 0,
    svg: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
      >
        <rect x="8" y="20" width="48" height="34" rx="5" fill="#C97D3E" />
        <rect x="14" y="28" width="36" height="18" rx="3" fill="#B5601F" />
        <rect x="27" y="24" width="10" height="6" rx="2" fill="#8B4513" />
        <rect x="8" y="32" width="48" height="4" rx="1" fill="#A0522D" />
        <rect x="29" y="30" width="6" height="8" rx="2" fill="#6B3410" />
      </svg>
    ),
  },
  {
    id: 2,
    bg: "#FFD6D6",
    rotate: -8,
    baseY: 30,
    delay: 0.4,
    svg: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
      >
        <path
          d="M32 54s-22-14-22-28a12 12 0 0 1 22-6.8A12 12 0 0 1 54 26c0 14-22 28-22 28z"
          fill="#C0392B"
        />
        <path d="M32 54s-22-14-22-28a12 12 0 0 1 22-6.8" fill="#E74C3C" />
      </svg>
    ),
  },
  {
    id: 3,
    bg: "#D6E4FF",
    rotate: 0,
    baseY: 0,
    delay: 0.8,
    svg: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
      >
        <rect x="12" y="8" width="40" height="48" rx="4" fill="#1E3A5F" />
        <rect x="12" y="8" width="22" height="48" rx="4" fill="#2C4E7E" />
        <rect x="26" y="8" width="4" height="10" rx="2" fill="#FFD700" />
      </svg>
    ),
  },
  {
    id: 4,
    bg: "#D6FFE0",
    rotate: 8,
    baseY: 30,
    delay: 1.2,
    svg: (
      <svg
        viewBox="0 0 80 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="70"
      >
        <rect x="4" y="4" width="72" height="30" rx="4" fill="#4CAF50" />
        <rect x="4" y="8" width="72" height="32" rx="4" fill="#3A7A3A" />
        <rect x="4" y="14" width="72" height="32" rx="4" fill="#2D6A2D" />
        <ellipse cx="40" cy="30" rx="10" ry="7" fill="#3A7A3A" />
        <text
          x="36"
          y="34"
          fontSize="10"
          fill="#4CAF50"
          fontFamily="serif"
          fontWeight="bold"
        >
          $
        </text>
        <ellipse cx="16" cy="30" rx="5" ry="5" fill="#3A7A3A" opacity="0.4" />
        <ellipse cx="64" cy="30" rx="5" ry="5" fill="#3A7A3A" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 5,
    bg: "#D6F8FF",
    rotate: 18,
    baseY: 80,
    delay: 1.6,
    svg: (
      <svg
        viewBox="0 0 48 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="70"
        height="90"
      >
        <rect x="14" y="2" width="20" height="36" rx="10" fill="#7BAFC4" />
        <rect x="14" y="2" width="10" height="36" rx="10" fill="#93C5DA" />
        <rect x="18" y="8" width="2" height="6" rx="1" fill="#5A9AB5" />
        <rect x="18" y="18" width="2" height="6" rx="1" fill="#5A9AB5" />
        <rect x="18" y="28" width="2" height="4" rx="1" fill="#5A9AB5" />
        <path
          d="M8 28 Q8 52 24 52 Q40 52 40 28"
          stroke="#5A9AB5"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="21" y="52" width="6" height="12" rx="2" fill="#5A9AB5" />
        <rect x="14" y="62" width="20" height="4" rx="2" fill="#5A9AB5" />
      </svg>
    ),
  },
];

const CARD_WIDTH = 280;
const CARD_HEIGHT = 290;
const SPACING = 170;
const NATURAL_W = SPACING * 4 + CARD_WIDTH + 60;
const NATURAL_H = CARD_HEIGHT + 110;

export default function FloatingCards() {
  const [offsets, setOffsets] = useState(cards.map(() => 0));
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Float animation
  useEffect(() => {
    const ids = cards.map((card, i) => {
      const phaseOffset = card.delay * 1000;
      const id = setInterval(() => {
        const y = Math.sin((Date.now() + phaseOffset) / 1400) * 10;
        setOffsets((prev) => {
          const next = [...prev];
          next[i] = y;
          return next;
        });
      }, 16);
      return id;
    });
    return () => ids.forEach(clearInterval);
  }, []);

  // Watch container width → compute scale
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      setScale(Math.min(1, available / NATURAL_W));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    /*
      Outer wrapper:
      - width: 100% fills parent
      - paddingBottom reserves vertical space so content below sits correctly
      - position: relative gives the inner absolute div an anchor
      - overflow: visible ensures cards are NEVER clipped
      - NO fixed height (that's what was causing the clip)
    */
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        position: "relative",
        paddingBottom: NATURAL_H * scale,
        overflow: "visible",
      }}
    >
      {/* Inner layout — absolutely positioned, scaled from top-center */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: NATURAL_W,
          height: NATURAL_H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
          overflow: "visible",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            style={{
              position: "absolute",
              bottom: 0,
              left: `calc(50% + ${(i - 2) * SPACING - CARD_WIDTH / 2}px)`,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              background: card.bg,
              borderRadius: 24,
              boxShadow: "0 10px 36px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${card.rotate}deg) translateY(${-(card.baseY + offsets[i])}px)`,
              willChange: "transform",
              zIndex: i === 2 ? 5 : i < 2 ? i + 1 : 5 - i,
            }}
          >
            {card.svg}
          </div>
        ))}
      </div>
    </div>
  );
}
