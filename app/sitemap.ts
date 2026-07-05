import type { MetadataRoute } from "next";
import { getPublicStories } from "@/lib/publicApi";

export const revalidate = 3600; // rebuild sitemap every hour

async function getAllStories() {
  const stories = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const { stories: batch, hasMore } = await getPublicStories(limit, offset);
    stories.push(...batch);
    if (!hasMore) break;
    offset += limit;
  }

  return stories;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const stories = await getAllStories();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/stories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${base}/stories/${story.slug}`,
    lastModified: story.created_at,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...storyRoutes];
}
