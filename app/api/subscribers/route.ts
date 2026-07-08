import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL ?? "";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const limit = request.nextUrl.searchParams.get("limit") ?? "50";
  const offset = request.nextUrl.searchParams.get("offset") ?? "0";

  const query = new URLSearchParams({ limit, offset });
  if (search) query.set("search", search);

  const res = await fetch(`${BASE_URL}/user/subscribers?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
