import { NextResponse } from "next/server";
import { cookies } from "next/headers";
 
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = (await cookies()).get("chaser_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
 
  const res = await fetch(`${process.env.BACKEND_URL}/api/voice-examples/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}