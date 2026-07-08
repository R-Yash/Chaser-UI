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
}

export async function getThreads(source: "job" | "outreach"): Promise<ThreadDTO[]> {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/threads?source=${source}`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}