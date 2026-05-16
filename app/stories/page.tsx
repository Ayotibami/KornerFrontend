"use client";
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

const greetings = [
  "How far", // Nigerian Pidgin
  "Bawo", // Yoruba
  "Kedu", // Igbo
  "Sannu", // Hausa
  // "Ojẹchẹ", // Igala — unverified
  // "Ite ni", // Ebira — unverified
  "Migwo", // Urhobo
  // "Doo", // Tiv
  // "Jam", // Fulfulde (Fulani)
  "Emem", // Ibibio
  // "Barka", // Nupe — likely Hausa, not Nupe
  // "Mọ̀dọ̀", // Efik — unverified
  // "Ẹ káàbọ̀", // Itsekiri — means "welcome" in Yoruba, not "hey"
  // "Wụ lawan", // Kanuri — unverified
  // "Eche", // Idoma — unverified
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
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
          backgroundImage: "url('/images/landingcover3.png')",
          marginBottom: 30,
          gap: 25,
          padding: "20px",
          boxSizing: "border-box",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
      <AuxillaryText>
        Abeg it is spelt Korner o , na Kappy write the one wey dey for up
      </AuxillaryText>

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
            <StoriCardList />
          </div>
        </TornSection>
      </div>
      <ActivationForm></ActivationForm>
      <Footer></Footer>
    </div>
  );
}
