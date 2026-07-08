// Fetch helper for the public, unauthenticated reader-facing pages
// (app/stories, app/stories/[storiId]). Deliberately separate from
// apiRequest in api.ts — that one always reads the auth_token cookie and
// attaches a Bearer header, which is wrong for an anonymous visitor and
// would throw a misleading "session expired" error on any failure.
//
// These are plain GET requests with no auth at all, matching the pattern
// already used for public/unauthenticated calls elsewhere in this app
// (e.g. the login/signup server actions, which also call fetch directly).

import type { PublicStoryDetail, PublicStorySummary } from "@/types/story";

const BASE_URL = process.env.API_URL ?? "";

// Listing is side-effect free, so it's fine to let Next cache it briefly —
// every visitor doesn't need a fresh DB hit on every page load.
export async function getPublicStories(
  limit = 20,
  offset = 0,
): Promise<{ stories: PublicStorySummary[]; hasMore: boolean }> {
  const res = await fetch(
    `${BASE_URL}/user/stories?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 30 } },
  );

  if (!res.ok) return { stories: [], hasMore: false };

  const data = await res.json();
  return { stories: data.stories ?? [], hasMore: data.hasMore ?? false };
}

// The single-story fetch increments the story's view count server-side as
// a side effect of this exact request — caching it would silently suppress
// real views, so this one is always fetched fresh.
export async function getPublicStory(storiId: string): Promise<PublicStoryDetail | null> {
  const res = await fetch(`${BASE_URL}/user/stories/${storiId}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load story (${res.status})`);

  const data = await res.json();
  return data.story;
}
