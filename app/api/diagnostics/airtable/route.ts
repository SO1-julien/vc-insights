import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-auth"
import Airtable from "airtable"

export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get environment variables
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || "Startups"

    // Check if environment variables are set
    const envCheck = {
      airtableApiKey: Boolean(airtableApiKey),
      airtableBaseId: Boolean(airtableBaseId),
      airtableTableName: airtableTableName,
    }

    // Try to connect to Airtable
    let connectionStatus = "Not tested"
    let recordCount = 0
    let error = null

    try {
      if (airtableApiKey && airtableBaseId) {
        // Configure Airtable
        Airtable.configure({
          apiKey: airtableApiKey,
          endpointUrl: "https://api.airtable.com",
          apiVersion: "0.1.0",
          noRetryIfRateLimited: false,
        })

        // Get base and table
        const base = Airtable.base(airtableBaseId)
        const table = base(airtableTableName)

        // Try to fetch records
        const records = await table.select().all()
        recordCount = records.length
        connectionStatus = "Success"
      } else {
        connectionStatus = "Failed - Missing environment variables"
      }
    } catch (err) {
      connectionStatus = "Failed"
      error = err instanceof Error ? err.message : String(err)
    }

    // Return diagnostic information
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      environmentVariables: envCheck,
      connectionStatus,
      recordCount,
      error,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Airtable diagnostics error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
