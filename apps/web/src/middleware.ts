import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Admin route protection (enforced in production only)
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    process.env.NODE_ENV === "production"
  ) {
    const session = request.auth;
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // TODO: Check admin role when DB is connected
    // const role = (session.user as any).role;
    // if (role !== "admin" && role !== "super_admin") {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  }

  // API rate limiting headers
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
