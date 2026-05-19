"use client";

import { useEffect, useState } from "react";
import { nunito } from "@/lib/font";
import AnimatedClock from "./AnimatedClock";

type Phase = "typing-title" | "typing-subtitle" | "typing-author" | "done";

export default function StoriCover({
  title,
  subtitle,
  authorName,
  authorAvatar = "",
  coverImage = "",
  readingTime = "",
  date = "",
}: {
  title: string;
  subtitle: string;
  authorName: string;
  authorAvatar?: string;
  coverImage?: string;
  readingTime?: string;
  date?: string;
}) {
  const [phase, setPhase] = useState<Phase>("typing-title");
  const [titleChars, setTitleChars] = useState(0);
  const [subtitleChars, setSubtitleChars] = useState(0);
  const [authorChars, setAuthorChars] = useState(0);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    if (phase !== "typing-title") return;
    const interval = setInterval(() => {
      setTitleChars((prev) => {
        if (prev >= title.length) {
          clearInterval(interval);
          setPhase("typing-subtitle");
          return prev;
        }
        return prev + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [phase, title.length]);

  useEffect(() => {
    if (phase !== "typing-subtitle") return;
    const interval = setInterval(() => {
      setSubtitleChars((prev) => {
        if (prev >= subtitle.length) {
          clearInterval(interval);
          setPhase("typing-author");
          return prev;
        }
        return prev + 1;
      });
    }, 12);
    return () => clearInterval(interval);
  }, [phase, subtitle.length]);

  useEffect(() => {
    if (phase !== "typing-author") return;
    const interval = setInterval(() => {
      setAuthorChars((prev) => {
        if (prev >= authorName.length) {
          clearInterval(interval);
          setShowMeta(true);
          setPhase("done");
          return prev;
        }
        return prev + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [phase, authorName.length]);

  const isDancing = phase !== "done";
  const showCursor = (active: boolean, chars: number, total: number) =>
    active && chars < total;

  return (
    <>
      <style>{`
        @keyframes cover-dance {
          0%   { transform: scale(1)     rotate(0deg); }
          15%  { transform: scale(1.02)  rotate(1deg); }
          30%  { transform: scale(0.99)  rotate(-1deg); }
          45%  { transform: scale(1.02)  rotate(0.8deg); }
          60%  { transform: scale(0.99)  rotate(-0.6deg); }
          75%  { transform: scale(1.015) rotate(0.4deg); }
          100% { transform: scale(1)     rotate(0deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: white;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.7s step-end infinite;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          height: "clamp(320px, 55vw, 480px)",
          padding: "clamp(16px, 5vw, 40px)",
          display: "flex",
          gap: 20,
          justifyContent: "flex-end",
          flexDirection: "column",
          borderRadius: "clamp(16px, 4vw, 36px)",
          backgroundColor: "black",
          backgroundImage: coverImage ? `url("${coverImage}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: isDancing
            ? "cover-dance 0.9s ease-in-out infinite"
            : "none",
        }}
      >
        {titleChars > 0 && (
          <h1
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "white",
              margin: 0,
            }}
          >
            {title.slice(0, titleChars)}
            {showCursor(phase === "typing-title", titleChars, title.length) && (
              <span className="typing-cursor" />
            )}
          </h1>
        )}

        {subtitleChars > 0 && (
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
              fontWeight: 500,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {subtitle.slice(0, subtitleChars)}
            {showCursor(
              phase === "typing-subtitle",
              subtitleChars,
              subtitle.length,
            ) && <span className="typing-cursor" />}
          </p>
        )}

        {authorChars > 0 && (
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: "clamp(32px, 5vw, 44px)",
                  height: "clamp(32px, 5vw, 44px)",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  backgroundImage: authorAvatar
                    ? `url("${authorAvatar}")`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
                  fontWeight: 600,
                  color: "#00B2FF",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {authorName.slice(0, authorChars)}
                {showCursor(
                  phase === "typing-author",
                  authorChars,
                  authorName.length,
                ) && <span className="typing-cursor" />}
              </p>
            </div>

            {showMeta && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "clamp(8px, 3vw, 25px)",
                  animation: "fade-in 0.5s ease forwards",
                }}
              >
                {readingTime && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <AnimatedClock />
                    <p
                      style={{
                        fontFamily: nunito.style.fontFamily,
                        fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
                        fontWeight: 500,
                        color: "white",
                        margin: 0,
                      }}
                    >
                      {readingTime}
                    </p>
                  </div>
                )}
                {date && (
                  <p
                    style={{
                      fontFamily: nunito.style.fontFamily,
                      fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
                      fontWeight: 500,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {date}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
