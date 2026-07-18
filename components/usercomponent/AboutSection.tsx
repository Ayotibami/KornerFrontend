"use client";

import { useEffect, useRef, useState } from "react";
import { nunito } from "@/lib/font";

const TEXT = { fontFamily: nunito.style.fontFamily };
type RowState = "below" | "visible" | "above";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function BookSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      <rect x="10" y="36" width="36" height="12" rx="3" fill="#E8A824" />
      <rect x="10" y="36" width="7" height="12" rx="3" fill="#C8901A" />
      <rect x="10" y="24" width="36" height="15" rx="3" fill="#2E6FC4" />
      <rect x="10" y="24" width="7" height="15" rx="3" fill="#1E5AA8" />
      <rect x="10" y="12" width="36" height="15" rx="3" fill="#1E3A5F" />
      <rect x="10" y="12" width="7" height="15" rx="3" fill="#142B48" />
      <rect x="43" y="13" width="2" height="13" rx="1" fill="#D0E4F8" opacity="0.7" />
      <rect x="43" y="25" width="2" height="13" rx="1" fill="#90B8E8" opacity="0.7" />
      <path d="M32 10V21L35 19L38 21V10Z" fill="#FFD700" stroke="#E8C000" strokeWidth="0.5" />
    </svg>
  );
}

function CoinSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      <circle cx="30" cy="30" r="14" fill="#9A7200" />
      <circle cx="28" cy="28" r="14" fill="#DBA91A" />
      <path d="M28 14A14 14 0 0 0 14 28A14 14 0 0 0 28 42Z" fill="#C09010" />
      <path d="M20 19Q28 15 36 19" stroke="#F5D060" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 36V20L36 36V20" stroke="#7A5500" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18" y="25.5" width="20" height="2.5" rx="1.25" fill="#7A5500" />
      <rect x="18" y="30.5" width="20" height="2.5" rx="1.25" fill="#7A5500" />
    </svg>
  );
}

function ChatSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      <path d="M12 10H44Q48 10 48 14V34Q48 38 44 38H34L26 49V38H14Q10 38 10 34V14Q10 10 14 10Z" fill="#4A8FA8" />
      <path d="M10 8H42Q46 8 46 12V32Q46 36 42 36H32L24 47V36H12Q8 36 8 32V12Q8 8 12 8Z" fill="#7BAFC4" />
      <path d="M17 16Q28 12 39 16" stroke="#9FD0E4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="24" r="4" fill="white" className="dot dot-1" />
      <circle cx="28" cy="24" r="4" fill="white" className="dot dot-2" />
      <circle cx="36" cy="24" r="4" fill="white" className="dot dot-3" />
    </svg>
  );
}

function HeartSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      <path
        d="M28 46C28 46 9 34 9 22C9 16 14 11 20 11C23.5 11 26.5 12.5 28 15C29.5 12.5 32.5 11 36 11C42 11 47 16 47 22C47 34 28 46 28 46Z"
        fill="#C0392B"
      />
      <path d="M28 46C28 46 9 34 9 22C9 16 14 11 20 11C23.5 11 26.5 12.5 28 15" fill="#E74C3C" />
      <ellipse cx="22" cy="19" rx="4" ry="2.5" fill="#F08898" opacity="0.65" />
    </svg>
  );
}

function PeopleSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      {/* Back person */}
      <circle cx="18" cy="18" r="9" fill="#1A7052" />
      <path d="M5 50C5 40.5 11 36 18 36C25 36 31 40.5 31 50Z" fill="#1A7052" />
      {/* Front person */}
      <circle cx="37" cy="16" r="10" fill="#239E78" />
      <path d="M24 50C24 40.5 30.5 36 37 36C43.5 36 50 40.5 50 50Z" fill="#239E78" />
      {/* Front person highlight */}
      <path d="M37 6A10 10 0 0 1 47 16A10 10 0 0 1 37 26Z" fill="#2DB88A" opacity="0.75" />
    </svg>
  );
}

function CompassSvg() {
  return (
    <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
      <circle cx="28" cy="28" r="20" fill="#1A5E44" />
      <path d="M28 8A20 20 0 0 1 48 28A20 20 0 0 1 28 48Z" fill="#1E7B5E" />
      <rect x="26.5" y="10" width="3" height="6" rx="1.5" fill="white" />
      <rect x="26.5" y="40" width="3" height="6" rx="1.5" fill="white" />
      <rect x="10" y="26.5" width="6" height="3" rx="1.5" fill="white" />
      <rect x="40" y="26.5" width="6" height="3" rx="1.5" fill="white" />
      <g className="compass-needle">
        <path d="M28 14L31.5 28L28 24L24.5 28Z" fill="#E74C3C" />
        <path d="M28 42L31.5 28L28 32L24.5 28Z" fill="white" opacity="0.85" />
      </g>
      <circle cx="28" cy="28" r="3.5" fill="#0F1E3D" />
      <circle cx="28" cy="28" r="1.8" fill="white" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

interface Topic {
  icon: React.ReactNode;
  bg: string;
  anim: string;
  label: string;
  description: string;
}

const LEFT_TOPICS: Topic[] = [
  {
    icon: <BookSvg />,
    bg: "#D6E4FF",
    anim: "anim-book",
    label: "Academics",
    description: "Exams, lectures, CGPA, projects and reading all night long",
  },
  {
    icon: <CoinSvg />,
    bg: "#FFF9D6",
    anim: "anim-coin",
    label: "Moni Matter",
    description: "Side hustles, broke moments and making sure your funds no run dry",
  },
  {
    icon: <ChatSvg />,
    bg: "#D6F8FF",
    anim: "",
    label: "Campus Gist",
    description: "The drama, the vibes and everything going on in school",
  },
];

const RIGHT_TOPICS: Topic[] = [
  {
    icon: <HeartSvg />,
    bg: "#FFD6D6",
    anim: "anim-heart",
    label: "Love Life",
    description:
      "Whether you want to fall in love, fall out of love, or just not run mad after being served breakfast",
  },
  {
    icon: <PeopleSvg />,
    bg: "#D6FFE0",
    anim: "anim-people",
    label: "Culture & Community",
    description:
      "Coping with school life, relationships and everything apart from pursuing your degree",
  },
  {
    icon: <CompassSvg />,
    bg: "#EDD6FF",
    anim: "",
    label: "The Ending",
    description:
      "Life after school, career, and what you can do without your certificate",
  },
];

// ── TopicRow ──────────────────────────────────────────────────────────────────

function TopicRow({
  topic,
  isLast,
  delay,
}: {
  topic: Topic;
  isLast: boolean;
  delay: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rowState, setRowState] = useState<RowState>("below");
  const [iconPopped, setIconPopped] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let rowTimer: ReturnType<typeof setTimeout>;
    let iconTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(rowTimer);
        clearTimeout(iconTimer);
        if (entry.isIntersecting) {
          rowTimer = setTimeout(() => setRowState("visible"), delay);
          iconTimer = setTimeout(() => setIconPopped(true), delay + 80);
        } else {
          setIconPopped(false);
          setRowState(entry.boundingClientRect.top < 0 ? "above" : "below");
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(rowTimer);
      clearTimeout(iconTimer);
    };
  }, [delay]);

  const isVisible = rowState === "visible";
  const transform =
    rowState === "visible"
      ? "translateY(0px)"
      : rowState === "above"
        ? "translateY(-22px)"
        : "translateY(40px)";

  return (
    <div ref={wrapperRef}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottom: isLast ? "none" : "1px solid #f0f0f0",
          opacity: isVisible ? 1 : 0,
          transform,
          transition: isVisible
            ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease"
            : "transform 0.28s ease-in, opacity 0.22s ease-in",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            backgroundColor: topic.bg,
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transform: iconPopped ? "scale(1)" : "scale(0.1)",
            transition: iconPopped
              ? "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "transform 0.18s ease-in",
          }}
        >
          <div className={topic.anim || undefined}>{topic.icon}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
          <p style={{ ...TEXT, fontWeight: 800, color: "#0f1e3d", fontSize: "0.9375rem", margin: 0 }}>
            {topic.label}
          </p>
          <p style={{ ...TEXT, fontWeight: 500, color: "#767575", fontSize: "0.8125rem", margin: 0, lineHeight: 1.6 }}>
            {topic.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── AboutSection ──────────────────────────────────────────────────────────────

export default function AboutSection() {
  return (
    <div
      style={{
        padding: "clamp(24px, 5vw, 48px)",
        borderRadius: 20,
        width: "95%",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        backgroundColor: "white",
      }}
    >
      <style>{`
        /* Heartbeat */
        @keyframes heartbeat {
          0%,55%,100% { transform: scale(1); }
          20%  { transform: scale(1.3); }
          35%  { transform: scale(1.1); }
          45%  { transform: scale(1.24); }
        }
        .anim-heart { animation: heartbeat 1.8s ease-in-out infinite; }

        /* Coin bob */
        @keyframes coin-bob {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-5px) rotate(-6deg); }
          70%     { transform: translateY(-3px) rotate(3deg); }
        }
        .anim-coin { animation: coin-bob 2.4s ease-in-out infinite; }

        /* Book tilt */
        @keyframes book-tilt {
          0%,100% { transform: rotate(0deg) translateY(0px); }
          30%     { transform: rotate(-8deg) translateY(-3px); }
          70%     { transform: rotate(5deg) translateY(1px); }
        }
        .anim-book { animation: book-tilt 3s ease-in-out infinite; }

        /* Typing dots */
        @keyframes dot-blink {
          0%,60%,100% { opacity: 0.15; transform: scale(0.7); }
          30%          { opacity: 1;    transform: scale(1); }
        }
        .dot-1 { transform-origin: 20px 24px; animation: dot-blink 1.6s 0s    infinite; }
        .dot-2 { transform-origin: 28px 24px; animation: dot-blink 1.6s 0.27s infinite; }
        .dot-3 { transform-origin: 36px 24px; animation: dot-blink 1.6s 0.54s infinite; }

        /* People sway */
        @keyframes people-sway {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-5px); }
        }
        .anim-people { animation: people-sway 2.2s ease-in-out infinite; }

        /* Compass needle swing */
        @keyframes compass-swing {
          0%,100% { transform: rotate(0deg); }
          25%     { transform: rotate(-32deg); }
          75%     { transform: rotate(32deg); }
        }
        .compass-needle {
          transform-origin: 28px 28px;
          animation: compass-swing 3s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h1
          style={{
            ...TEXT,
            color: "#000000",
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            margin: 0,
          }}
        >
          Na your Korner
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "0 40px",
        }}
      >
        {[LEFT_TOPICS, RIGHT_TOPICS].map((col, ci) => (
          <div key={ci} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {col.map((topic, i) => (
              <TopicRow
                key={topic.label}
                topic={topic}
                isLast={i === col.length - 1}
                delay={ci * 30 + i * 60}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
