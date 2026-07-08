import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL ?? "";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";
  const search = request.nextUrl.searchParams.get("search") ?? "";

  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${BASE_URL}/user/subscribers/export${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Export failed" }, { status: res.status });
  }

  const csv = await res.text();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
