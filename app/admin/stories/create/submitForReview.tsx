"use server";

import { apiRequest } from "@/lib/api";
import { redirect } from "next/navigation";
import type { ApiResult } from "@/types/api";
import type { EditorBlock } from "@/context/StoryEditorContext";

export default async function submitForReview(
  title: string,
  subtitle: string,
  excerpt: string,
  reading_time: string,
  cover_image: string | null,
  cover_image_public_id: string | undefined,
  blocks: EditorBlock[],
): Promise<ApiResult<void>> {
  let storiId: string;

  try {
    const createRes = await apiRequest("/stories/create", {
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

    const { data } = await createRes.json();
    storiId = data;
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to create story.";
    return { ok: false, status, message };
  }

  try {
    await apiRequest(`/stories/submit/${storiId}`, { method: "PATCH" });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to submit for review.";
    return { ok: false, status, message };
  }

  redirect("/admin/home");
}
