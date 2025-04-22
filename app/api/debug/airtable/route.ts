import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-auth"
import { debugAirtableConfig } from "@/lib/airtable-client"

export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Debug info to return
    const debugInfo = {
      environment: process.env.NODE_ENV,
      airtableApiKeyExists: Boolean(process.env.AIRTABLE_API_KEY),
      airtableBaseIdExists: Boolean(process.env.AIRTABLE_BASE_ID),
      airtableTableName: process.env.AIRTABLE_TABLE_NAME || "Not set (using default 'Startups')",
      serverTime: new Date().toISOString(),
    }

    // Log to server console
    console.log("Airtable Debug Info (Server):", debugInfo)
    debugAirtableConfig()

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
