"use server";

// Server action for creating a new story (called from the create page).
// Sends a POST request to the backend with all story fields and blocks.
// On success: redirects to the home page (the redirect is the success signal —
//   there's no explicit "ok: true" return because redirect() never returns).
// On failure: returns ApiResult<void> with ok: false so the page can show a toast.
//
// Why redirect() is outside the try/catch:
//   Next.js redirect() works by throwing an internal exception.
//   If it's inside a catch block, the catch would intercept and swallow it.
//   Pattern: do all fallible async work inside try/catch, then redirect() after.
//
// The blocks array is mapped to only include the fields the API expects —
// the client-side `id` field (used for React keys) is intentionally excluded.

import { apiRequest } from "@/lib/api";
import { redirect } from "next/navigation";
import type { ApiResult } from "@/types/api";
import type { EditorBlock } from "@/context/StoryEditorContext";

export default async function createStory(
  title: string,
  subtitle: string,
  excerpt: string,
  reading_time: string,
  cover_image: string | null,
  cover_image_public_id: string | undefined,
  blocks: EditorBlock[],
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/stories/create", {
      method: "POST",
      body: JSON.stringify({
        title,
        subtitle,
        excerpt,
        reading_time,
        cover_image,
        cover_image_public_id: cover_image_public_id ?? null,
        stori_blocks: blocks.map((b) => ({
          block_type: b.block_type,
          content: b.content,
          image_url: b.image_url,
          image_public_id: b.image_public_id ?? null,
          position: b.position,
        })),
      }),
    });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return { ok: false, status, message };
  }

  redirect("/admin/home");
}
