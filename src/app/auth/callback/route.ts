import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("oauth_verifier")?.value;

  if (!code || !state || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state, code_verifier: codeVerifier }),
  });
  if (!res.ok) return NextResponse.redirect(new URL("/", request.url));

  const { token } = await res.json();
  cookieStore.set("chaser_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  cookieStore.delete("oauth_state");
  cookieStore.delete("oauth_verifier");

  return NextResponse.redirect(new URL("/dashboard", request.url));
}