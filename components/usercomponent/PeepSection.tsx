import TornSection from "@/components/admincomponent/Tornsection";
import StoriCardList from "@/components/usercomponent/StoriCardList";
import { nunito } from "@/lib/font";
import Button from "../admincomponent/Button";
import Link from "next/link";
import type { PublicStorySummary } from "@/types/story";

export default function PeepSection({ stories }: { stories: PublicStorySummary[] }) {
  return (
    // TornSection wraps content in a dark navy background with a torn-paper
    // edge at the top and bottom — gives the visual effect of a ripped page.
    <TornSection>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontFamily: nunito.style.fontFamily,
            fontWeight: 800,
            marginBottom: 30,
          }}
        >
          Peep at this one fess
        </h1>

        {/* limit={3} shows only the first 3 stories as a teaser.
            The full list is on the /stories page. */}
        <StoriCardList stories={stories} limit={3} />
      </div>

      {/* CTA button below the cards — navigates to the full stories page */}
      <div
        style={{
          marginTop: 50,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link href="/stories" style={{ textDecoration: "none" }}>
          <Button>Hop into Korner</Button>
        </Link>
      </div>
    </TornSection>
  );
}
