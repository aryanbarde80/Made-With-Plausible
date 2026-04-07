import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/pricing", "/changelog", "/open", "/login", "/register", "/verify", "/2fa"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api") || pathname.startsWith("/share")) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
