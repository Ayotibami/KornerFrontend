"use server";

// Autosave server actions — same logic as the manual save/create actions,
// but deliberately no revalidatePath calls. Manual saves invalidate the
// Next.js cache (acceptable — the user explicitly clicked a button).
// Autosave fires silently in the background every ~3 seconds; invalidating
// the cache that frequently is wasteful and unnecessary.

import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";
import type { EditorBlock } from "@/context/StoryEditorContext";

function mapBlocks(blocks: EditorBlock[]) {
  return blocks.map((b) => ({
    block_type: b.block_type,
    content: b.content,
    image_url: b.image_url,
    position: b.position,
    // b.id is a client-side UUID used as React key — never sent to the API
  }));
}

// Used by the edit page — keeps an existing story silently up to date
// without the user needing to click Save.
export async function autosaveExistingStory(
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
      body: JSON.stringify({ title, subtitle, excerpt, reading_time, cover_image, stori_blocks: mapBlocks(blocks) }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Autosave failed.";
    return { ok: false, status, message };
  }
}

// Used by the create page — creates a real Draft on first autosave trigger
// and returns the new storiId so subsequent autosaves can PATCH it instead.
export async function autosaveNewStory(
  title: string,
  subtitle: string,
  excerpt: string,
  reading_time: string,
  cover_image: string | null,
  blocks: EditorBlock[],
): Promise<ApiResult<{ storiId: string }>> {
  try {
    const res = await apiRequest("/stories/create", {
      method: "POST",
      body: JSON.stringify({ title, subtitle, excerpt, reading_time, cover_image, stori_blocks: mapBlocks(blocks) }),
    });
    const data = await res.json();
    return { ok: true, data: { storiId: data.data as string } };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Autosave failed.";
    return { ok: false, status, message };
  }
}
