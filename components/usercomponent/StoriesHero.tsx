"use client";

import Button from "@/components/admincomponent/Button";
import HeroText from "@/components/admincomponent/HeroText";
import { nunito } from "@/lib/font";
import { useEffect, useState } from "react";

const greetings = [
  "How far", // Nigerian Pidgin
  "Bawo",    // Yoruba
  "Kedu",    // Igbo
  "Sannu",   // Hausa
  "Migwo",   // Urhobo
  "Emem",    // Ibibio
];

export default function StoriesHero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "95%",
        borderRadius: "clamp(16px, 4vw, 36px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#0f1e3d",
        marginBottom: 30,
        gap: 25,
        padding: "90px 20px 20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Faint doodle layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/landingcover1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
          position: "relative",
          zIndex: 1,
        }}
      >
        <HeroText>{greetings[index]}</HeroText>
      </div>

      <p
        style={{
          color: "white",
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
          fontWeight: 500,
          textAlign: "center",
          padding: "0 1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        Welcome to the Kornerrrrrrrrrrrrrrrrrrrrr
      </p>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Button
          onClick={() =>
            document
              .getElementById("stories-list")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Oya check our stories
        </Button>
      </div>
    </div>
  );
}
