import { cookies } from "next/headers";

export interface ThreadDTO {
  id: number;
  company: string | null;
  role: string | null;
  contact_email: string;
  contact_name: string | null;
  status: string;
  last_type: string;
  source: "job" | "outreach";
  last_message_at: string;
  created_at: string;
  snippet: string;
  message_count: number;
  draft_nudge: string | null;
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