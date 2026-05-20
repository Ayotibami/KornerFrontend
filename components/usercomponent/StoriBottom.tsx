"use client";
// "use client" is required because this component uses useState (browser-only)
// and navigator.clipboard (browser-only API). Server components cannot do either.

import { nunito } from "@/lib/font";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { useState, useEffect } from "react";

export default function StoriBottom({
  authorName,
  authorAvatar = "",
  authorBio,
  title = "",   // story title — used as the pre-filled text when sharing to Twitter/WhatsApp
  shareUrl = "", // pass a specific URL to share; if not passed, falls back to the current page URL
}: {
  authorName: string;
  authorAvatar?: string;
  authorBio: string;
  title?: string;
  shareUrl?: string;
}) {
  // controls whether the "Copied!" tooltip is visible on the link icon
  const [copied, setCopied] = useState(false);

  // pageUrl holds the URL that gets shared/copied.
  // We use useEffect instead of a useState lazy initializer because Next.js SSR renders
  // the component on the server first — the lazy initializer runs on the server where
  // window doesn't exist, so pageUrl would start as "" and React would keep that value
  // through hydration, never updating it. The result: share links are empty for all users.
  // useEffect only runs on the client after hydration, so window.location.href is always available.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  const [pageUrl, setPageUrl] = useState(shareUrl);
  useEffect(() => {
    setPageUrl(shareUrl || window.location.href);
  }, [shareUrl]);

  // encodeURIComponent converts a string so it is safe to put inside a URL.
  // e.g. spaces become %20, slashes become %2F, so the URL doesn't break.
  const encodedUrl = encodeURIComponent(pageUrl);

  // WhatsApp takes a single "text" param that contains both title and URL together.
  // If a title exists we combine them: "Story Title https://thekorner.com/stories/..."
  // If no title, we just send the URL alone.
  const encodedText = encodeURIComponent(title ? `${title} ${pageUrl}` : pageUrl);

  // Each platform has a public web endpoint for sharing.
  // We construct the full URL by injecting our encoded story URL and title as query params.
  // Twitter accepts title and URL separately; WhatsApp wants them merged; Facebook only needs the URL.
  // (Facebook reads the page's og:title meta tag itself to build the preview — it ignores extra params.)
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodedText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Copies the page URL to the user's clipboard.
  // navigator.clipboard.writeText() returns a Promise, so we use .then() to know when it finishes.
  // Once copied, we show the "Copied!" tooltip for 2 seconds then hide it.
  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Shared style objects to avoid repeating the same properties on every icon/link
  const iconStyle = { color: "#0f1e3d", transition: "opacity 0.2s" };
  // linkStyle removes the default blue underline from <a> tags and makes icons align properly
  const linkStyle = { display: "flex", alignItems: "center", color: "#0f1e3d", textDecoration: "none" };

  return (
    // Outer container: two sections side by side (author left, share right).
    // flexWrap: "wrap" means on small screens they stack vertically instead of overflowing.
    // justifyContent: "space-between" pushes them to opposite edges when they are side by side.
    // flex: "0 0 auto" on each child means they only take as much width as their content needs —
    // this is what makes space-between actually work. If children had flex-grow they would fill
    // all space equally and there would be nothing left to distribute.
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "clamp(24px, 5vw, 48px)",
        backgroundColor: "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        padding: "clamp(20px, 5vw, 36px)",
        width: "100%",
      }}
    >
      {/* ── LEFT SECTION: About the author ── */}
      {/* flex: "0 0 auto" = don't grow, don't shrink, take natural width only */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "0 0 auto" }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 800,
            color: "#0f1e3d",
            margin: 0,
          }}
        >
          About the author
        </p>

        {/* Avatar + name/bio row */}
        <div style={{ display: "flex", flexDirection: "row", gap: 14, alignItems: "center" }}>

          {/* Avatar circle. Uses CSS background-image instead of <img> so we can
              style the circle shape directly on the container div.
              If no avatar URL is provided it shows a plain grey circle as placeholder. */}
          <div
            style={{
              width: "clamp(44px, 8vw, 56px)",
              height: "clamp(44px, 8vw, 56px)",
              borderRadius: "50%",
              backgroundColor: "#e2e8f0", // grey fallback shown when no avatar
              backgroundImage: authorAvatar ? `url("${authorAvatar}")` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0, // prevents the circle from squishing when space is tight
            }}
          />

          {/* Author name (blue italic) and bio (grey) stacked vertically */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                color: "#767575",
                margin: 0,
              }}
            >
              {authorBio}
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SECTION: Share icons ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "0 0 auto" }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 800,
            color: "#0f1e3d",
            margin: 0,
          }}
        >
          You like abi? Share it then
        </p>

        {/* Row of share icons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "clamp(16px, 4vw, 28px)",
            alignItems: "center",
          }}
        >
          {/* Each icon is wrapped in an <a> tag pointing to the platform's share endpoint.
              target="_blank" opens in a new tab so the user stays on our page.
              rel="noopener noreferrer" is a security best practice for all target="_blank" links —
              it prevents the opened tab from accessing our page via window.opener. */}

          <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaXTwitter size="clamp(1.2rem, 4vw, 1.6rem)" style={iconStyle} />
          </a>

          <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaWhatsapp size="clamp(1.2rem, 4vw, 1.6rem)" style={iconStyle} />
          </a>

          <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaFacebook size="clamp(1.2rem, 4vw, 1.6rem)" style={iconStyle} />
          </a>

          {/* Copy-link button — not an <a> tag because it doesn't navigate anywhere,
              it just copies to clipboard and shows a temporary tooltip */}
          <div onClick={handleCopy} style={{ position: "relative", cursor: "pointer" }}>
            <LuLink size="clamp(1.2rem, 4vw, 1.6rem)" color="#0f1e3d" />

            {/* "Copied!" tooltip — only rendered when copied === true.
                position: absolute lets it float above the icon without pushing other elements.
                translateX(-50%) centers it horizontally over the icon regardless of text width. */}
            {copied && (
              <span
                style={{
                  position: "absolute",
                  top: -28,       // sits 28px above the icon
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#0f1e3d",
                  color: "white",
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 6,
                  whiteSpace: "nowrap", // prevents "Copied!" from wrapping to two lines
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
