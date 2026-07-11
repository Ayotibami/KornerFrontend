"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { nunito } from "@/lib/font";
import type { PublicWriter } from "@/lib/publicApi";

const ARM_ANGLES = [0, 60, 120, 180, 240, 300];
const TEXT = { fontFamily: nunito.style.fontFamily };

const B = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: "#0f1e3d", fontWeight: 800 }}>{children}</strong>
);

export default function MeetUs({ writers }: { writers: PublicWriter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // writers[0] is always Kappy (guaranteed by page.tsx), writers[1..] fill the orbit arms
  const count = writers.length;
  const activeWriter = activeIndex >= 0 ? writers[activeIndex] : null;
  const armHighlightIndex = activeIndex >= 1 ? activeIndex - 1 : -1;

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = el.offsetHeight - window.innerHeight;

      if (scrolled < 0 || scrolled > scrollable) {
        setActiveIndex(-1);
        return;
      }

      const progress = scrolled / scrollable;
      const wp = (progress - 0.08) / 0.84;
      if (wp < 0 || wp >= 1) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(Math.min(Math.floor(wp * count), count - 1));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [count]);

  const ringClass = [
    "meet-ring",
    activeIndex >= 0 ? "ring-shrunk" : "",
    armHighlightIndex >= 0 ? `ring-active-${armHighlightIndex}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div style={{ width: "95%", marginTop: "clamp(24px, 4vw, 50px)" }}>
      <style>{`
        /* ── Keyframes ──────────────────────────────────────── */
        @keyframes meet-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes meet-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes ca0 { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
        @keyframes ca1 { from { transform: rotate(-60deg);  } to { transform: rotate(-420deg); } }
        @keyframes ca2 { from { transform: rotate(-120deg); } to { transform: rotate(-480deg); } }
        @keyframes ca3 { from { transform: rotate(-180deg); } to { transform: rotate(-540deg); } }
        @keyframes ca4 { from { transform: rotate(-240deg); } to { transform: rotate(-600deg); } }
        @keyframes ca5 { from { transform: rotate(-300deg); } to { transform: rotate(-660deg); } }

        @keyframes avatar-pop {
          0%   { opacity: 0; transform: scale(0.15); }
          65%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes text-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Who we be section ──────────────────────────────── */
        .who-section {
          padding: clamp(24px, 5vw, 50px) clamp(16px, 4vw, 30px) clamp(10px, 2vw, 20px);
        }

        /* ── Orbit ring ─────────────────────────────────────── */
        .meet-ring {
          --size:   400px;
          --radius: 145px;
          --av:      78px;
          position: relative;
          width:  var(--size);
          height: var(--size);
          flex-shrink: 0;
          animation: meet-orbit 18s linear infinite;
          transform-origin: center;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity  0.4s ease;
        }
        .meet-ring.ring-shrunk {
          transform: scale(0.48);
          opacity: 0.45;
        }

        /* ── Arms ───────────────────────────────────────────── */
        .meet-arm { position: absolute; top: 50%; left: 50%; width: 0; height: 0; }
        .meet-arm-0 { transform: rotate(0deg);   }
        .meet-arm-1 { transform: rotate(60deg);  }
        .meet-arm-2 { transform: rotate(120deg); }
        .meet-arm-3 { transform: rotate(180deg); }
        .meet-arm-4 { transform: rotate(240deg); }
        .meet-arm-5 { transform: rotate(300deg); }

        /* ── Orbit avatars ──────────────────────────────────── */
        .meet-av {
          position: absolute;
          width:  var(--av);
          height: var(--av);
          border-radius: 50%;
          overflow: hidden;
          background: #d1d5db;
          top:  calc(-1 * var(--radius) - var(--av) / 2);
          left: calc(-1 * var(--av) / 2);
          transition: box-shadow 0.35s ease;
        }
        .meet-arm-0 .meet-av { animation: ca0 18s linear infinite; }
        .meet-arm-1 .meet-av { animation: ca1 18s linear infinite; }
        .meet-arm-2 .meet-av { animation: ca2 18s linear infinite; }
        .meet-arm-3 .meet-av { animation: ca3 18s linear infinite; }
        .meet-arm-4 .meet-av { animation: ca4 18s linear infinite; }
        .meet-arm-5 .meet-av { animation: ca5 18s linear infinite; }

        .ring-active-0 .meet-arm-0 .meet-av,
        .ring-active-1 .meet-arm-1 .meet-av,
        .ring-active-2 .meet-arm-2 .meet-av,
        .ring-active-3 .meet-arm-3 .meet-av,
        .ring-active-4 .meet-arm-4 .meet-av,
        .ring-active-5 .meet-arm-5 .meet-av {
          box-shadow: 0 0 0 3px #0f1e3d, 0 0 20px rgba(15,30,61,0.22);
        }

        /* ── Center (Kappy) ─────────────────────────────────── */
        .meet-center {
          position: absolute;
          top: 50%; left: 50%;
          width:  var(--av);
          height: var(--av);
          margin-top:  calc(var(--av) / -2);
          margin-left: calc(var(--av) / -2);
          border-radius: 50%;
          overflow: hidden;
          background: #d1d5db;
          animation: meet-counter 18s linear infinite;
        }

        /* ── Stage layout — desktop: 3-column grid ─────────── */
        .meet-stage {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 40px;
          width: 100%;
        }

        /* ── Desktop side panels ────────────────────────────── */
        .meet-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 10px;
        }
        .meet-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
        .meet-spotlight-mobile { display: none; }

        /* ── Spotlight animations ───────────────────────────── */
        .sp-avatar { animation: avatar-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .sp-name   { animation: text-rise 0.45s ease 0.18s both; }
        .sp-bio    { animation: text-rise 0.45s ease 0.30s both; }

        /* ── Tablet: revert to 2-col row ────────────────────── */
        @media (max-width: 860px) {
          .meet-ring { --size: 300px; --radius: 106px; --av: 60px; }
          .meet-stage {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 32px;
          }
          .meet-left  { display: none; }
          .meet-right { display: none; }
          .meet-spotlight-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: clamp(10px, 2vw, 16px);
            max-width: min(300px, 90vw);
            text-align: center;
          }
        }

        /* ── Mobile ─────────────────────────────────────────── */
        @media (max-width: 580px) {
          .meet-ring { --size: 200px; --radius: 70px; --av: 44px; }
          .meet-stage { flex-direction: column; gap: 16px; }
          .meet-ring.ring-shrunk { display: none; }
        }
      `}</style>

      {/* ── "Who we be?" static section ─────────────────────── */}
      <div className="who-section">
        <p
          style={{
            ...TEXT,
            fontSize: "clamp(1.3rem, 4vw, 2.5rem)",
            fontWeight: 900,
            color: "#0f1e3d",
            margin: "0 0 16px 0",
          }}
        >
          Who we be?
        </p>
        <p
          style={{
            ...TEXT,
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            fontWeight: 500,
            color: "#767575",
            margin: 0,
            lineHeight: 1.8,
            maxWidth: 680,
          }}
        >
          First, we built <B>Kampos</B> — the social ecosystem for students. Now
          we&apos;re back, this time bringing you <B>stories</B>. We didn&apos;t
          just wake up one day and start building. We&apos;re{" "}
          <B>students, graduates, alumni</B> — people who love making things
          better. We saw the gap and felt it firsthand: <B>Naija students</B>{" "}
          needed their own space. Somewhere to filter out the noise, be
          ourselves, speak our language, pass the vibe check, and find
          everything at our fingertips. A real <B>community</B>, not a borrowed
          one. That&apos;s what this is about. We&apos;re building this{" "}
          <B>for you, and with you</B>.
        </p>
      </div>

      {/* ── Scroll-driven orbit section ──────────────────────── */}
      <div
        ref={containerRef}
        style={{ height: `calc(100vh + ${count * 45}vh)` }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(12px, 3vw, 24px) clamp(16px, 4vw, 24px)",
            boxSizing: "border-box",
            backgroundColor: "#f1f5f9",
          }}
        >
          <div className="meet-stage">
            {/* Desktop-only left panel: name + bio */}
            <div className="meet-left">
              {activeWriter ? (
                <div key={activeIndex} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p
                    className="sp-name"
                    style={{
                      ...TEXT,
                      fontSize: "clamp(1.1rem, 2vw, 1.8rem)",
                      fontWeight: 900,
                      color: "#0f1e3d",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {activeWriter.name}
                  </p>
                  {activeWriter.bio && (
                    <p
                      className="sp-bio"
                      style={{
                        ...TEXT,
                        fontSize: "clamp(0.82rem, 1.5vw, 0.9375rem)",
                        fontWeight: 500,
                        color: "#767575",
                        margin: 0,
                        lineHeight: 1.7,
                      }}
                    >
                      {activeWriter.bio}
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ ...TEXT, fontSize: "0.9rem", color: "#9ca3af", margin: 0, fontStyle: "italic" }}>
                  Oya, meet our amazing team!
                </p>
              )}
            </div>

            {/* Center: orbit ring */}
            <div className={ringClass}>
              <div className="meet-center">
                {writers[0]?.avatar_url && (
                  <Image
                    src={writers[0].avatar_url}
                    alt={writers[0].name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 580px) 44px, (max-width: 860px) 60px, 78px"
                  />
                )}
              </div>
              {ARM_ANGLES.slice(0, count - 1).map((_, i) => {
                const writer = writers[i + 1];
                return (
                  <div key={i} className={`meet-arm meet-arm-${i}`}>
                    <div className="meet-av">
                      {writer?.avatar_url && (
                        <Image
                          src={writer.avatar_url}
                          alt={writer.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 580px) 44px, (max-width: 860px) 60px, 78px"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop-only right panel: avatar */}
            <div className="meet-right">
              {activeWriter && (
                <div
                  key={activeIndex}
                  className="sp-avatar"
                  style={{
                    width: "clamp(120px, 12vw, 176px)",
                    height: "clamp(120px, 12vw, 176px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "#d1d5db",
                    position: "relative",
                    flexShrink: 0,
                    boxShadow: "0 16px 48px rgba(15,30,61,0.18)",
                  }}
                >
                  {activeWriter.avatar_url && (
                    <Image
                      src={activeWriter.avatar_url}
                      alt={activeWriter.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="176px"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Tablet + mobile combined spotlight (existing behavior) */}
            <div className="meet-spotlight-mobile">
              {activeWriter ? (
                <div
                  key={activeIndex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "clamp(10px, 2vw, 16px)",
                    maxWidth: "min(300px, 90vw)",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="sp-avatar"
                    style={{
                      width: "clamp(120px, 25vw, 176px)",
                      height: "clamp(120px, 25vw, 176px)",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#d1d5db",
                      position: "relative",
                      flexShrink: 0,
                      boxShadow: "0 16px 48px rgba(15,30,61,0.18)",
                    }}
                  >
                    {activeWriter.avatar_url && (
                      <Image
                        src={activeWriter.avatar_url}
                        alt={activeWriter.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 580px) 120px, 176px"
                      />
                    )}
                  </div>
                  <p
                    className="sp-name"
                    style={{
                      ...TEXT,
                      fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
                      fontWeight: 900,
                      color: "#0f1e3d",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {activeWriter.name}
                  </p>
                  {activeWriter.bio && (
                    <p
                      className="sp-bio"
                      style={{
                        ...TEXT,
                        fontSize: "clamp(0.82rem, 2vw, 0.9375rem)",
                        fontWeight: 500,
                        color: "#767575",
                        margin: 0,
                        lineHeight: 1.7,
                      }}
                    >
                      {activeWriter.bio}
                    </p>
                  )}
                </div>
              ) : (
                <p
                  style={{
                    ...TEXT,
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    color: "#9ca3af",
                    margin: 0,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  Oya, meet our amazing team!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
