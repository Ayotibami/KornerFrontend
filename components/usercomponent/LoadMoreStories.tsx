"use client";

import { useState, useTransition } from "react";
import StoriCardList from "./StoriCardList";
import Button from "@/components/admincomponent/Button";
import type { PublicStorySummary } from "@/types/story";
import { loadMoreStories } from "@/app/stories/load-more-action";

export default function LoadMoreStories({
  initialStories,
  initialHasMore,
  pageSize,
}: {
  initialStories: PublicStorySummary[];
  initialHasMore: boolean;
  pageSize: number;
}) {
  const [stories, setStories] = useState(initialStories);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const result = await loadMoreStories(pageSize, stories.length);
      setStories((prev) => [...prev, ...result.stories]);
      setHasMore(result.hasMore);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        width: "100%",
      }}
    >
      <StoriCardList stories={stories} />

      {hasMore && (
        <div style={{ pointerEvents: isPending ? "none" : "auto", opacity: isPending ? 0.6 : 1 }}>
          <Button inverted onClick={loadMore}>
            {isPending ? "Loading…" : "Load more stories"}
          </Button>
        </div>
      )}
    </div>
  );
}
