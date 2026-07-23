import { nunito } from "@/lib/font";
import {
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";
import Image from "next/image";

// Link columns data — each array is one column in the footer grid.
// href values are empty strings for now; fill them in when the pages exist.
const linkColumns = [
  [
    { label: "Contact us", href: "" },
    { label: "About us", href: "" },
    { label: "Terms and conditions", href: "" },
  ],
  [
    { label: "Bug report", href: "" },
    { label: "Feature Requests", href: "" },
    { label: "Support center", href: "" },
  ],
  [{ label: "Privacy Policy", href: "" }],
];

const socials = [
  { icon: FaXTwitter,   label: "X",         href: "https://x.com/Kamposapp" },
  { icon: FaInstagram,  label: "Instagram",  href: "https://instagram.com/Kamposapp" },
  { icon: FaWhatsapp,   label: "WhatsApp",   href: "https://wa.me/2349110210657?text=Hey%20Kappy%2C%20my%20name%20is%20" },
  { icon: FaEnvelope,   label: "Email",      href: "mailto:kamposkonnect@gmail.com" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111111",
        width: "100%",
        padding: "60px 40px 32px",
        boxSizing: "border-box",
        marginTop: 50,
      }}
    >
      {/* Top section: logo on the left + link columns filling the rest.
          auto-fit with minmax(140px, 1fr) makes columns wrap naturally on small screens. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 40,
          alignItems: "start",
          marginBottom: 60,
        }}
      >
        {/* Logo + By Kampos label */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <Image
            src="/images/Icon.png"
            alt="Korner logo"
            width={80}
            height={80}
            style={{ objectFit: "contain", width: "clamp(60px, 8vw, 80px)", height: "auto" }}
          />
          <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: nunito.style.fontFamily, fontSize: "0.75rem", fontWeight: 500, margin: 0 }}>
            By Kampos
          </p>
        </div>

        {/* Render each column of links from the linkColumns array above.
            href || "#" falls back to "#" so clicking doesn't break if href is empty. */}
        {linkColumns.map((col, ci) => (
          <div
            key={ci}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {col.map((link) => (
              <a
                key={link.label}
                href={link.href || "#"}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontFamily: nunito.style.fontFamily,
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Horizontal divider between top and bottom bar */}
      <div style={{ borderTop: "1px solid #333", marginBottom: 28 }} />

      {/* Bottom bar: copyright left, social icons right.
          flexWrap: wrap allows them to stack on very small screens.
          new Date().getFullYear() always shows the current year automatically. */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <p
          style={{
            color: "white",
            fontFamily: nunito.style.fontFamily,
            fontSize: "0.875rem",
            fontWeight: 400,
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Ayoti. All rights reserved.
        </p>

        {/* Social icons — aria-label makes them accessible to screen readers
            since there's no visible text, only an icon. */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", display: "flex", alignItems: "center" }}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
