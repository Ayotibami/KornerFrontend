"use client";

import HeroSection from "@/components/usercomponent/HeroSection";
import AboutSection from "@/components/usercomponent/AboutSection";
import PeepSection from "@/components/usercomponent/PeepSection";
import Button from "@/components/admincomponent/Button";
import Testimony from "@/components/usercomponent/Testimony";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";

export default function Home() {
  return (
    <div
      style={{
        paddingTop: 10,
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        flexDirection: "column",
      }}
    >
      {/* Full-screen hero with background image and floating cards */}
      <HeroSection />

      {/* "Na your Korner" blurb + animated icon grid */}
      <AboutSection />

      {/* Spacer */}
      <div style={{ marginTop: 40 }} />

      {/* Torn dark section with story card previews */}
      <PeepSection />

      <Testimony></Testimony>

      <ActivationForm></ActivationForm>

      <Footer></Footer>
    </div>
  );
}
