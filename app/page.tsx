// Root landing page — assembles all the landing sections in order top to bottom.
// Each section is a standalone component; this file just stacks them.
// The background color #f1f5f9 (light grey-blue) is the base behind all sections.
//
// No "use client" here — none of the interactivity in this file's own scope
// needs it (HeroSection/ActivationForm already declare it themselves where
// needed), and this needs to be a Server Component to fetch the real story
// list for PeepSection's preview cards.

import Navbar from "@/components/usercomponent/Navbar";
import HeroSection from "@/components/usercomponent/HeroSection";
import AboutSection from "@/components/usercomponent/AboutSection";
import PeepSection from "@/components/usercomponent/PeepSection";
import Testimony from "@/components/usercomponent/Testimony";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import { getPublicStories } from "@/lib/publicApi";

export default async function Home() {
  const stories = await getPublicStories();

  return (
    <div
      style={{
        paddingTop: 16,
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        flexDirection: "column",
      }}
    >
      <Navbar />

      {/* Full-screen hero: background image, big title, floating cards at bottom */}
      <HeroSection />

      {/* "Na your Korner" text blurb + the 2x2 animated icon grid */}
      <AboutSection />

      {/* Spacer between About and the torn dark section */}
      <div style={{ marginTop: 40 }} />

      {/* Dark torn-paper section showing 3 story card previews */}
      <PeepSection stories={stories} />

      {/* Testimonials section — placeholder visuals for now */}
      <Testimony />

      {/* Email subscription form — "Korner Effect" */}
      <ActivationForm />

      {/* Footer with link columns and social icons */}
      <Footer />
    </div>
  );
}
