import { nunito } from "@/lib/font";
import Link from "next/link";
import Button from "@/components/admincomponent/Button";
import StoriCardList from "./StoriCardList";

// Shown at the bottom of an individual story page.
// Encourages the user to keep reading after finishing a story.
export default function OtherStories() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(20px, 4vw, 36px)",
        width: "100%",
        padding: "clamp(16px, 4vw, 32px) 0",
      }}
    >
      <h2
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1.3rem, 4vw, 2rem)",
          fontWeight: 800,
          color: "#0f1e3d",
          margin: 0,
          textAlign: "center",
        }}
      >
        You no go like see other Stories?
      </h2>

      {/* Shows 3 cards as a teaser — same limit used in PeepSection */}
      <StoriCardList limit={3} />

      {/* href="/stories#stories-list" navigates to the stories page AND scrolls
          directly to the story grid, skipping the hero section at the top. */}
      <Link href="/stories#stories-list" style={{ textDecoration: "none" }}>
        <Button inverted>See all stories</Button>
      </Link>
    </div>
  );
}
