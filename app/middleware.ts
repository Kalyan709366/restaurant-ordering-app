import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const session = req.cookies.get("sb-access-token");

  // allow access to login page
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
