import { cookies } from "next/headers";

export async function getCurrentUser() {
  const token = (await cookies()).get("chaser_token")?.value;
  if (!token) return null;
  const res = await fetch(`${process.env.BACKEND_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}