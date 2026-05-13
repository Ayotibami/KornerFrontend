"use client";

import HeaderSocials from "@/components/HeaderSocials";
import HeroText from "@/components/HeroText";
import { useState } from "react";
import { Inter } from "next/font/google";

import Button from "@/components/Button";
import FloatingCards from "@/components/FloatingCards";
import { nunito } from "@/lib/font";
import AnimatedIconGrid from "./landing/Animatedicongrid";
import TornSection from "@/components/Tornsection";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional but common
});
export default function Home() {
  return (
    <div
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "95%",
          minHeight: "100vh",
          marginBottom: 200,

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
        {/* <HeaderSocials></HeaderSocials> */}
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
          <MainText></MainText>
          <DescriptionText></DescriptionText>
          <Button>Hop into Korner</Button>
        </div>
        <FloatingCards></FloatingCards>
      </div>

      {/* another section */}

      <div
        style={{
          padding: 20,
          borderRadius: 20,
          width: "95%",
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "60%",
          }}
        >
          <h1
            style={{
              color: "#000000",
              fontSize: 30,
              fontWeight: 800,
              fontFamily: nunito.style.fontFamily,
            }}
          >
            Na your Korner
          </h1>
          <p
            style={{
              color: "#767575",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: inter.style.fontFamily,
            }}
          >
            We write — you grab popcorn and read. It’s your corner. It’s your
            breather from all the campus buzz — the banters, the gist, the
            overload. Here, we slow things down and gist like friends who get
            it. Korner is where we share stories and talk about what really
            matters — love life, deadlines, broke moments, dreams, and
            everything in between
          </p>
        </div>
        <div>
          <AnimatedIconGrid></AnimatedIconGrid>
        </div>
      </div>

      {/* Peep section */}
      <div
        style={{
          marginTop: 40,
        }}
      ></div>
      <TornSection>
        <h1>Peep at this one fess</h1>
      </TornSection>
    </div>
  );
}

function MainText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 16,
        fontWeight: 500,
        color: "white",
        fontFamily: inter.style.fontFamily,
      }}
    >
      Kampos talks you listen
    </p>
  );
}

function DescriptionText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        textAlign: "center",
        color: "#C4C4C4",
        fontFamily: inter.style.fontFamily,
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      Korner’s is that chill corner on Kampos where we just get student life.
      From late-night gist about love and grades to real talks on career, money,
      and culture — it’s Kampos talking your talk, straight from our hearts to
      yours.
    </p>
  );
}
