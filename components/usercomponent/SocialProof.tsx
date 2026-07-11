"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nunito } from "@/lib/font";
import Button from "@/components/admincomponent/Button";

const TEXT = { fontFamily: nunito.style.fontFamily };

const LINES = [
  { text: "They always dey wait for every of our stori!", bold: false },
  { text: "and the stories dey come in hot hot and back to back", bold: false },
  { text: "we no dey disappoint!", bold: false },
  { text: "so dey with us na", bold: false },
  { text: "and you no go pay shi shi to read am sef!", bold: false },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!active) {
      setCount(0);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration]);

  return count;
}

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [headingIn, setHeadingIn] = useState(false);
  const [statIn, setStatIn] = useState(false);
  const [lineIn, setLineIn] = useState([...LINES, null].map(() => false));

  const count = useCountUp(500, 1600, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        timers.forEach(clearTimeout);
        timers.length = 0;

        if (entry.isIntersecting) {
          setActive(true);
          timers.push(setTimeout(() => setHeadingIn(true), 0));
          timers.push(setTimeout(() => setStatIn(true), 180));
          // 5 lines + button staggered after the stat
          [...LINES, null].forEach((_, i) => {
            timers.push(
              setTimeout(
                () => {
                  setLineIn((prev) => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  });
                },
                420 + i * 120,
              ),
            );
          });
        } else {
          setActive(false);
          setHeadingIn(false);
          setStatIn(false);
          setLineIn([...LINES, null].map(() => false));
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const reveal = (visible: boolean, delay = "0ms") => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(28px)",
    transition: visible
      ? `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}, opacity 0.5s ease ${delay}`
      : "transform 0.2s ease-in, opacity 0.15s ease-in",
  });

  return (
    <>
      <style>{`
      .sp-sticky {
        position: absolute;
        top: 10px;
        right: 0;
        width: 160px;
      }
      @media (max-width: 600px) {
        .sp-sticky {
          position: relative;
          top: auto;
          right: auto;
          width: 85%;
          max-width: 220px;
          margin-top: 12px;
        }
      }
    `}</style>
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "0 40px",
          alignItems: "center",
        }}
      >
        {/* Left: animated text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <p
            style={{
              ...TEXT,
              ...reveal(headingIn),
              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
              fontWeight: 700,
              color: "#767575",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 18px 0",
            }}
          >
            No be whining o
          </p>

          <div
            style={{
              ...reveal(statIn),
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "0 10px",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                ...TEXT,
                fontSize: "clamp(3rem, 7vw, 4.5rem)",
                fontWeight: 900,
                color: "#0f1e3d",
                lineHeight: 1,
              }}
            >
              {count}+
            </span>
            <span
              style={{
                ...TEXT,
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 700,
                color: "#0f1e3d",
              }}
            >
              students don dey korner
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LINES.map((line, i) => (
              <p
                key={i}
                style={{
                  ...TEXT,
                  ...reveal(lineIn[i]),
                  fontSize: "clamp(0.875rem, 1.8vw, 0.9375rem)",
                  fontWeight: 500,
                  color: "#767575",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {line.text}
              </p>
            ))}

            {/* Button appears last */}
            <div
              style={{
                ...reveal(lineIn[LINES.length - 1]),
                marginTop: 8,
                width: "fit-content",
              }}
            >
              <Link href="/stories" style={{ textDecoration: "none" }}>
                <Button blue>Hop in naaaa!</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Kappy + sticky note */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src="/images/begging.png"
            alt="Kappy begging you to join"
            width={400}
            height={480}
            style={{
              width: "clamp(180px, 40%, 280px)",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* Sticky note from the team */}
          <div
            className="sp-sticky"
            style={{
              backgroundColor: "#fef08a",
              padding: "12px 14px 16px",
              boxShadow: "2px 3px 12px rgba(0,0,0,0.13)",
              opacity: statIn ? 1 : 0,
              transform: statIn
                ? "rotate(3deg) translateX(0px)"
                : "rotate(3deg) translateX(40px)",
              transition: statIn
                ? "opacity 0.5s ease 0.3s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.3s"
                : "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            <p
              style={{
                ...TEXT,
                fontWeight: 700,
                fontSize: "0.78rem",
                color: "#1a1a1a",
                margin: "0 0 10px 0",
                lineHeight: 1.65,
              }}
            >
              See o! You don even dey make Kappy beg you. E never reach like
              that na. Hop in jor!
            </p>
            <p
              style={{
                ...TEXT,
                fontWeight: 800,
                fontSize: "0.7rem",
                color: "#555",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              — The Korner Team 🫶
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
