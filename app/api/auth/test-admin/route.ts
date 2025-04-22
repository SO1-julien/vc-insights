import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: "You have admin access",
    })
  } catch (error) {
    console.error("Admin test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
