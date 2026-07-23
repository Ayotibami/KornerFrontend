"use client";

import HeroText from "@/components/admincomponent/HeroText";
import Button from "@/components/admincomponent/Button";
import FloatingCards from "@/components/admincomponent/FloatingCards";
import { nunito } from "@/lib/font";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div
      style={{
        position: "relative",
        width: "95%",
        minHeight: "100vh",
        marginBottom: 20,
        padding: "90px 10px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 36,
        backgroundColor: "#0f1e3d",
      }}
    >
      {/* Faint doodle layer — image at 10% so it reads as texture, not foreground */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/landingcover1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.25,
          borderRadius: 36,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flexDirection: "column",
          width: "70%",
          gap: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HeroText>The Korner</HeroText>

        <p
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "white",
            fontFamily: nunito.style.fontFamily,
          }}
        >
          Kampos talks you listen
        </p>

        <p
          style={{
            textAlign: "center",
            color: "#C4C4C4",
            fontFamily: nunito.style.fontFamily,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Korner&apos;s is that chill corner on Kampos where we just get student
          life. From late-night gist about love and grades to real talks on
          career, money, and culture — it&apos;s Kampos talking your talk, straight
          from our hearts to yours.
        </p>

        <Link href="/stories" style={{ textDecoration: "none" }}>
          <Button>Hop into Korner</Button>
        </Link>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginBottom: -60,
          width: "100%",
        }}
      >
        <FloatingCards />
      </div>
    </div>
  );
}
