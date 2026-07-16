import { NextResponse } from "next/server";
import { cookies } from "next/headers";
 
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
 
    const token = (await cookies()).get("chaser_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
 
    const res = await fetch(`${process.env.BACKEND_URL}/api/threads/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
 
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("thread update route crashed:", err);
    return NextResponse.json({ error: "Internal error", detail: String(err) }, { status: 500 });
  }
}