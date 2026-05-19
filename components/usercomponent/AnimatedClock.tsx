"use client";

import { Clock } from "lucide-react";

export default function AnimatedClock() {
  return (
    <>
      <style>{`
        @keyframes clock-tick {
          0%   { transform: rotate(0deg); }
          10%  { transform: rotate(15deg); }
          20%  { transform: rotate(-10deg); }
          30%  { transform: rotate(10deg); }
          40%  { transform: rotate(-5deg); }
          50%  { transform: rotate(5deg); }
          60%  { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <Clock
        size={14}
        color="white"
        style={{
          animation: "clock-tick 2s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
    </>
  );
}
