"use client";
// "use client" needed because of useState + useEffect for the greeting rotation animation
// and the scroll-into-view button (document.getElementById is a browser-only API).
//
// Split out of app/stories/page.tsx so that page can be an async Server
// Component (it needs to fetch the real story list) while this one piece
// stays interactive — a Server Component can render a Client Component
// directly, but can't itself use hooks, so the two responsibilities can't
// live in the same file once real data fetching is involved.

import Button from "@/components/admincomponent/Button";
import HeroText from "@/components/admincomponent/HeroText";
import { nunito } from "@/lib/font";
import { useEffect, useState } from "react";

// List of greetings in different Nigerian languages — cycles through them in the hero.
// Commented-out ones are unverified and kept here for future reference.
const greetings = [
  "How far", // Nigerian Pidgin
  "Bawo", // Yoruba
  "Kedu", // Igbo
  "Sannu", // Hausa
  "Migwo", // Urhobo
  "Emem", // Ibibio
];

export default function StoriesHero() {
  // index tracks which greeting is currently shown
  const [index, setIndex] = useState(0);
  // visible drives the fade-out/fade-in transition between greetings
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Every 2 seconds: fade out → swap greeting → fade in
    const interval = setInterval(() => {
      setVisible(false); // triggers CSS opacity transition to 0
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length); // move to next greeting, wraps around
        setVisible(true); // fade back in with new text
      }, 400); // 400ms matches the CSS transition duration so text swaps while invisible
    }, 2000);
    return () => clearInterval(interval); // cleanup on unmount
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
        backgroundImage: "url('/images/landingcover1.png')",
        marginBottom: 30,
        gap: 25,
        padding: "90px 20px 20px",
        boxSizing: "border-box",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Greeting text — opacity animates between 0 and 1 on each language swap */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
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
        }}
      >
        Welcome to the Kornerrrrrrrrrrrrrrrrrrrrr
      </p>

      {/* Clicking this button scrolls smoothly to the story list below. */}
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
  );
}
