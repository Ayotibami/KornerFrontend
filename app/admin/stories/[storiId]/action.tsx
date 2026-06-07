"use server";

// Server actions and types for the story edit page.
//
// Why a local StoriDetail type instead of using types/story.ts?
//   The single-story API endpoint returns camelCase field names (readingTime, coverImage,
//   blockId, blockType) while the list endpoint uses snake_case (reading_time, cover_image).
//   This separate type reflects the actual shape the backend returns for this endpoint.
//   Note: `image_url` in StoriBlock stays snake_case — that's what the backend sends.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";
import type { EditorBlock } from "@/context/StoryEditorContext";

export type StoriBlock = {
  blockId: string;
  blockType: string;
  content: string;
  image_url: string;
  position: number;
};

export type StoriDetail = {
  title: string;
  subtitle: string;
  excerpt: string;
  readingTime: string;
  coverImage?: string | null;
  status: string;
  blocks: StoriBlock[];
};

// Fetches a single story for editing.
// Returns null on 404 so the page can call notFound() cleanly.
// Re-throws all other errors — they propagate to the nearest error.tsx.
export async function getStori(storiId: string): Promise<StoriDetail | null> {
  try {
    const res = await apiRequest(`/stories/adminstori/${storiId}`);
    const data = await res.json();
    return data.stori ?? null;
  } catch (err: unknown) {
    if ((err as { status?: number }).status === 404) return null;
    throw err; // non-404 errors (500, network failures) go to error.tsx
  }
}

// Updates an existing story via PATCH.
// Returns ApiResult<void> so the client can show success/error toasts.
// Unlike createStory, this doesn't redirect on success — the admin stays
// on the edit page so they can keep making changes.
export async function updateStory(
  storiId: string,
  title: string,
  subtitle: string,
  excerpt: string,
  reading_time: string,
  cover_image: string | null,
  blocks: EditorBlock[],
): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/stories/${storiId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        subtitle,
        excerpt,
        reading_time,
        cover_image,
        stori_blocks: blocks.map((b) => ({
          block_type: b.block_type,
          content: b.content,
          image_url: b.image_url,
          position: b.position,
          // `b.id` is client-only — not sent to the API
        })),
      }),
    });
    revalidatePath("/admin/home");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return { ok: false, status, message };
  }
}

export async function submitStoryForReview(storiId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/stories/submit/${storiId}`, { method: "PATCH" });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to submit for review.";
    return { ok: false, status, message };
  }

  redirect("/admin/home");
}
