"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api";

type BulkResult<T> =
  | ({ ok: true } & T)
  | { ok: false; message: string };

export async function bulkPublishStories(
  storiIds: string[],
): Promise<BulkResult<{ published: number }>> {
  try {
    const res = await apiRequest("/master/stories/bulk-publish", {
      method: "POST",
      body: JSON.stringify({ storiIds }),
    });
    const data = await res.json();
    revalidatePath("/admin/stories");
    return { ok: true, published: data.published };
  } catch (err: unknown) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to publish" };
  }
}

export async function bulkDeleteStories(
  storiIds: string[],
): Promise<BulkResult<{ deleted: number }>> {
  try {
    const res = await apiRequest("/master/stories/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ storiIds }),
    });
    const data = await res.json();
    revalidatePath("/admin/stories");
    return { ok: true, deleted: data.deleted };
  } catch (err: unknown) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to delete" };
  }
}

export async function bulkUnpublishStories(
  storiIds: string[],
): Promise<BulkResult<{ unpublished: number }>> {
  try {
    const res = await apiRequest("/master/stories/bulk-unpublish", {
      method: "POST",
      body: JSON.stringify({ storiIds }),
    });
    const data = await res.json();
    revalidatePath("/admin/stories");
    return { ok: true, unpublished: data.unpublished };
  } catch (err: unknown) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to unpublish" };
  }
}

export async function bulkRejectStories(
  storiIds: string[],
): Promise<BulkResult<{ rejected: number }>> {
  try {
    const res = await apiRequest("/master/stories/bulk-reject", {
      method: "POST",
      body: JSON.stringify({ storiIds }),
    });
    const data = await res.json();
    revalidatePath("/admin/stories");
    return { ok: true, rejected: data.rejected };
  } catch (err: unknown) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to reject" };
  }
}
