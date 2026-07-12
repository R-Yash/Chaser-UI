import { cookies } from "next/headers";

export interface ThreadDTO {
  id: number;
  company: string | null;
  role: string | null;
  contact_email: string;
  status: string;
  last_type: string;
  source: "job" | "outreach";
  last_message_at: string;
  snippet: string;
  draft_nudge: string | null;
}

async function cookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function getThreads(category: "job" | "outreach" | "rejected"): Promise<ThreadDTO[]> {
  const token = (await cookies()).get("chaser_token")?.value;
  if (!token) return [];
  const res = await fetch(`${process.env.BACKEND_URL}/api/threads?category=${category}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}