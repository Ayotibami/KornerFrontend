"use client";

import HeroText from "@/components/admincomponent/HeroText";
import Button from "@/components/admincomponent/Button";
import FloatingCards from "@/components/admincomponent/FloatingCards";
import { nunito } from "@/lib/font";
import Link from "next/link";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    // Full-screen container with the landing cover image as background.
    // minHeight: "100vh" ensures it always fills the viewport even on tall screens.
    // backgroundSize: "cover" scales the image to always fill the div, cropping if needed.
    <div
      style={{
        width: "95%",
        minHeight: "100vh",
        marginBottom: 20,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 36,
        backgroundImage: "url('/images/landingcover1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navbar pinned to top of the hero */}
      <Navbar />

      {/* Text block grows to fill remaining space and centers itself vertically */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
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
      </div>

      {/* FloatingCards sits at the bottom of the hero and intentionally bleeds
          below it using marginBottom: -60. This makes the cards appear to float
          between the hero and the next section rather than being contained inside.
          zIndex: 10 keeps the cards above surrounding content. */}
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
