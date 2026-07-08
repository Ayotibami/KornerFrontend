import Link from "next/link";
import Button from "@/components/admincomponent/Button";
import StoriCardList from "./StoriCardList";
import OtherStoriesHeading from "./OtherStoriesHeading";
import { getPublicStories } from "@/lib/publicApi";

// Shown at the bottom of an individual story page.
// Encourages the user to keep reading after finishing a story.
// excludeStoriId keeps the current story out of its own "other stories" list.
export default async function OtherStories({ excludeStoriId }: { excludeStoriId: string }) {
  // Fetch one extra so filtering out the current story still leaves 3
  const { stories: all } = await getPublicStories(4, 0);
  const stories = all.filter((s) => s.stori_id !== excludeStoriId);

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
      <OtherStoriesHeading />

      {/* Shows 3 cards as a teaser — same limit used in PeepSection */}
      <StoriCardList stories={stories} limit={3} />

      {/* href="/stories#stories-list" navigates to the stories page AND scrolls
          directly to the story grid, skipping the hero section at the top. */}
      <Link href="/stories#stories-list" style={{ textDecoration: "none" }}>
        <Button inverted>See all stories</Button>
      </Link>
    </div>
  );
}
