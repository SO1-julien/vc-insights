import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

// List of public routes that don't require authentication
const publicRoutes = ["/", "/api/auth/signin", "/api/auth/signout", "/api/auth/me"]

// List of admin-only routes
const adminRoutes = ["/admin", "/api/auth/test-admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname) || publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value

  // If no token, redirect to home page
  if (!token) {
    // For API routes, return 401 instead of redirecting
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Verify token
  const { valid, payload } = await verifyToken(token)

  // If token is invalid, redirect to home page
  if (!valid || !payload) {
    // For API routes, return 401 instead of redirecting
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check for admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route)) && payload.role !== "admin") {
    // For API routes, return 403 instead of redirecting
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    // Redirect non-admin users to portfolio page
    return NextResponse.redirect(new URL("/portfolio", request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
