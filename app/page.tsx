"use client";

// Root landing page — assembles all the landing sections in order top to bottom.
// Each section is a standalone component; this file just stacks them.
// The background color #f1f5f9 (light grey-blue) is the base behind all sections.

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
      {/* Full-screen hero: background image, big title, floating cards at bottom */}
      <HeroSection />

      {/* "Na your Korner" text blurb + the 2x2 animated icon grid */}
      <AboutSection />

      {/* Spacer between About and the torn dark section */}
      <div style={{ marginTop: 40 }} />

      {/* Dark torn-paper section showing 3 story card previews */}
      <PeepSection />

      {/* Testimonials section — placeholder visuals for now */}
      <Testimony />

      {/* Email subscription form — "Korner Effect" */}
      <ActivationForm />

      {/* Footer with link columns and social icons */}
      <Footer />
    </div>
  );
}
