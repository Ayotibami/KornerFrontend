"use server";

import { getPublicStories } from "@/lib/publicApi";
import type { PublicStorySummary } from "@/types/story";

export async function loadMoreStories(
  limit: number,
  offset: number,
): Promise<{ stories: PublicStorySummary[]; hasMore: boolean }> {
  return getPublicStories(limit, offset);
}
