import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function authHeader() {
  const token = (await cookies()).get("chaser_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export async function GET() {
  const auth = await authHeader();
  if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const res = await fetch(`${process.env.BACKEND_URL}/api/voice-examples`, { headers: auth });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const auth = await authHeader();
  if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const res = await fetch(`${process.env.BACKEND_URL}/api/voice-examples`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}