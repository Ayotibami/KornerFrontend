"use server";

// Server actions for the Newsletter feature — compose/send, list, edit,
// and delete blasts via the /newsletter endpoints.

import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export type NewsletterStatus = "pending" | "sent";

export type NewsletterSend = {
  sendId: string;
  subject: string;
  status: NewsletterStatus;
  scheduledAt: string;
  sentAt: string | null;
};

export type NewsletterSendDetail = NewsletterSend & {
  body: string;
  imageUrl: string | null;
};

type RawSend = {
  send_id: string;
  subject: string;
  status: NewsletterStatus;
  scheduled_at: string;
  sent_at: string | null;
  body?: string;
  image_url?: string | null;
};

function mapSend(raw: RawSend): NewsletterSend {
  return {
    sendId: raw.send_id,
    subject: raw.subject,
    status: raw.status,
    scheduledAt: raw.scheduled_at,
    sentAt: raw.sent_at,
  };
}

// Count only (no subscriber list) — any admin can call this, used by the
// send-preview modal to show reach before a blast actually fires.
export async function getSubscriberCount(): Promise<ApiResult<number>> {
  try {
    const res = await apiRequest("/user/subscribers/count");
    const data = await res.json();
    return { ok: true, data: data.count ?? 0 };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load subscriber count.";
    return { ok: false, status, message };
  }
}

export async function sendNewsletter(
  subject: string,
  body: string,
  scheduledAt: string | null,
  imageUrl: string | null,
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/newsletter/send", {
      method: "POST",
      body: JSON.stringify({
        subject,
        body,
        image_url: imageUrl,
        ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
      }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to send newsletter.";
    return { ok: false, status, message };
  }
}

export async function getNewsletters(): Promise<ApiResult<NewsletterSend[]>> {
  try {
    const res = await apiRequest("/newsletter/sends");
    const data = await res.json();
    const sends = (data.sends ?? []) as RawSend[];
    return { ok: true, data: sends.map(mapSend) };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load newsletter history.";
    return { ok: false, status, message };
  }
}

export async function getNewsletter(sendId: string): Promise<ApiResult<NewsletterSendDetail>> {
  try {
    const res = await apiRequest(`/newsletter/sends/${sendId}`);
    const data = await res.json();
    const raw = data.send as RawSend;
    return { ok: true, data: { ...mapSend(raw), body: raw.body ?? "", imageUrl: raw.image_url ?? null } };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load newsletter.";
    return { ok: false, status, message };
  }
}

export async function updateNewsletter(
  sendId: string,
  subject: string,
  body: string,
  scheduledAt: string,
  imageUrl: string | null,
): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/newsletter/sends/${sendId}`, {
      method: "PATCH",
      // image_url is always sent as a definite string ("" clears it) rather than
      // omitted, since the edit modal always knows the full current state.
      body: JSON.stringify({ subject, body, scheduled_at: scheduledAt, image_url: imageUrl ?? "" }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to update newsletter.";
    return { ok: false, status, message };
  }
}

export async function deleteNewsletter(sendId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/newsletter/sends/${sendId}`, { method: "DELETE" });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to delete newsletter.";
    return { ok: false, status, message };
  }
}
