import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Clear the auth cookie
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")

  return NextResponse.json({ success: true })
}
