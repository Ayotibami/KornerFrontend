import Image from "next/image";
import { nunito } from "@/lib/font";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(8px, 1.5vw, 12px) clamp(14px, 3vw, 24px)",
        marginTop: 10,
        marginBottom: 10,
        width: "95%",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Image
        src="/images/logo.png"
        alt="Korner logo"
        width={100}
        height={100}
        style={{
          objectFit: "contain",
          width: "clamp(32px, 8vw, 48px)",
          height: "auto",
        }}
      />

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
    </div>
  );
}
