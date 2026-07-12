import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login-url`, { cache: "no-store" });
  const { url, state, code_verifier } = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, { httpOnly: true, maxAge: 600, path: "/" });
  cookieStore.set("oauth_verifier", code_verifier, { httpOnly: true, maxAge: 600, path: "/" });

  return NextResponse.redirect(url);
}