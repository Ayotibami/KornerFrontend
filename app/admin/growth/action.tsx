"use server";

// Server actions for the Growth dashboard — the two mutations the page
// needs (saving a KPI target, recording a push-subscriber snapshot).
// Everything else on this page is a plain GET, fetched directly via
// apiRequest() inside server components, same convention as the rest of
// the /admin/home cards.

import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";

export type TargetKpiKey =
  | "korner_stories_published"
  | "korner_views"
  | "korner_subscribers";

export type Target = {
  id: number;
  month: string;
  kpi_key: string;
  target_value: string | number;
  type: string | null;
  created_at: string;
  updated_at: string;
};

export async function upsertTarget(
  month: string,
  kpiKey: TargetKpiKey,
  targetValue: number,
  type?: string,
): Promise<ApiResult<Target>> {
  try {
    const res = await apiRequest("/master/targets", {
      method: "POST",
      body: JSON.stringify({ month, kpi_key: kpiKey, target_value: targetValue, type: type ?? null }),
    });
    const data = await res.json();
    return { ok: true, data: data.target };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to save target.";
    return { ok: false, status, message };
  }
}

export async function createPushSnapshot(count: number): Promise<ApiResult<void>> {
  try {
    await apiRequest("/master/push-subscribers/snapshot", {
      method: "POST",
      body: JSON.stringify({ count }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to save snapshot.";
    return { ok: false, status, message };
  }
}
