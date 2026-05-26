import Image from "next/image";
import { primaryColor } from "@/app/constants/color";

export default function AuthBranding({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            backgroundColor: primaryColor,
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Kampos logo"
            width={28}
            height={28}
            style={{ objectFit: "contain" }}
          />
        </div>
        <p
          style={{
            fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
            fontWeight: 600,
            color: "rgba(0,0,0,0.4)",
            margin: 0,
          }}
        >
          by Kampos
        </p>
      </div>

      <h1
        style={{
          fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
          fontWeight: 800,
          color: primaryColor,
          margin: 0,
          textAlign: "center",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
          fontWeight: 500,
          color: "#6B7280",
          margin: 0,
          textAlign: "center",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
