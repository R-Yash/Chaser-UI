// src/app/api/threads/[id]/send-nudge/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("BACKEND_URL is:", process.env.BACKEND_URL);

    const token = (await cookies()).get("chaser_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = `${process.env.BACKEND_URL}/api/threads/${id}/send-nudge`;
    console.log("Fetching:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (err) {
    console.error("send-nudge route crashed:", err);
    return NextResponse.json({ error: "Internal error", detail: String(err) }, { status: 500 });
  }
}