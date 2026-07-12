import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = (await cookies()).get("chaser_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const res = await fetch(`${process.env.BACKEND_URL}/api/threads/${params.id}/send-nudge`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}