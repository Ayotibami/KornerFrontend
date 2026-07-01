"use server";

// Server actions for the push page — sending an ad-hoc broadcast, plus
// reading back recent send history and per-send click-through stats.

import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export type PushSend = {
  id: number;
  title: string;
  stori_id: string | null;
  sent_at: string;
};

export type PushSendStats = {
  successful: number;
  converted: number;
};

export async function getPushSends(): Promise<ApiResult<PushSend[]>> {
  try {
    const res = await apiRequest("/master/push-sends");
    const data = await res.json();
    return { ok: true, data: data.pushSends ?? [] };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load push history.";
    return { ok: false, status, message };
  }
}

export async function getPushSendStats(id: number): Promise<ApiResult<PushSendStats>> {
  try {
    const res = await apiRequest(`/master/push-sends/${id}/stats`);
    const data = await res.json();
    return { ok: true, data: data.stats };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load push stats.";
    return { ok: false, status, message };
  }
}

export async function sendPushBroadcast(
  title: string,
  message: string,
  url?: string,
  imageUrl?: string,
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/master/push-broadcast", {
      method: "POST",
      body: JSON.stringify({ title, message, url: url || undefined, imageUrl: imageUrl || undefined }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const errMessage = err instanceof Error ? err.message : "Failed to send push notification.";
    return { ok: false, status, message: errMessage };
  }
}
