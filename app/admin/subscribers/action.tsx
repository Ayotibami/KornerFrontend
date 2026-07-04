"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export async function removeSubscriber(email: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/master/subscribers/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    revalidatePath("/admin/subscribers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to remove subscriber.";
    return { ok: false, status, message };
  }
}
