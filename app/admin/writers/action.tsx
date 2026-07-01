"use server";

// Server actions for the writers page — verify/unverify a specific admin,
// and fetch one admin's full detail (bio/email/role) for the detail modal.
// verify/unverify revalidate this page (not redirect) so the client gets
// ok:true back and can show a toast while staying put.

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api";
import type { ApiResult } from "@/types/api";
import type { AdminDetail } from "@/types/admin";

export async function getAdminDetail(adminId: string): Promise<ApiResult<AdminDetail>> {
  try {
    const res = await apiRequest(`/master/admins/${adminId}`);
    const data = await res.json();
    return { ok: true, data: data.admin };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load admin details.";
    return { ok: false, status, message };
  }
}

export async function verifyAdmin(adminId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/master/admins/${adminId}/verify`, { method: "PATCH" });
    revalidatePath("/admin/writers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to verify admin.";
    return { ok: false, status, message };
  }
}

export async function unverifyAdmin(adminId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/master/admins/${adminId}/unverify`, { method: "PATCH" });
    revalidatePath("/admin/writers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to unverify admin.";
    return { ok: false, status, message };
  }
}

export async function setAdminRole(
  adminId: string,
  role: "master" | "writer",
): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/master/admins/${adminId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    revalidatePath("/admin/writers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to update role.";
    return { ok: false, status, message };
  }
}

export async function deleteAdmin(adminId: string): Promise<ApiResult<void>> {
  try {
    await apiRequest(`/master/admins/${adminId}`, { method: "DELETE" });
    revalidatePath("/admin/writers");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to delete admin.";
    return { ok: false, status, message };
  }
}
