"use client";

import { nunito } from "@/lib/font";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function StoriCard({
  image,
  authorAvatar,
  authorName,
  title,
  excerpt,
  date,
  href,
}: {
  image: string;
  authorAvatar: string;
  authorName: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "start" | "expanding">("idle");
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setPhase("start");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("expanding"));
    });
    setTimeout(() => router.push(href), 450);
  };

  return (
    <>
      <style>{`
        @keyframes card-sway {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-1.8deg); }
          60%  { transform: rotate(1.8deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

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
            borderRadius: phase === "expanding" ? 0 : "24px 24px 0 0",
            transition:
              phase === "expanding"
                ? "top 0.45s cubic-bezier(0.4,0,0.2,1), left 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1), border-radius 0.45s cubic-bezier(0.4,0,0.2,1)"
                : "none",
          }}
        />
      )}

      <Link
        href={href}
        ref={cardRef}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          height: 450,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          animation: hovered ? "card-sway 0.5s ease-in-out infinite" : "none",
          transformOrigin: "bottom center",
        }}
      >
        {/* Cover image */}
        <div
          style={{
            height: "55%",
            backgroundColor: "#e2e8f0",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: "14px 16px 16px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Title + excerpt cluster at top */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Title — 2-line clamp */}
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontWeight: 800,
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                color: "#0f1e3d",
                margin: 0,
                lineHeight: 1.35,
                textTransform: "capitalize",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </p>

            {/* Excerpt — 3-line clamp */}
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                color: "#6b7280",
                fontSize: "clamp(0.82rem, 2vw, 0.9rem)",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.55,
                textTransform: "capitalize",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {excerpt}
            </p>
          </div>

          {/* Author row — marginTop: auto pins it to the bottom of the content area */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              paddingTop: 8,
              marginTop: 12,
              borderTop: "1px solid #f1f5f9",
              minWidth: 0,
            }}
          >
            {/* Avatar + name — flex:1 + minWidth:0 lets the name truncate properly */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#e2e8f0",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {authorAvatar && (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="34px"
                  />
                )}
              </div>
              <p
                style={{
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "0.78rem",
                  color: "#6b7280",
                  fontWeight: 600,
                  fontStyle: "italic",
                  margin: 0,
                  textTransform: "capitalize",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {authorName}
              </p>
            </div>

            {/* Date — never wraps, never shrinks */}
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                color: "#9ca3af",
                fontSize: "0.75rem",
                fontWeight: 500,
                margin: 0,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {date}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
}
