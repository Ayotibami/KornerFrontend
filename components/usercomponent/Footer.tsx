import { nunito } from "@/lib/font";
import {
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";
import Image from "next/image";

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
  { icon: FaXTwitter, label: "X" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaWhatsapp, label: "WhatsApp" },
  { icon: FaEnvelope, label: "Email" },
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
      {/* Top section: logo + link columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 40,
          alignItems: "start",
          marginBottom: 60,
        }}
      >
        {/* Logo */}
        <div>
          <Image
            src="/images/Icon.png"
            alt="Korner logo"
            width={80}
            height={80}
            style={{ objectFit: "contain", width: "clamp(60px, 8vw, 80px)", height: "auto" }}
          />
        </div>

        {/* Link columns */}
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

      {/* Divider */}
      <div style={{ borderTop: "1px solid #333", marginBottom: 28 }} />

      {/* Bottom bar: copyright + socials */}
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

        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
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
