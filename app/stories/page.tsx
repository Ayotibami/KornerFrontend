// Server Component — fetches the real published-stories list so the grid
// below shows actual content instead of the old hardcoded placeholder array.
// The hero's greeting rotation + scroll button need browser hooks, so that
// piece alone lives in the client-only StoriesHero component.

import Image from "next/image";
import StoriesHero from "@/components/usercomponent/StoriesHero";
import TornSection from "@/components/admincomponent/Tornsection";
import StoriCardList from "@/components/usercomponent/StoriCardList";
import { nunito } from "@/lib/font";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import AuxillaryText from "@/components/usercomponent/AuxillaryText";
import Navbar from "@/components/usercomponent/Navbar";
import { getPublicStories } from "@/lib/publicApi";

export default async function Page() {
  const stories = await getPublicStories();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        paddingTop: 16,
      }}
    >
      <Navbar />

      {/* ── HERO SECTION ── full-screen cover image with animated greeting + CTA */}
      <StoriesHero />

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
            <StoriCardList stories={stories} />
          </div>
        </TornSection>
      </div>

      <ActivationForm />
      <Footer />
    </div>
  );
}
