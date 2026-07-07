import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL ?? "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storiId: string }> },
) {
  const { storiId } = await params;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    await fetch(`${BASE_URL}/user/stories/${storiId}/view`, {
      method: "POST",
      headers: {
        "x-forwarded-for": ip,
        "user-agent": request.headers.get("user-agent") ?? "",
      },
    });
  } catch {
    // non-critical — don't surface view tracking errors to the reader
  }

  return NextResponse.json({ ok: true });
}
