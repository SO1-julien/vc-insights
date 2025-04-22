import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Get the auth token from cookies
  const token = req.cookies.get("auth-token")?.value

  // Check authentication for protected routes
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/portfolio") ||
    req.nextUrl.pathname.startsWith("/analytics") ||
    req.nextUrl.pathname.startsWith("/startup") ||
    req.nextUrl.pathname.startsWith("/admin")

  if (isAuthRoute && !token) {
    const redirectUrl = new URL("/", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // For admin routes, we'll let the server component handle role verification
  // This simplifies the middleware and avoids using JWT verification here

  return NextResponse.next()
}

export const config = {
  matcher: ["/portfolio/:path*", "/analytics/:path*", "/startup/:path*", "/admin/:path*"],
}
