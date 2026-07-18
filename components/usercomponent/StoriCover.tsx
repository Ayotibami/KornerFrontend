"use client";
// "use client" needed for useState, useEffect, and the typing animation intervals.

import { useEffect, useState } from "react";
import { nunito } from "@/lib/font";

import AnimatedClock from "./AnimatedClock";

// Phase controls which piece of text is currently being typed.
// They run in sequence: title → subtitle → author → done.
// "done" means all typing is finished and the cover stops dancing.
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
  // Each *Chars state tracks how many characters of that string have been revealed so far.
  // We slice the string to *Chars length when rendering, which creates the typing effect.
  const [phase, setPhase] = useState<Phase>("typing-title");
  const [titleChars, setTitleChars] = useState(0);
  const [subtitleChars, setSubtitleChars] = useState(0);
  const [authorChars, setAuthorChars] = useState(0);

  // showMeta appears only after all typing is done — the reading time + date row
  // fades in as a final flourish once the author name finishes typing.
  const [showMeta, setShowMeta] = useState(false);

  // ── TYPING EFFECT: TITLE ────────────────────────────────────────────────────
  // setInterval fires every 35ms and reveals one more character of the title.
  // When all characters are shown it clears itself and advances phase to subtitle.
  // The return () => clearInterval(interval) is cleanup — runs when this effect
  // re-runs or when the component unmounts, preventing memory leaks.
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
    }, 35); // 35ms per character — slower = feels more deliberate
    return () => clearInterval(interval);
  }, [phase, title.length]);

  // ── TYPING EFFECT: SUBTITLE ─────────────────────────────────────────────────
  // 12ms per character — much faster than title, subtitle feels like it rushes out.
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

  // ── TYPING EFFECT: AUTHOR NAME ──────────────────────────────────────────────
  // 45ms per character — slowest of the three, author name feels carefully written.
  // When finished: shows the meta row and sets phase to "done" which stops dancing.
  useEffect(() => {
    if (phase !== "typing-author") return;
    const interval = setInterval(() => {
      setAuthorChars((prev) => {
        if (prev >= authorName.length) {
          clearInterval(interval);
          setShowMeta(true); // triggers the fade-in of reading time + date
          setPhase("done");
          return prev;
        }
        return prev + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [phase, authorName.length]);

  // Cover dances while any typing is happening, stops when everything is done.
  const isDancing = phase !== "done";

  // Returns true only while a field is actively being typed and hasn't finished yet.
  // Used to decide whether to show the blinking cursor next to each text element.
  const showCursor = (active: boolean, chars: number, total: number) =>
    active && chars < total;

  return (
    <>
      {/* ── KEYFRAMES ──────────────────────────────────────────────────────────
          cover-dance: subtle scale + rotate wobble applied to the whole cover
          while typing is happening. Stops the moment phase becomes "done".
          The small scale values (1.02, 0.99) give a breathing/bouncing feel.

          fade-in: used by the meta row (reading time + date) to slide up and
          appear smoothly after all typing finishes.

          blink: drives the .typing-cursor class — the white blinking bar
          that appears at the end of whichever text is currently being typed.
          step-end means it switches opacity instantly (on/off) rather than fading,
          which matches the look of a real terminal cursor. */}
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

      {/* ── COVER IMAGE DIV ────────────────────────────────────────────────────
          We use backgroundImage instead of <Image> because the cover URL is dynamic
          and this approach lets us style the container directly without needing a
          position:relative wrapper + fill pattern.
          backgroundColor: "black" shows as the base when no coverImage is provided.
          justifyContent: "flex-end" + flexDirection: "column" pushes all text
          to the bottom of the cover. */}
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
          position: "relative",
          overflow: "hidden",
          animation: isDancing
            ? "cover-dance 0.9s ease-in-out infinite"
            : "none",
        }}
      >
        {/* Gradient scrim — sits below the text via zIndex: 0.
            Transparent at top, dark at bottom where the text lives. */}
        {coverImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.75) 100%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Content wrapper — zIndex: 1 keeps it above the gradient scrim */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title — only renders once at least 1 character has been typed.
            title.slice(0, titleChars) reveals the string incrementally. */}
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
            {/* Cursor only shows while this field is the active one being typed */}
            {showCursor(phase === "typing-title", titleChars, title.length) && (
              <span className="typing-cursor" />
            )}
          </h1>
        )}

        {/* Subtitle — appears after title is fully typed */}
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
            {showCursor(phase === "typing-subtitle", subtitleChars, subtitle.length) && (
              <span className="typing-cursor" />
            )}
          </p>
        )}

        {/* Author row — appears after subtitle is fully typed.
            Contains: avatar circle + author name (typing) on the left,
            reading time + date (fade-in) on the right. */}
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
              {/* Avatar circle — CSS background-image approach, same as StoriBottom.
                  Grey fallback shown when no avatar URL is provided. */}
              <div
                style={{
                  width: "clamp(32px, 5vw, 44px)",
                  height: "clamp(32px, 5vw, 44px)",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  backgroundImage: authorAvatar ? `url("${authorAvatar}")` : "none",
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
                {showCursor(phase === "typing-author", authorChars, authorName.length) && (
                  <span className="typing-cursor" />
                )}
              </p>
            </div>

            {/* Meta row: reading time + date.
                Only rendered after showMeta becomes true (all typing done).
                animation: "fade-in 0.5s ease forwards" plays once — "forwards"
                means it holds the final state (opacity: 1) after finishing. */}
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
                    {/* Animated clock icon — isolated in its own component */}
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

        </div>{/* end content wrapper */}
      </div>
    </>
  );
}
