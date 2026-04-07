import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=sso_invalid_callback", url));
  }

  return NextResponse.redirect(new URL("/login?notice=sso_callback_received", url));
}
