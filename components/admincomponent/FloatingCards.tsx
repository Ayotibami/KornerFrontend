"use client";
// "use client" needed for useState, useEffect, useRef, and ResizeObserver (all browser APIs).

import { useEffect, useState, useRef } from "react";

// Each card's fixed visual properties.
// rotate: the permanent tilt angle (negative = left lean, positive = right lean).
// baseY: how many px above the baseline the card rests — creates the fan/spread effect.
// delay: phase offset in seconds so each card bobs at a slightly different time.
const cards = [
  { id: 1, bg: "#FFF9D6", rotate: -18, baseY: 80,  delay: 0,   svg: ( <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90"><rect x="8" y="20" width="48" height="34" rx="5" fill="#C97D3E" /><rect x="14" y="28" width="36" height="18" rx="3" fill="#B5601F" /><rect x="27" y="24" width="10" height="6" rx="2" fill="#8B4513" /><rect x="8" y="32" width="48" height="4" rx="1" fill="#A0522D" /><rect x="29" y="30" width="6" height="8" rx="2" fill="#6B3410" /></svg> ) },
  { id: 2, bg: "#FFD6D6", rotate: -8,  baseY: 30,  delay: 0.4, svg: ( <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90"><path d="M32 54s-22-14-22-28a12 12 0 0 1 22-6.8A12 12 0 0 1 54 26c0 14-22 28-22 28z" fill="#C0392B" /><path d="M32 54s-22-14-22-28a12 12 0 0 1 22-6.8" fill="#E74C3C" /></svg> ) },
  { id: 3, bg: "#D6E4FF", rotate: 0,   baseY: 0,   delay: 0.8, svg: ( <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90"><rect x="12" y="8" width="40" height="48" rx="4" fill="#1E3A5F" /><rect x="12" y="8" width="22" height="48" rx="4" fill="#2C4E7E" /><rect x="26" y="8" width="4" height="10" rx="2" fill="#FFD700" /></svg> ) },
  { id: 4, bg: "#D6FFE0", rotate: 8,   baseY: 30,  delay: 1.2, svg: ( <svg viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="70"><rect x="4" y="4" width="72" height="30" rx="4" fill="#4CAF50" /><rect x="4" y="8" width="72" height="32" rx="4" fill="#3A7A3A" /><rect x="4" y="14" width="72" height="32" rx="4" fill="#2D6A2D" /><ellipse cx="40" cy="30" rx="10" ry="7" fill="#3A7A3A" /><text x="36" y="34" fontSize="10" fill="#4CAF50" fontFamily="serif" fontWeight="bold">$</text><ellipse cx="16" cy="30" rx="5" ry="5" fill="#3A7A3A" opacity="0.4" /><ellipse cx="64" cy="30" rx="5" ry="5" fill="#3A7A3A" opacity="0.4" /></svg> ) },
  { id: 5, bg: "#D6F8FF", rotate: 18,  baseY: 80,  delay: 1.6, svg: ( <svg viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="90"><rect x="14" y="2" width="20" height="36" rx="10" fill="#7BAFC4" /><rect x="14" y="2" width="10" height="36" rx="10" fill="#93C5DA" /><rect x="18" y="8" width="2" height="6" rx="1" fill="#5A9AB5" /><rect x="18" y="18" width="2" height="6" rx="1" fill="#5A9AB5" /><rect x="18" y="28" width="2" height="4" rx="1" fill="#5A9AB5" /><path d="M8 28 Q8 52 24 52 Q40 52 40 28" stroke="#5A9AB5" strokeWidth="3" fill="none" strokeLinecap="round" /><rect x="21" y="52" width="6" height="12" rx="2" fill="#5A9AB5" /><rect x="14" y="62" width="20" height="4" rx="2" fill="#5A9AB5" /></svg> ) },
];

// These constants define the natural (unscaled) dimensions of the card fan layout.
// CARD_WIDTH / CARD_HEIGHT: size of each card in pixels at full scale.
// SPACING: horizontal gap between card centers.
// NATURAL_W: total width the fan occupies at scale 1 (used to compute scale ratio).
// NATURAL_H: total height including the tallest card's baseY offset.
const CARD_WIDTH  = 280;
const CARD_HEIGHT = 290;
const SPACING     = 170;
const NATURAL_W   = SPACING * 4 + CARD_WIDTH + 60;
const NATURAL_H   = CARD_HEIGHT + 110;

export default function FloatingCards() {
  // offsets holds the current vertical float offset for each card (in px).
  // Each card gets its own value so they bob independently.
  const [offsets, setOffsets] = useState(cards.map(() => 0));

  // scale is the ratio of available container width to NATURAL_W.
  // When the container is narrower than the natural layout, scale < 1
  // and the entire fan shrinks proportionally to fit.
  const [scale, setScale] = useState(0);

  // wrapperRef attaches to the outer div so ResizeObserver can watch its width.
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── FLOAT ANIMATION ──────────────────────────────────────────────────────────
  // Each card runs its own setInterval at 16ms (~60fps).
  // Math.sin() produces a smooth wave between -1 and +1.
  //   Date.now() advances the wave over time.
  //   / 1400 slows the wave down to a gentle bob cycle (~1.4 seconds per cycle).
  //   * 10 scales the output to ±10px of vertical movement.
  // phaseOffset (card.delay * 1000ms) shifts each card to a different point
  // in the sine wave, so they don't all bob in unison — they feel independent.
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
    return () => ids.forEach(clearInterval); // cleanup all intervals on unmount
  }, []);

  // ── RESPONSIVE SCALING ───────────────────────────────────────────────────────
  // ResizeObserver watches the wrapper div's width continuously.
  // When the width changes, we compute scale = available / NATURAL_W.
  // Math.min(1, ...) clamps it so we never scale UP beyond 1 — only shrink.
  // This makes the whole fan layout shrink proportionally on smaller screens
  // instead of overflowing or wrapping.
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
    // Outer wrapper: takes full parent width, uses paddingBottom to reserve
    // vertical space equal to the scaled height of the fan.
    // Without paddingBottom, the absolutely-positioned inner div would collapse
    // the wrapper to zero height and overlap content below it.
    // overflow: visible is critical — the cards extend outside this div
    // and must not be clipped.
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        position: "relative",
        paddingBottom: NATURAL_H * scale, // reserves the right amount of vertical space
        overflow: "visible",
      }}
    >
      {/* Inner layout div: absolutely positioned, centered horizontally.
          transformOrigin: "top center" means scaling happens from the top-center,
          so cards shrink downward rather than in all directions equally.
          translateX(-50%) re-centers after left: 50% positions the left edge at center. */}
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
          // Each card is absolutely positioned along the bottom of the inner div.
          // left: calc(50% + (i - 2) * SPACING - CARD_WIDTH / 2)
          //   → (i - 2) centers the 5 cards around index 2 (the middle card)
          //   → subtracting CARD_WIDTH / 2 aligns by the card's left edge, not center
          // transform: rotate + translateY applies the tilt and the float offset.
          //   baseY is the card's resting height above the baseline.
          //   offsets[i] adds the live sine-wave bob on top of baseY.
          // willChange: "transform" is a browser hint to use GPU compositing
          //   for this element — makes the animation smoother.
          // zIndex: center card (i===2) is on top, outer cards tuck behind.
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
