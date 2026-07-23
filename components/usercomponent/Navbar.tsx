import Image from "next/image";
import Link from "next/link";
import { nunito } from "@/lib/font";
import {
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";

const socials = [
  { icon: FaXTwitter, label: "X" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaWhatsapp, label: "WhatsApp" },
  { icon: FaEnvelope, label: "Email" },
];

export default function Navbar() {
  return (
    // Outer shelf: fixed full-width using pixel 0 values — immune to horizontal overflow expansion
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Inner pill: 95% of the shelf's pixel-computed width */}
      <div
        style={{
          width: "95%",
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(8px, 1.5vw, 12px) clamp(14px, 3vw, 24px)",
          borderRadius: 20,
          background: "rgba(22, 90, 191, 0.09)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(100, 160, 255, 0.35)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <style>{`
          .nav-socials { display: flex; }
          @media (max-width: 768px) { .nav-socials { display: none; } }
        `}</style>

        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Image
            src="/images/korner-logo-white.webp"
            alt="Korner"
            width={120}
            height={40}
            style={{
              width: "clamp(80px, 14vw, 120px)",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        <div className="nav-socials" style={{ gap: 28, alignItems: "center" }}>
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              style={{ color: "white", display: "flex", alignItems: "center" }}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image
            src="/images/logo.png"
            alt="Kampos logo"
            width={100}
            height={100}
            style={{
              objectFit: "contain",
              width: "clamp(28px, 5vw, 40px)",
              height: "auto",
            }}
          />
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            by Kampos
          </p>
        </div>
      </div>
    </div>
  );
}
