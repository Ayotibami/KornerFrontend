import StoriCard from "./StoriCard";
import { formatFullDate } from "@/lib/utils";
import type { PublicStorySummary } from "@/types/story";

// Plain presentational component — receives real story data from whichever
// server component fetched it (app/stories/page.tsx, OtherStories.tsx).
// No fetching here, so it works the same whether its parent is a client or
// server component.
//
// limit is optional — if passed, only that many stories are shown.
// Usage: <StoriCardList stories={stories} limit={3} /> shows 3, omit limit to show all.
export default function StoriCardList({
  stories,
  limit,
}: {
  stories: PublicStorySummary[];
  limit?: number;
}) {
  const visible = limit ? stories.slice(0, limit) : stories;

  return (
    // Responsive grid: repeat(auto-fit, minmax(clamp(250px, 30%, 400px), 1fr))
    // - auto-fit: creates as many columns as fit, but COLLAPSES any that end up
    //   empty and hands their share of space back to the real items — unlike
    //   auto-fill, which reserves those columns anyway and splits the leftover
    //   space across them too (invisibly starving the real cards). Matters here
    //   because this list sometimes renders far fewer items than could fit a
    //   row (e.g. the landing page's 3-card teaser) — auto-fill was quietly
    //   giving those cards less width than the same grid renders on /stories,
    //   which almost always has enough stories to fill every row anyway.
    // - clamp(250px, 30%, 400px): each column is at least 250px, max 400px, ideally 30% of container
    // - 30% as the preferred width caps columns at 3 (4 × 30% = 120% > 100%, impossible)
    // - 1fr: columns share leftover space equally after the minimum is met
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(clamp(250px, 30%, 400px), 1fr))",
        gap: "clamp(16px, 4vw, 28px)",
        width: "100%",
      }}
    >
      {visible.map((story) => (
        // href is passed to StoriCard so it can handle navigation itself
        // after the click-expand animation finishes (see StoriCard.tsx)
        <StoriCard
          key={story.stori_id}
          href={`/stories/${story.slug}`}
          image={story.cover_image}
          authorAvatar={story.author_avatar}
          authorName={story.author_name}
          title={story.title}
          excerpt={story.excerpt}
          date={formatFullDate(story.created_at)}
        />
      ))}
    </div>
  );
}
