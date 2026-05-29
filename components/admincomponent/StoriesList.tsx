import { fetchWithAuth } from "@/lib/fetchWithAuth";
import StoriCard from "./StoriCard";
import { nunito } from "@/lib/font";
import { primaryColor } from "@/app/constants/color";
import Link from "next/link";

type Stori = {
  stori_id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  cover_image: string;
  reading_time: string;
  status: string;
  created_at: string;
};

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 10vw, 80px) 24px",
        gap: 24,
        width: "100%",
      }}
    >
      {/* Desert SVG */}
      <svg
        viewBox="0 0 400 220"
        style={{ width: "clamp(240px, 60vw, 400px)", height: "auto" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky */}
        <rect width="400" height="220" fill="#FFF7ED" rx="20" />

        {/* Sun */}
        <circle cx="320" cy="55" r="30" fill="#FBBF24" opacity="0.9" />
        <circle cx="320" cy="55" r="22" fill="#FDE68A" />

        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <line
            key={i}
            x1={320 + Math.cos((angle * Math.PI) / 180) * 26}
            y1={55 + Math.sin((angle * Math.PI) / 180) * 26}
            x2={320 + Math.cos((angle * Math.PI) / 180) * 36}
            y2={55 + Math.sin((angle * Math.PI) / 180) * 36}
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        {/* Far dunes */}
        <ellipse cx="80" cy="180" rx="120" ry="40" fill="#F59E0B" opacity="0.4" />
        <ellipse cx="340" cy="185" rx="100" ry="35" fill="#F59E0B" opacity="0.4" />

        {/* Main ground */}
        <path d="M0 155 Q100 130 200 148 Q300 165 400 140 L400 220 L0 220 Z" fill="#D97706" />
        <path d="M0 165 Q80 145 180 158 Q280 172 400 150 L400 220 L0 220 Z" fill="#F59E0B" />
        <path d="M0 178 Q100 162 200 172 Q300 182 400 165 L400 220 L0 220 Z" fill="#FCD34D" />

        {/* Left cactus */}
        <rect x="68" y="108" width="10" height="52" rx="5" fill="#16A34A" />
        <rect x="48" y="122" width="30" height="8" rx="4" fill="#16A34A" />
        <rect x="44" y="110" width="10" height="22" rx="5" fill="#16A34A" />
        <rect x="78" y="128" width="28" height="8" rx="4" fill="#16A34A" />
        <rect x="96" y="116" width="10" height="22" rx="5" fill="#16A34A" />

        {/* Right tall cactus */}
        <rect x="298" y="95" width="12" height="65" rx="6" fill="#15803D" />
        <rect x="274" y="118" width="34" height="9" rx="4" fill="#15803D" />
        <rect x="270" y="104" width="12" height="26" rx="6" fill="#15803D" />
        <rect x="308" y="124" width="32" height="9" rx="4" fill="#15803D" />
        <rect x="328" y="110" width="12" height="26" rx="6" fill="#15803D" />

        {/* Small rocks */}
        <ellipse cx="150" cy="170" rx="12" ry="7" fill="#B45309" opacity="0.6" />
        <ellipse cx="255" cy="175" rx="8" ry="5" fill="#B45309" opacity="0.5" />
        <ellipse cx="190" cy="182" rx="6" ry="4" fill="#92400E" opacity="0.5" />

        {/* Tiny tumbleweeds */}
        <circle cx="130" cy="162" r="7" fill="none" stroke="#92400E" strokeWidth="1.5" opacity="0.5" />
        <line x1="125" y1="157" x2="135" y2="167" stroke="#92400E" strokeWidth="1" opacity="0.5" />
        <line x1="135" y1="157" x2="125" y2="167" stroke="#92400E" strokeWidth="1" opacity="0.5" />
      </svg>

      {/* Text */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            fontWeight: 800,
            color: "#0f1e3d",
            margin: 0,
          }}
        >
          You have no stories yet
        </p>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            fontWeight: 500,
            color: "#6B7280",
            margin: 0,
          }}
        >
          Go ahead and{" "}
          <Link
            href="/admin/stories/create"
            style={{ color: primaryColor, fontWeight: 700, textDecoration: "none" }}
          >
            create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default async function StoriesList({ status }: { status?: string }) {
  const res = await fetchWithAuth("/stories/adminstories");
  const data = await res.json();
  const allStories: Stori[] = data.stories ?? [];

  // filter client-side — no extra API call needed
  const stories = status
    ? allStories.filter((s) => s.status === status)
    : allStories;

  if (stories.length === 0) return <EmptyState />;

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        width: "100%",
        height: "100%",
        padding: 10,
      }}
    >
      {stories.map((stori) => (
        <StoriCard stori={stori} key={stori.stori_id} />
      ))}
    </div>
  );
}
