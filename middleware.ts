import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

// JWT secret key - in production, use a proper environment variable
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "your-jwt-secret-key"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

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

  // For admin routes, check the user role
  if (req.nextUrl.pathname.startsWith("/admin") && token) {
    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET)

      // Check if the user has admin role
      if (decoded.role !== "admin") {
        const redirectUrl = new URL("/portfolio", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Admin access check error:", error)
      const redirectUrl = new URL("/portfolio", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/portfolio/:path*", "/analytics/:path*", "/startup/:path*", "/admin/:path*"],
}
