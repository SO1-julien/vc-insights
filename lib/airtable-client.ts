import Airtable from "airtable"
import type { Startup } from "./airtable"

// Initialize Airtable with your API key
const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableBaseId = process.env.AIRTABLE_BASE_ID
const startupTableName = process.env.AIRTABLE_TABLE_NAME || "Startups"

// Debug function to help identify environment variable issues
export function debugAirtableConfig() {
  console.log("Airtable Environment Variables:")
  console.log(`AIRTABLE_API_KEY exists: ${Boolean(process.env.AIRTABLE_API_KEY)}`)
  console.log(`AIRTABLE_BASE_ID exists: ${Boolean(process.env.AIRTABLE_BASE_ID)}`)
  console.log(`AIRTABLE_TABLE_NAME: ${process.env.AIRTABLE_TABLE_NAME || "Not set (using default 'Startups')"}`)

  // Check if we're in a server component or API route
  console.log(`Running in: ${typeof window === "undefined" ? "Server" : "Client"} context`)

  // Check Node.js environment
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
}

// Create and configure Airtable instance with better error handling
const configureAirtable = () => {
  // Debug environment variables in development
  if (process.env.NODE_ENV !== "production") {
    debugAirtableConfig()
  }

  if (!airtableApiKey) {
    console.warn("AIRTABLE_API_KEY is not defined - using mock data")
    return null
  }

  if (!airtableBaseId) {
    console.warn("AIRTABLE_BASE_ID is not defined - using mock data")
    return null
  }

  try {
    Airtable.configure({
      apiKey: airtableApiKey,
    })

    return Airtable.base(airtableBaseId)
  } catch (error) {
    console.error("Error configuring Airtable:", error)
    return null
  }
}

// Map Airtable record to Startup type
export const mapAirtableRecordToStartup = (record: any): Startup => {
  return {
    id: record.id,
    name: record.get("name") || "",
    country: record.get("country") || "",
    category: record.get("category") || "",
    industry: Array.isArray(record.get("industry")) ? record.get("industry") : [],
    description: record.get("description") || "",
    revenue: Number(record.get("revenue")) || 0,
    fundraising: Number(record.get("fundraising")) || 0,
    yearFounded: Number(record.get("yearFounded")) || 0,
    employees: Number(record.get("employees")) || 0,
    analysisRating: Number(record.get("analysisRating")) || 0,
    analysisContent: record.get("analysisContent") || "",
    fundingStage: record.get("fundingStage") || "",
    productionDevelopmentStage: record.get("productionDevelopmentStage") || "",
    targetMarket: record.get("targetMarket") || "",
    customers: record.get("customers") || "",
    ARR: Number(record.get("ARR")) || 0,
    grossMargin: Number(record.get("grossMargin")) || 0,
    logo: record.get("logo") ? record.get("logo")[0]?.url || "" : "/placeholder.svg?height=80&width=80",
    url: record.get("url") || "",
  }
}

// Get Airtable instance (with error handling)
export const getAirtableBase = () => {
  return configureAirtable()
}

// Get Airtable table
export const getStartupsTable = () => {
  const base = getAirtableBase()
  if (!base) return null
  return base(startupTableName)
}
