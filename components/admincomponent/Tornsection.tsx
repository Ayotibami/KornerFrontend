"use client";

import React from "react";

/**
 * TornSection
 * Dark navy wrapper with ragged torn-paper edges top and bottom.
 * Pure SVG — scales perfectly at any width.
 *
 * Usage:
 *   <TornSection>
 *     <p style={{ color: "white", padding: "0 40px" }}>Your content</p>
 *   </TornSection>
 */

const NAVY = "#0f1e3d";

/* Deterministic pseudo-random 0..1 */
function rng(i: number, seed: number) {
  const v = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * Build the torn-edge SVG polygon.
 * The polygon IS the dark navy shape:
 *   - top edge: ragged teeth pointing INTO the navy (downward spikes from y=0)
 *   - bottom edge: ragged teeth pointing INTO the navy (upward spikes from y=H)
 * We use a CLIP approach instead:
 *   - For top: navy rect that is clipped so its top is torn
 *   - We draw it as a polygon whose TOP side is the torn line,
 *     left/right/bottom are straight
 */
function buildTornPolygon(
  vw: number,
  vh: number,
  edge: "top" | "bottom",
  seed: number,
  maxTear: number,
): string {
  const steps = 120;
  const pts: string[] = [];

  if (edge === "top") {
    // Start bottom-left, go bottom-right, then trace torn top right→left
    pts.push(`0,${vh}`);
    pts.push(`${vw},${vh}`);
    // right side of torn top — right to left
    for (let i = steps; i >= 0; i--) {
      const x = (i / steps) * vw;
      // spiky tear: some points deep (20-60px), some shallow (0-10px)
      const spike = rng(i, seed);
      const depth =
        spike > 0.85
          ? maxTear * 0.6 + rng(i + 300, seed) * maxTear * 0.4 // tall spike
          : rng(i + 200, seed) * maxTear * 0.25; // normal roughness
      pts.push(`${x},${depth}`);
    }
  } else {
    // bottom torn edge
    pts.push(`0,0`);
    pts.push(`${vw},0`);
    // trace torn bottom right→left
    for (let i = steps; i >= 0; i--) {
      const x = (i / steps) * vw;
      const spike = rng(i, seed);
      const depth =
        spike > 0.85
          ? maxTear * 0.6 + rng(i + 300, seed) * maxTear * 0.4
          : rng(i + 200, seed) * maxTear * 0.25;
      pts.push(`${x},${vh - depth}`);
    }
  }

  return pts.join(" ");
}

/**
 * Build just the torn line as a polyline (for the white stroke).
 */
function buildTornLine(
  vw: number,
  edge: "top" | "bottom",
  seed: number,
  maxTear: number,
  vh: number,
): string {
  const steps = 120;
  const pts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * vw;
    const spike = rng(i, seed);
    const depth =
      spike > 0.85
        ? maxTear * 0.6 + rng(i + 300, seed) * maxTear * 0.4
        : rng(i + 200, seed) * maxTear * 0.25;
    const y = edge === "top" ? depth : vh - depth;
    pts.push(`${x},${y}`);
  }

  return pts.join(" ");
}

interface TornSectionProps {
  children: React.ReactNode;
  /** Background colour of the torn section. Default: dark navy */
  color?: string;
  /** How tall the SVG tear strip is in px. Default: 60 */
  tearStripHeight?: number;
  /** Max tear depth in px. Default: 50 */
  maxTear?: number;
  /** Extra padding inside the content area */
  contentPadding?: string;
  style?: React.CSSProperties;
}

export default function TornSection({
  children,
  color = NAVY,
  tearStripHeight = 60,
  maxTear = 50,
  contentPadding = "40px",
  style,
}: TornSectionProps) {
  const vw = 1440; // viewBox width — preserveAspectRatio="none" handles scaling
  const vh = tearStripHeight;

  const topPolygon = buildTornPolygon(vw, vh, "top", 1, maxTear);
  const topLine = buildTornLine(vw, "top", 1, maxTear, vh);
  const botPolygon = buildTornPolygon(vw, vh, "bottom", 7, maxTear);
  const botLine = buildTornLine(vw, "bottom", 7, maxTear, vh);

  const svgProps = {
    viewBox: `0 0 ${vw} ${vh}`,
    preserveAspectRatio: "none" as const,
    width: "100%",
    height: tearStripHeight,
    style: { display: "block" as const },
  };

  return (
    <div style={{ position: "relative", width: "100%", ...style }}>
      {/* TOP tear strip */}
      <svg {...svgProps}>
        <polygon points={topPolygon} fill={color} />
        <polyline
          points={topLine}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>

      {/* Main content body */}
      <div
        style={{
          backgroundColor: color,
          padding: contentPadding,
          marginTop: -1, // close any sub-pixel gap
          marginBottom: -1,
        }}
      >
        {children}
      </div>

      {/* BOTTOM tear strip */}
      <svg {...svgProps}>
        <polygon points={botPolygon} fill={color} />
        <polyline
          points={botLine}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
