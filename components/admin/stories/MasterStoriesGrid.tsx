"use client";

import { useState } from "react";
import MasterStoryCard from "./MasterStoryCard";
import BulkActionBar from "./BulkActionBar";
import type { MasterStory } from "@/types/story";

export default function MasterStoriesGrid({
  stories,
  status,
}: {
  stories: MasterStory[];
  status: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => setSelectedIds(new Set(stories.map((s) => s.stori_id)));
  const clearAll = () => setSelectedIds(new Set());

  return (
    // Extra bottom padding when the bulk bar is visible so it doesn't cover cards
    <div className={selectedIds.size > 0 ? "pb-24" : ""}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3 sm:p-4 w-full">
        {stories.map((story) => (
          <MasterStoryCard
            key={story.stori_id}
            story={story}
            isSelected={selectedIds.has(story.stori_id)}
            onToggle={toggle}
          />
        ))}
      </div>
      <BulkActionBar
        selectedIds={[...selectedIds]}
        totalCount={stories.length}
        status={status}
        onSelectAll={selectAll}
        onClearAll={clearAll}
      />
    </div>
  );
}
