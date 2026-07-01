// Server component that fetches all stories and renders them as a grid of cards.
// apiRequest() throws ApiRequestError on non-2xx — propagates to error.tsx automatically.
// Grid uses CSS auto-fill with minmax(350px, 1fr) — adapts columns without media queries.

import { apiRequest } from "@/lib/api";
import StoryCard from "./StoryCard";
import StoriesEmptyState from "./StoriesEmptyState";
import type { Story } from "@/types/story";

export default async function StoriesList({ status }: { status?: string }) {
  const res = await apiRequest("/stories/adminstories");
  const data = await res.json();
  const allStories: Story[] = data.stories ?? [];

  const stories = status
    ? allStories.filter((s) => s.status === status)
    : allStories;

  if (stories.length === 0) return <StoriesEmptyState status={status} hasAnyStories={allStories.length > 0} />;

  return (
    <div
      className="grid gap-4 p-3 w-full"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
    >
      {stories.map((story) => (
        <StoryCard story={story} key={story.stori_id} />
      ))}
    </div>
  );
}
