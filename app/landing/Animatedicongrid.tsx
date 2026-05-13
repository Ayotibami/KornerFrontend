"use client";

/* ─────────────────────────────────────────
   AnimatedIconGrid.tsx
   4 dark-blue tiles, flat SVG icons,
   same drawing style as FloatingCards
───────────────────────────────────────── */

const KEYFRAMES = `
  /* chat bubbles */
  @keyframes b1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-3px,-4px) scale(1.07)} }
  @keyframes b2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3px, 4px) scale(1.07)} }
  @keyframes dot { 0%,80%,100%{opacity:.3} 40%{opacity:1} }

  /* education */
  @keyframes bk1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes bk2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes bk3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes capBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes tassel { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(18deg)} }

  /* couple */
  @keyframes p1 { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(2deg)} }
  @keyframes p2 { 0%,100%{transform:rotate(4deg)} 50%{transform:rotate(-2deg)} }
  @keyframes hFloat { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-28px);opacity:0} }
  @keyframes hPop  { 0%,100%{transform:scale(.8)} 50%{transform:scale(1.2)} }

  /* money bag */
  @keyframes bagWobble { 0%,100%{transform:rotate(0deg) scale(1)} 25%{transform:rotate(-4deg) scale(1.04)} 75%{transform:rotate(3deg) scale(1.04)} }
  @keyframes coinArc1  { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 80%{transform:translate(28px,-32px) rotate(200deg);opacity:.8} 100%{transform:translate(30px,-10px) rotate(220deg);opacity:0} }
  @keyframes coinArc2  { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 80%{transform:translate(-22px,-28px) rotate(-180deg);opacity:.8} 100%{transform:translate(-24px,-8px) rotate(-200deg);opacity:0} }
  @keyframes coinArc3  { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 80%{transform:translate(14px,-40px) rotate(160deg);opacity:.8} 100%{transform:translate(15px,-18px) rotate(180deg);opacity:0} }
  @keyframes dollarPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
`;

/* ── Chat Bubbles ── */
function ChatIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 110 90" fill="none">
      {/* back bubble – purple */}
      <g
        style={{
          animation: "b1 2.4s ease-in-out infinite",
          transformOrigin: "35px 30px",
        }}
      >
        <rect x="4" y="4" width="62" height="46" rx="14" fill="#7C5CBF" />
        <polygon points="16,50 8,64 28,50" fill="#7C5CBF" />
        {[18, 33, 48].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy="28"
            r="5"
            fill="rgba(255,255,255,.55)"
            style={{ animation: `dot 1.4s ${i * 0.22}s ease-in-out infinite` }}
          />
        ))}
      </g>
      {/* front bubble – mint */}
      <g
        style={{
          animation: "b2 2.4s 0.3s ease-in-out infinite",
          transformOrigin: "74px 58px",
        }}
      >
        <rect x="42" y="34" width="62" height="44" rx="14" fill="#5ECFA8" />
        <polygon points="92,78 100,90 78,78" fill="#5ECFA8" />
        {[56, 72, 88].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy="57"
            r="5"
            fill="rgba(255,255,255,.6)"
            style={{
              animation: `dot 1.4s ${0.44 + i * 0.22}s ease-in-out infinite`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Graduation / Books ── */
function EduIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 110 100" fill="none">
      {/* book 3 – bottom red */}
      <g style={{ animation: "bk3 2s 0.3s ease-in-out infinite" }}>
        <rect x="11" y="78" width="88" height="16" rx="4" fill="#E05C5C" />
        <rect
          x="11"
          y="78"
          width="8"
          height="16"
          rx="3"
          fill="rgba(0,0,0,.15)"
        />
      </g>
      {/* book 2 – purple */}
      <g style={{ animation: "bk2 2s 0.15s ease-in-out infinite" }}>
        <rect x="15" y="62" width="80" height="16" rx="4" fill="#7C5CBF" />
        <rect
          x="15"
          y="62"
          width="8"
          height="16"
          rx="3"
          fill="rgba(0,0,0,.15)"
        />
      </g>
      {/* book 1 – blue */}
      <g style={{ animation: "bk1 2s 0s ease-in-out infinite" }}>
        <rect x="19" y="46" width="72" height="16" rx="4" fill="#3B6BE0" />
        <rect
          x="19"
          y="46"
          width="8"
          height="16"
          rx="3"
          fill="rgba(0,0,0,.15)"
        />
      </g>
      {/* graduation cap */}
      <g style={{ animation: "capBob 2s ease-in-out infinite" }}>
        <polygon points="55,4 98,20 55,34 12,20" fill="#1A2744" />
        <polygon points="55,10 88,20 55,30 22,20" fill="#2C3E6B" />
        {/* tassel pole */}
        <rect x="80" y="20" width="6" height="18" rx="3" fill="#1A2744" />
        {/* tassel */}
        <g
          style={{
            animation: "tassel 2s ease-in-out infinite",
            transformOrigin: "83px 38px",
          }}
        >
          <circle cx="83" cy="38" r="5" fill="#FFD97D" />
          <rect x="81" y="38" width="4" height="10" rx="2" fill="#FFD97D" />
        </g>
      </g>
    </svg>
  );
}

/* ── Couple ── */
function CoupleIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 120 100" fill="none">
      {/* person left – teal */}
      <g
        style={{
          animation: "p1 3s ease-in-out infinite",
          transformOrigin: "36px 90px",
        }}
      >
        <circle cx="36" cy="22" r="14" fill="#4ECDC4" />
        {/* face detail */}
        <circle cx="31" cy="20" r="2" fill="rgba(255,255,255,.5)" />
        <circle cx="41" cy="20" r="2" fill="rgba(255,255,255,.5)" />
        {/* body */}
        <path d="M14 100 Q14 56 36 50 Q58 56 58 100" fill="#4ECDC4" />
      </g>
      {/* person right – pink */}
      <g
        style={{
          animation: "p2 3s ease-in-out infinite",
          transformOrigin: "84px 90px",
        }}
      >
        <circle cx="84" cy="22" r="14" fill="#E07EA0" />
        <circle cx="79" cy="20" r="2" fill="rgba(255,255,255,.5)" />
        <circle cx="89" cy="20" r="2" fill="rgba(255,255,255,.5)" />
        <path d="M62 100 Q62 56 84 50 Q106 56 106 100" fill="#E07EA0" />
      </g>
      {/* floating hearts – 3 independent loops */}
      {[
        { cx: 52, cy: 38, size: 16, delay: "0s", dur: "2.2s" },
        { cx: 64, cy: 28, size: 12, delay: "0.7s", dur: "2.2s" },
        { cx: 76, cy: 36, size: 10, delay: "1.4s", dur: "2.2s" },
      ].map((h, i) => (
        <g
          key={i}
          style={{
            animation: `hFloat ${h.dur} ${h.delay} ease-in-out infinite`,
          }}
        >
          <path
            d={`M${h.cx} ${h.cy + h.size * 0.7} 
                C${h.cx} ${h.cy + h.size * 0.7} ${h.cx - h.size * 0.9} ${h.cy + h.size * 0.2} 
                ${h.cx - h.size * 0.9} ${h.cy - h.size * 0.1}
                A${h.size * 0.45} ${h.size * 0.45} 0 0 1 ${h.cx} ${h.cy + h.size * 0.25}
                A${h.size * 0.45} ${h.size * 0.45} 0 0 1 ${h.cx + h.size * 0.9} ${h.cy - h.size * 0.1}
                C${h.cx + h.size * 0.9} ${h.cy + h.size * 0.2} ${h.cx} ${h.cy + h.size * 0.7} ${h.cx} ${h.cy + h.size * 0.7}Z`}
            fill="#FF6B8A"
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Money Bag ── */
function MoneyIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 110 100" fill="none">
      {/* bag */}
      <g
        style={{
          animation: "bagWobble 2s ease-in-out infinite",
          transformOrigin: "55px 65px",
        }}
      >
        {/* knot / tie */}
        <rect x="40" y="18" width="30" height="18" rx="8" fill="#2D5A1B" />
        <rect x="44" y="14" width="22" height="12" rx="6" fill="#3A7A22" />
        {/* bag body */}
        <ellipse cx="55" cy="68" rx="38" ry="30" fill="#2D5A1B" />
        <ellipse cx="55" cy="64" rx="34" ry="28" fill="#3A7A22" />
        {/* shine */}
        <ellipse
          cx="42"
          cy="52"
          rx="9"
          ry="6"
          fill="rgba(255,255,255,.1)"
          transform="rotate(-20,42,52)"
        />
        {/* dollar sign */}
        <text
          x="40"
          y="76"
          fontSize="26"
          fontWeight="900"
          fill="#FFD97D"
          style={{ animation: "dollarPulse 1.6s ease-in-out infinite" }}
        >
          $
        </text>
      </g>

      {/* flying coins */}
      <g style={{ animation: "coinArc1 1.8s 0s ease-in-out infinite" }}>
        <circle cx="68" cy="38" r="9" fill="#FFD97D" />
        <circle cx="68" cy="38" r="5" fill="#F4C430" />
      </g>
      <g style={{ animation: "coinArc2 1.8s 0.6s ease-in-out infinite" }}>
        <circle cx="40" cy="38" r="8" fill="#FFD97D" />
        <circle cx="40" cy="38" r="4.5" fill="#F4C430" />
      </g>
      <g style={{ animation: "coinArc3 1.8s 1.2s ease-in-out infinite" }}>
        <circle cx="56" cy="32" r="7" fill="#FFD97D" />
        <circle cx="56" cy="32" r="4" fill="#F4C430" />
      </g>
    </svg>
  );
}

/* ── Tile shell ── */
function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1",
        background: "linear-gradient(145deg,#1a2c54,#0f1e3d)",
        borderRadius: 22,
        boxShadow:
          "0 8px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/* ── Grid export ── */
export default function AnimatedIconGrid() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Tile>
          <ChatIcon />
        </Tile>
        <Tile>
          <EduIcon />
        </Tile>
        <Tile>
          <CoupleIcon />
        </Tile>
        <Tile>
          <MoneyIcon />
        </Tile>
      </div>
    </>
  );
}
