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
}

async function cookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function getThreads(category: "job" | "outreach" | "rejected"): Promise<ThreadDTO[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/threads?category=${category}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}