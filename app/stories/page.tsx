// Server Component — fetches the real published-stories list so the grid
// below shows actual content instead of the old hardcoded placeholder array.
// The hero's greeting rotation + scroll button need browser hooks, so that
// piece alone lives in the client-only StoriesHero component.

import StoriesHero from "@/components/usercomponent/StoriesHero";
import AuxillaryText from "@/components/usercomponent/AuxillaryText";
import TornSection from "@/components/admincomponent/Tornsection";
import LoadMoreStories from "@/components/usercomponent/LoadMoreStories";
import { nunito } from "@/lib/font";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import Navbar from "@/components/usercomponent/Navbar";
import type { Metadata } from "next";
import { getPublicStories } from "@/lib/publicApi";

export const metadata: Metadata = {
  title: "Stories from The Korner — Kampos talks you listen",
  description:
    "Student life, real talk, straight from Kampos — browse all Korner stories.",
  openGraph: {
    title: "Stories from The Korner — Kampos talks you listen",
    description:
      "Student life, real talk, straight from Kampos — browse all Korner stories.",
    url: "/stories",
    type: "website",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "The Korner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories from The Korner — Kampos talks you listen",
    description:
      "Student life, real talk, straight from Kampos — browse all Korner stories.",
    images: ["/images/og-default.png"],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/stories`,
  },
};

const PAGE_SIZE = 20;

export default async function Page() {
  const { stories, hasMore } = await getPublicStories(PAGE_SIZE, 0);

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

      <div style={{ margin: "30px 0" }}>
        <AuxillaryText>
          Abeg it is spelt Korner o, na Kappy write the one wey dey for up
        </AuxillaryText>
      </div>

      {/* ── STORY LIST SECTION ──
          id="stories-list" is the anchor target for both the button above
          and the "See all stories" link in OtherStories. Clicking either scrolls here. */}
      <div id="stories-list">
        <TornSection contentPadding="40px clamp(16px, 3vw, 40px)">
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
            <LoadMoreStories
              initialStories={stories}
              initialHasMore={hasMore}
              pageSize={PAGE_SIZE}
            />
          </div>
        </TornSection>
      </div>

      <ActivationForm />
      <Footer />
    </div>
  );
}
