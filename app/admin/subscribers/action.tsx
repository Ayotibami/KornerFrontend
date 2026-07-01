"use server";

// Server action for the subscribers page — removes one subscriber from the
// kornereffect mailing list. Reuses the existing public DELETE /unsubscribe
// endpoint (it just takes an email, no auth check on it currently) rather
// than needing a new master-specific delete route.

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export async function removeSubscriber(email: string): Promise<ApiResult<void>> {
  try {
    await apiRequest("/user/unsubscribe", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
    revalidatePath("/admin/subscribers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to remove subscriber.";
    return { ok: false, status, message };
  }
}
