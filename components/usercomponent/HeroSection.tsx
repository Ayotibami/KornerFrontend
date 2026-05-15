"use client";

import HeroText from "@/components/admincomponent/HeroText";
import Button from "@/components/admincomponent/Button";
import FloatingCards from "@/components/admincomponent/FloatingCards";
import { inter, nunito } from "@/lib/font";

export default function HeroSection() {
  return (
    <div
      style={{
        width: "95%",
        minHeight: "100vh",
        marginBottom: 60,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 36,
        backgroundImage: "url('/images/landingcover.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Centered hero copy */}
      <div
        style={{
          flexDirection: "column",
          width: "70%",
          gap: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HeroText>The Korner</HeroText>

        {/* Tagline */}
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "white",
            fontFamily: inter.style.fontFamily,
          }}
        >
          Kampos talks you listen
        </p>

        {/* Sub-description */}
        <p
          style={{
            textAlign: "center",
            color: "#C4C4C4",
            fontFamily: inter.style.fontFamily,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Korner's is that chill corner on Kampos where we just get student
          life. From late-night gist about love and grades to real talks on
          career, money, and culture — it's Kampos talking your talk, straight
          from our hearts to yours.
        </p>

        <Button>Hop into Korner</Button>
      </div>

      {/* Animated floating cards below the copy */}
      <FloatingCards />
    </div>
  );
}
