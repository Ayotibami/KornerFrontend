"use client";
// "use client" is required because this component:
// 1. Uses useState and useRef (React hooks, browser-only)
// 2. Uses useRouter for programmatic navigation (browser-only)
// 3. Listens to mouse events (hover, click) which only exist in the browser

import { nunito } from "@/lib/font";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function StoriCard({
  image,
  authorAvatar,
  authorName,
  title,
  excerpt,
  date,
  href, // the URL this card navigates to when clicked e.g. "/stories/04e23ac7-..."
}: {
  image: string;
  authorAvatar: string;
  authorName: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}) {
  // cardRef attaches to the card's outer div so we can measure its position on screen.
  // We need this to know where to place the expansion overlay when the user clicks.
  const cardRef = useRef<HTMLDivElement>(null);

  // useRouter gives us router.push() to navigate programmatically.
  // We need this instead of a <Link> because we want to delay navigation
  // until AFTER the click animation has finished playing.
  const router = useRouter();

  // ── CLICK-TO-EXPAND ANIMATION STATE ──────────────────────────────────────────
  //
  // This animation works in two phases using a white overlay div:
  //
  // "idle"      → overlay doesn't exist in the DOM at all. Normal state.
  //
  // "start"     → overlay is added to the DOM at exactly the same position
  //               and size as the card. No CSS transition yet — this is
  //               invisible to the user, it just places the overlay silently.
  //               We MUST do this first so the browser knows where to animate FROM.
  //
  // "expanding" → we trigger the CSS transition. The overlay moves from the
  //               card's position to top:0, left:0, width:100vw, height:100vh.
  //               The user sees the card appear to grow and swallow the screen.
  //
  // After 450ms (when the animation is nearly done), we call router.push()
  // to navigate to the story page. The white overlay filling the screen makes
  // the page transition look seamless — the new page loads under the overlay.
  const [phase, setPhase] = useState<"idle" | "start" | "expanding">("idle");

  // Stores the card's pixel coordinates at the moment of click.
  // getBoundingClientRect() gives us top, left, width, height relative to the viewport.
  // We capture these once and store them here so the overlay knows its starting position.
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  // ── HOVER SWAY ANIMATION STATE ────────────────────────────────────────────────
  // true while the mouse is over the card — drives the CSS sway animation on/off
  const [hovered, setHovered] = useState(false);

  // ── CLICK HANDLER ─────────────────────────────────────────────────────────────
  const handleClick = () => {
    if (!cardRef.current) return;

    // Step 1: Snapshot the card's current position on screen.
    // getBoundingClientRect() returns coordinates relative to the viewport (the visible window),
    // not the page — so scrolling doesn't affect these values. Perfect for fixed positioning.
    const r = cardRef.current.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });

    // Step 2: Move to "start" phase — renders the overlay at the card's position silently.
    // No transition is applied yet, so the user sees nothing change.
    setPhase("start");

    // Step 3: Trigger the expansion on the NEXT TWO animation frames.
    // We use double requestAnimationFrame (RAF) here — not one, but two.
    //
    // Why double? Because React batches state updates. If we called setPhase("expanding")
    // immediately after setPhase("start"), React would apply both in the same render,
    // and the browser would never paint the overlay at its starting position first.
    // The CSS transition would have no "from" state to animate FROM, so it would
    // just snap to fullscreen instantly with no animation.
    //
    // The first RAF waits for React to finish rendering the "start" state.
    // The second RAF waits for the browser to actually paint those pixels to the screen.
    // Only THEN do we trigger "expanding" — now the browser has a real starting position
    // to transition from, and the smooth animation plays correctly.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("expanding");
      });
    });

    // Step 4: Navigate to the story page after 450ms — timed to match the CSS transition.
    // By then the overlay covers the full screen, so the page switch looks seamless.
    setTimeout(() => router.push(href), 450);
  };

  return (
    <>
      {/* ── HOVER SWAY KEYFRAMES ──────────────────────────────────────────────────
          Defines the sway animation used when the user hovers over the card.
          @keyframes is a CSS rule that describes what the animation looks like at each point:
            0%  = start position (upright)
            20% = leaning left  (-1.8 degrees)
            60% = leaning right (+1.8 degrees)
            100%= back to upright
          The percentages are points in time across the animation duration.
          We inject this as a <style> tag because React inline styles don't support @keyframes.
          The animation name "card-sway" is referenced by name in the card's style below. */}
      <style>{`
        @keyframes card-sway {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-1.8deg); }
          60%  { transform: rotate(1.8deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      {/* ── CLICK EXPANSION OVERLAY ───────────────────────────────────────────────
          This div is the white sheet that expands to cover the screen on click.
          It only exists in the DOM during the animation (when phase !== "idle").

          position: fixed — critical. Fixed elements are positioned relative to the
          viewport and are NOT affected by parent overflow:hidden or scroll position.
          Without this, the overlay would be clipped by the card's overflow:hidden.

          zIndex: 9999 — sits on top of everything else on the page.

          In "start" phase: matches the card's top/left/width/height exactly, no transition.
          In "expanding" phase: transitions to 0/0/100vw/100vh covering the full screen.

          The transition string lists each property separately with the same duration.
          We animate top, left, width, height, and border-radius all at once.
          cubic-bezier(0.4, 0, 0.2, 1) is Material Design's "standard" easing curve —
          starts fast, decelerates smoothly at the end. Feels natural and intentional. */}
      {phase !== "idle" && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            backgroundColor: "white",
            top: phase === "expanding" ? 0 : rect.top,
            left: phase === "expanding" ? 0 : rect.left,
            width: phase === "expanding" ? "100vw" : rect.width,
            height: phase === "expanding" ? "100vh" : rect.height,
            borderRadius: phase === "expanding" ? 0 : 24,
            transition: phase === "expanding"
              ? "top 0.45s cubic-bezier(0.4, 0, 0.2, 1), left 0.45s cubic-bezier(0.4, 0, 0.2, 1), width 0.45s cubic-bezier(0.4, 0, 0.2, 1), height 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.45s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        />
      )}

      {/* ── THE ACTUAL CARD ───────────────────────────────────────────────────────
          ref={cardRef}       — connects this div to cardRef so we can measure its position
          onClick             — triggers the expand-to-fullscreen animation then navigates
          onMouseEnter/Leave  — toggles the hover sway animation on and off

          animation: when hovered, applies the card-sway keyframes defined above.
            "card-sway 0.5s ease-in-out infinite" means:
            - play the "card-sway" animation
            - each cycle takes 0.5 seconds
            - ease-in-out: starts and ends slowly, faster in the middle
            - infinite: keeps looping as long as the mouse stays on the card
          When not hovered, animation is "none" — the card is still.

          transformOrigin: "bottom center" — sets the pivot point of the rotation.
          Without this, rotate() pivots from the element's center, which looks like
          the card is spinning in place. "bottom center" makes it pivot from the bottom
          edge, like a pendulum or a sign hanging from a nail — much more natural. */}
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 500,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          cursor: "pointer",
          animation: hovered ? "card-sway 0.5s ease-in-out infinite" : "none",
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            height: "55%",
            backgroundColor: "lightgray",
            position: "relative",
          }}
        >
          {image && (
            <Image src={image} alt={title} fill style={{ objectFit: "cover" }} unoptimized />
          )}
        </div>
        <div
          style={{
            padding: 14,
            height: "45%",
            justifyContent: "space-evenly",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontWeight: 800,
              fontSize: "1rem",
              color: "black",
              textAlign: "left",
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "#767575",
              fontFamily: nunito.style.fontFamily,
              fontSize: "0.8rem",
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            {excerpt}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "lightgray",
                  flexShrink: 0,
                  // position: relative is required here — next/image's `fill`
                  // positions itself absolute/inset:0 relative to the nearest
                  // positioned ancestor. Without this, there isn't one
                  // anywhere up this tree, so the browser falls back to
                  // positioning it against the page itself — the avatar
                  // stretches to cover the full viewport instead of this
                  // 28px circle.
                  position: "relative",
                }}
              >
                {authorAvatar && (
                  <Image
                    src={authorAvatar}
                    alt="avatar"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                )}
              </div>
              <p
                style={{
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "0.7rem",
                  color: "#767575",
                  fontWeight: 600,
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {authorName}
              </p>
            </div>
            <p
              style={{
                color: "#767575",
                fontFamily: nunito.style.fontFamily,
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              {date}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
