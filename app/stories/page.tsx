"use client";
// "use client" needed because of useState + useEffect for the greeting rotation animation

import Button from "@/components/admincomponent/Button";
import Image from "next/image";
import HeroText from "@/components/admincomponent/HeroText";
import TornSection from "@/components/admincomponent/Tornsection";
import StoriCardList from "@/components/usercomponent/StoriCardList";
import { nunito } from "@/lib/font";
import React, { useEffect, useState } from "react";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import AuxillaryText from "@/components/usercomponent/AuxillaryText";
import Navbar from "@/components/usercomponent/Navbar";

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

export default function Page() {
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        paddingTop: 20,
      }}
    >
      {/* ── HERO SECTION ── full-screen cover image with animated greeting + CTA */}
      <div
        style={{
          position: "relative",
          width: "95%",
          borderRadius: "clamp(16px, 4vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          height: "100vh",
          backgroundImage: "url('/images/landingcover1.png')",
          marginBottom: 30,
          padding: "20px",
          boxSizing: "border-box",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 25,
            width: "100%",
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
      </div>

      {/* Kappy mascot image */}
      <div
        style={{
          position: "relative",
          width: "clamp(220px, 55vw, 520px)",
          aspectRatio: "1 / 1",
        }}
      >
        <Image
          src="/images/kappyzobo.png"
          alt="Kappyzobo"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Cheeky note about the spelling of "Korner" */}
      <AuxillaryText>
        Abeg it is spelt Korner o , na Kappy write the one wey dey for up
      </AuxillaryText>

      {/* ── STORY LIST SECTION ──
          id="stories-list" is the anchor target for both the button above
          and the "See all stories" link in OtherStories. Clicking either scrolls here. */}
      <div id="stories-list">
        <TornSection>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "white",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Pick one na, No waste time!
            </h1>
            {/* No limit passed — shows all stories */}
            <StoriCardList />
          </div>
        </TornSection>
      </div>

      <ActivationForm />
      <Footer />
    </div>
  );
}
