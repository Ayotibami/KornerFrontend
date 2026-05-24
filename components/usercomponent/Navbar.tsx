import Image from "next/image";
import { nunito } from "@/lib/font";
import { FaXTwitter, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa6";

const socials = [
  { icon: FaXTwitter, label: "X" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaWhatsapp, label: "WhatsApp" },
  { icon: FaEnvelope, label: "Email" },
];

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(8px, 1.5vw, 12px) clamp(14px, 3vw, 24px)",
        width: "95%",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <style>{`
        .nav-socials { display: flex; }
        @media (max-width: 768px) { .nav-socials { display: none; } }
      `}</style>

      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1.2rem, 5vw, 2.1rem)",
          fontWeight: 800,
          color: "#fff",
          margin: 0,
        }}
      >
        Korner
      </p>

      <div
        className="nav-socials"
        style={{ gap: 28, alignItems: "center" }}
      >
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
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
          }}
        >
          by Kampos
        </p>
      </div>
    </div>
  );
}
