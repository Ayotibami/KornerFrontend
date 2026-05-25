"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlobWave {
  amp: number;
  freq: number;
  phase: number;
  speed: number;
}

interface Word {
  text: string;
  size: number;
  color: string;
  // placed at runtime
  x: number;
  y: number;
  ox: number;
  oy: number;
  tw: number;
  th: number;
  phase: number;
  speed: number;
  amp: number;
  wangle: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BACKGROUND = "#0f1e3d";
const BASE_R = 265;
const FONT_FAMILY = "'Nunito', sans-serif";

const BLOB_WAVES: BlobWave[] = [
  { amp: 22, freq: 2, phase: 0.0,  speed: 0.0006 },
  { amp: 16, freq: 3, phase: 1.2,  speed: 0.0009 },
  { amp: 10, freq: 4, phase: 2.5,  speed: 0.0007 },
  { amp: 6,  freq: 5, phase: 0.8,  speed: 0.0005 },
];

const WORDS_DATA: Pick<Word, "text" | "size" | "color">[] = [
  { text: "Relatable", size: 20, color: "hsl(46,  100%, 70%)" },
  { text: "Funny", size: 25, color: "hsl(16,  100%, 67%)" },
  { text: "Engaging", size: 18, color: "hsl(172, 88%,  58%)" },
  { text: "Insightful", size: 17, color: "hsl(268, 88%,  78%)" },
  { text: "Helpful", size: 22, color: "hsl(152, 88%,  60%)" },
  { text: "Authentic", size: 18, color: "hsl(36,  100%, 66%)" },
  { text: "Unfiltered", size: 19, color: "hsl(338, 92%,  70%)" },
  { text: "Real", size: 29, color: "hsl(0,   0%,   95%)" },
  { text: "Friendly", size: 18, color: "hsl(193, 92%,  65%)" },
  { text: "Trendy", size: 20, color: "hsl(308, 88%,  72%)" },
  { text: "Vibey", size: 23, color: "hsl(252, 88%,  78%)" },
  { text: "Sharp", size: 20, color: "hsl(128, 78%,  60%)" },
  { text: "Student-First", size: 16, color: "hsl(352, 92%,  70%)" },
  { text: "Kappish", size: 23, color: "hsl(52,  100%, 72%)" },
  { text: "Entertaining", size: 17, color: "hsl(206, 88%,  72%)" },
  { text: "Chill", size: 25, color: "hsl(166, 82%,  58%)" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function blobRadius(angle: number, t: number): number {
  let r = BASE_R;
  for (const w of BLOB_WAVES) {
    r += w.amp * Math.sin(w.freq * angle + w.phase + t * w.speed * 1000);
  }
  return r;
}

function drawBlobPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
): void {
  const steps = 240;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = blobRadius(angle, t);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function isInsideBlob(
  x: number,
  y: number,
  hw: number,
  hh: number,
  cx: number,
  cy: number,
  t: number,
  margin = 22,
): boolean {
  const corners: [number, number][] = [
    [x - hw, y - hh],
    [x + hw, y - hh],
    [x - hw, y + hh],
    [x + hw, y + hh],
    [x, y - hh],
    [x, y + hh],
    [x - hw, y],
    [x + hw, y],
    [x, y],
  ];
  for (const [px, py] of corners) {
    const dx = px - cx;
    const dy = py - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > blobRadius(angle, t) - margin) return false;
  }
  return true;
}

function placeWords(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
): Word[] {
  const words: Word[] = WORDS_DATA.map((w) => ({
    ...w,
    x: 0,
    y: 0,
    ox: 0,
    oy: 0,
    tw: 0,
    th: 0,
    phase: 0,
    speed: 0,
    amp: 0,
    wangle: 0,
  }));

  const placed: Word[] = [];

  for (const w of words) {
    ctx.font = `800 ${w.size}px ${FONT_FAMILY}`;
    const tw = ctx.measureText(w.text).width;
    const th = w.size * 1.3;
    let found = false;

    for (let a = 0; a < 2000; a++) {
      const angle = Math.random() * Math.PI * 2;
      const maxR = blobRadius(angle, t) - 55;
      const d = Math.random() * Math.max(maxR, 0);
      const px = cx + Math.cos(angle) * d;
      const py = cy + Math.sin(angle) * d;

      if (!isInsideBlob(px, py, tw / 2 + 8, th / 2 + 8, cx, cy, t)) continue;

      let overlaps = false;
      for (const p of placed) {
        if (
          Math.abs(px - p.x) < tw / 2 + p.tw / 2 + 28 &&
          Math.abs(py - p.y) < th / 2 + p.th / 2 + 22
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        w.x = px;
        w.y = py;
        w.ox = px;
        w.oy = py;
        w.tw = tw;
        w.th = th;
        w.phase = Math.random() * Math.PI * 2;
        w.speed = 0.3 + Math.random() * 0.5;
        w.amp = 5 + Math.random() * 11;
        w.wangle = (Math.random() - 0.5) * 0.07;
        placed.push(w);
        found = true;
        break;
      }
    }

    if (!found) {
      w.tw = ctx.measureText(w.text).width;
      w.th = w.size * 1.3;
      w.x = cx + (Math.random() - 0.5) * 80;
      w.y = cy + (Math.random() - 0.5) * 80;
      w.ox = w.x;
      w.oy = w.y;
      w.phase = Math.random() * Math.PI * 2;
      w.speed = 0.4;
      w.amp = 7;
      w.wangle = 0;
      placed.push(w);
    }
  }

  return placed;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NATURAL_W = 620;
const NATURAL_H = 600;

export default function Freeform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / NATURAL_W));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;

    let animationId: number;
    let words: Word[] = [];
    let t = 0;

    function render() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.save();

      // draw blob fill + clip
      drawBlobPath(ctx!, CX, CY, t);
      ctx!.fillStyle = BACKGROUND;
      ctx!.fill();
      drawBlobPath(ctx!, CX, CY, t);
      ctx!.clip();

      t += 0.011;

      for (const w of words) {
        const nx = w.ox + Math.cos(w.phase + t * w.speed) * w.amp;
        const ny =
          w.oy + Math.sin(w.phase * 1.3 + t * w.speed * 0.8) * w.amp * 0.7;
        const rot = w.wangle + Math.sin(w.phase * 0.7 + t * 0.5) * 0.035;

        ctx!.save();
        ctx!.translate(nx, ny);
        ctx!.rotate(rot);
        ctx!.font = `800 ${w.size}px ${FONT_FAMILY}`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.shadowBlur = 0;
        ctx!.shadowColor = "transparent";
        ctx!.fillStyle = w.color;
        ctx!.fillText(w.text, 0, 0);
        ctx!.restore();
      }

      ctx!.restore();
      animationId = requestAnimationFrame(render);
    }

    // wait for Nunito to be ready before placing + drawing
    document.fonts.ready.then(() => {
      document.fonts.load(`800 20px ${FONT_FAMILY}`).then(() => {
        words = placeWords(ctx!, CX, CY, 0);
        render();
      });
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        position: "relative",
        paddingBottom: NATURAL_H * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={NATURAL_W}
          height={NATURAL_H}
          aria-label="Animated word cloud showing content personality traits"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
