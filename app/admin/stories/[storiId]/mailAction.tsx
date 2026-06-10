"use server";

import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export type Mail = {
  mail_id: string;
  stori_id: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// GET — returns null when no mail exists for this story (404 is not an error here).
export async function getMail(storiId: string): Promise<ApiResult<Mail | null>> {
  try {
    const res = await apiRequest(`/stories/${storiId}/mail`);
    const data = await res.json();
    return { ok: true, data: data.mail ?? null };
  } catch (err: unknown) {
    if ((err as { status?: number }).status === 404) {
      return { ok: true, data: null };
    }
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load mail.";
    return { ok: false, status, message };
  }
}

export async function createMail(storiId: string, subject: string, body: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/stories/${storiId}/mail`, {
      method: "POST",
      body: JSON.stringify({ subject, body }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to create mail.";
    return { ok: false, status, message };
  }
}

export async function updateMail(storiId: string, subject: string, body: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/stories/${storiId}/mail`, {
      method: "PATCH",
      body: JSON.stringify({ subject, body }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to update mail.";
    return { ok: false, status, message };
  }
}

export async function deleteMail(storiId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/stories/${storiId}/mail`, { method: "DELETE" });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to delete mail.";
    return { ok: false, status, message };
  }
}
