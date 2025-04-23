import { NextResponse } from "next/server"
import Airtable from "airtable"
import type { Startup } from "@/lib/startups"

// Initialize Airtable on the server side
const initAirtable = () => {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    console.error("Server: Airtable API key or base ID is missing")
    return null
  }

  return new Airtable({ apiKey }).base(baseId)
}

// Convert Airtable record to Startup type
const convertAirtableRecord = (record: any): Startup => {
  return {
    id: record.id,
    name: record.get("name") || "",
    country: record.get("country") || "",
    category: record.get("category") || "",
    industry: Array.isArray(record.get("industry")) ? record.get("industry") : [],
    description: record.get("description") || "",
    revenue: Number(record.get("revenue")) || 0,
    fundraising: Number(record.get("fundraising")) || 0,
    yearFounded: Number(record.get("yearFounded")) || 2020,
    employees: Number(record.get("employees")) || 0,
    analysisRating: Number(record.get("analysisRating")) || 0,
    analysisContent: record.get("analysisContent") || "",
    fundingStage: record.get("fundingStage") || "",
    productionDevelopmentStage: record.get("productionDevelopmentStage") || "",
    targetMarket: record.get("targetMarket") || "",
    customers: record.get("customers") || "",
    ARR: Number(record.get("ARR")) || 0,
    grossMargin: Number(record.get("grossMargin")) || 0,
    logo: record.get("logo") || "/placeholder.svg?height=80&width=80",
    url: record.get("url") || "",
  }
}

// GET handler to fetch a startup by name
export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const name = decodeURIComponent(params.name)

    const base = initAirtable()
    if (!base) {
      return NextResponse.json({ error: "Airtable connection not available" }, { status: 500 })
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName)
      .select({
        filterByFormula: `{name} = "${name.replace(/"/g, '\\"')}"`,
        maxRecords: 1,
      })
      .all()

    if (records.length === 0) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const startup = convertAirtableRecord(records[0])
    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error fetching startup by name from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch startup from Airtable" }, { status: 500 })
  }
}
