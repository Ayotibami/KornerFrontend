"use client";
import React, { useState } from "react";
import { nunito } from "@/lib/font";
import { SECONDARY as secondaryColor } from "@/constants/theme";

// Jagged torn line running roughly through the middle of the button
const tornLine: [number, number][] = [
  [0, 50], [10, 41], [20, 55], [32, 44], [44, 58],
  [56, 45], [68, 57], [80, 42], [92, 53], [100, 46],
];

function topClip() {
  const reversed = [...tornLine]
    .reverse()
    .map(([x, y]) => `${x}% ${y}%`)
    .join(", ");
  return `polygon(0% 0%, 100% 0%, ${reversed})`;
}

function bottomClip() {
  const forward = tornLine.map(([x, y]) => `${x}% ${y}%`).join(", ");
  return `polygon(${forward}, 100% 100%, 0% 100%)`;
}

export default function Button({
  children,
  inverted = false,
  onClick,
}: {
  children: React.ReactNode;
  inverted?: boolean;
  onClick?: () => void;
}) {
  const [tearing, setTearing] = useState(false);

  const trigger = () => {
    if (tearing) return;
    setTearing(true);
    setTimeout(() => {
      setTearing(false);
      onClick?.();
    }, 950);
  };

  const bg = inverted ? "#112C4A" : "white";
  const fg = inverted ? "white" : "#112C4A";

  return (
    <>
      <style>{`
        @keyframes tear-top {
          0%   { transform: translateY(0)     rotate(0deg); }
          38%  { transform: translateY(-130%) rotate(-6deg); }
          68%  { transform: translateY(-130%) rotate(-6deg); }
          88%  { transform: translateY(4%)    rotate(1deg); }
          100% { transform: translateY(0)     rotate(0deg); }
        }
        @keyframes tear-bottom {
          0%   { transform: translateY(0)    rotate(0deg); }
          38%  { transform: translateY(130%) rotate(6deg); }
          68%  { transform: translateY(130%) rotate(6deg); }
          88%  { transform: translateY(-4%)  rotate(-1deg); }
          100% { transform: translateY(0)    rotate(0deg); }
        }
        @keyframes flash-in {
          0%        { opacity: 0; transform: scaleY(0.6); }
          25%, 65%  { opacity: 1; transform: scaleY(1); }
          100%      { opacity: 0; transform: scaleY(1); }
        }
      `}</style>

      <div
        onClick={trigger}
        style={{
          padding: 12,
          borderRadius: 12,
          cursor: "pointer",
          position: "relative",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {/* Flash color revealed when the tear opens */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: secondaryColor,
            opacity: 0,
            animation: tearing ? "flash-in 0.95s ease-in-out forwards" : "none",
          }}
        />

        {/* Top half of button - tears upward */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: bg,
            clipPath: topClip(),
            animation: tearing
              ? "tear-top 0.95s cubic-bezier(0.4, 0, 0.2, 1.4) forwards"
              : "none",
            zIndex: 1,
          }}
        />

        {/* Bottom half of button - tears downward */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: bg,
            clipPath: bottomClip(),
            animation: tearing
              ? "tear-bottom 0.95s cubic-bezier(0.4, 0, 0.2, 1.4) forwards"
              : "none",
            zIndex: 1,
          }}
        />

        {/* Text stays on top */}
        <p
          style={{
            color: fg,
            fontFamily: nunito.style.fontFamily,
            fontWeight: 800,
            position: "relative",
            zIndex: 2,
            margin: 0,
          }}
        >
          {children}
        </p>
      </div>
    </>
  );
}
