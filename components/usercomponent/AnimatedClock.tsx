"use client";
// "use client" needed because <style> injection with keyframes requires the browser.
// This component is intentionally tiny — it only exists to keep the animation
// logic isolated from StoriCover, which is already complex enough.

import { Clock } from "lucide-react";

export default function AnimatedClock() {
  return (
    <>
      {/* clock-tick keyframe: wobbles left and right like a real clock pendulum.
          The percentages define the angle at each point in the 2-second loop:
            0%  → upright
            10% → 15deg right (big first swing)
            20% → -10deg left
            30% → 10deg right (slightly smaller)
            40% → -5deg left (settling down)
            50% → 5deg right
            60% → back to upright
            100%→ stays upright until the next loop starts */}
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

      {/* The clock icon from lucide-react.
          animation: runs clock-tick every 2 seconds, smooth ease-in-out, loops forever.
          flexShrink: 0 prevents the icon from squishing when the row around it is tight. */}
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
