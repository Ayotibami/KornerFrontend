"use client";

import { nunito } from "@/lib/font";

import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useStoryTheme } from "@/context/StoryThemeContext";

export default function StoriBottom({
  authorName,
  authorAvatar = "",
  authorBio,
  title = "",
  excerpt = "",
  shareUrl = "",
}: {
  authorName: string;
  authorAvatar?: string;
  authorBio: string;
  title?: string;
  excerpt?: string;
  shareUrl?: string;
}) {
  const { dark } = useStoryTheme();
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(shareUrl);

  useEffect(() => {
    setPageUrl(shareUrl || window.location.href);
  }, [shareUrl]);

  const encodedUrl = encodeURIComponent(pageUrl);
  const whatsappText = title
    ? `Oya, It's Kappy , I don come again with another stori . You know say na my own work be that . Abeg you no just waste time , grab hot kunu or zobo and then hop in\n\n*${title}*\n\n${excerpt}\n\n${pageUrl}`
    : pageUrl;
  const encodedText = encodeURIComponent(whatsappText);
  const kappyLine = "Oya, It's Kappy , I don come again with another stori . You know say na my own work be that . Abeg you no just waste time , grab hot kunu or zobo and then hop in";
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(kappyLine)}&url=${encodedUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodedText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const iconColor = dark ? "#6b8bb5" : "#0f1e3d";
  const headingColor = dark ? "#ccd6f6" : "#0f1e3d";
  const bioColor = dark ? "#4a6080" : "#767575";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "clamp(24px, 5vw, 48px)",
        backgroundColor: dark ? "#0a1628" : "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        padding: "clamp(20px, 5vw, 36px)",
        width: "100%",
        border: dark ? "1px solid rgba(59, 130, 246, 0.08)" : "none",
        boxShadow: dark
          ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "background-color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
      }}
    >
      {/* ── LEFT: About the author ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 260px", minWidth: 0 }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 800,
            color: headingColor,
            margin: 0,
            transition: "color 0.45s ease",
          }}
        >
          About the author
        </p>

        <div style={{ display: "flex", flexDirection: "row", gap: 14, alignItems: "center" }}>
          <div
            style={{
              width: "clamp(44px, 8vw, 56px)",
              height: "clamp(44px, 8vw, 56px)",
              borderRadius: "50%",
              backgroundColor: dark ? "#1a2f50" : "#e2e8f0",
              backgroundImage: authorAvatar ? `url("${authorAvatar}")` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
              boxShadow: dark ? "0 0 0 2px rgba(59,130,246,0.2)" : "none",
              transition: "box-shadow 0.45s ease, background-color 0.45s ease",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#00B2FF",
                margin: 0,
              }}
            >
              {authorName}
            </p>
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)",
                fontWeight: 500,
                color: bioColor,
                margin: 0,
                transition: "color 0.45s ease",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {authorBio}
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Share ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "0 0 auto" }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 800,
            color: headingColor,
            margin: 0,
            transition: "color 0.45s ease",
          }}
        >
          You like abi? Share it then
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "clamp(16px, 4vw, 28px)",
            alignItems: "center",
          }}
        >
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", color: iconColor, textDecoration: "none", transition: "color 0.45s ease" }}
          >
            <FaXTwitter size="clamp(1.2rem, 4vw, 1.6rem)" />
          </a>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", color: iconColor, textDecoration: "none", transition: "color 0.45s ease" }}
          >
            <FaWhatsapp size="clamp(1.2rem, 4vw, 1.6rem)" />
          </a>

          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", color: iconColor, textDecoration: "none", transition: "color 0.45s ease" }}
          >
            <FaFacebook size="clamp(1.2rem, 4vw, 1.6rem)" />
          </a>

          <div onClick={handleCopy} style={{ position: "relative", cursor: "pointer" }}>
            <LuLink size="clamp(1.2rem, 4vw, 1.6rem)" color={iconColor} style={{ transition: "color 0.45s ease" }} />
            {copied && (
              <span
                style={{
                  position: "absolute",
                  top: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: dark ? "#1e3a5f" : "#0f1e3d",
                  color: "white",
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  boxShadow: dark ? "0 2px 8px rgba(59,130,246,0.3)" : "none",
                }}
              >
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
