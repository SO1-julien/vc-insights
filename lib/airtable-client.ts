import Airtable from "airtable"
import type { Startup } from "./airtable"

// Initialize Airtable with your API key
const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableBaseId = process.env.AIRTABLE_BASE_ID
const startupTableName = process.env.AIRTABLE_TABLE_NAME || "Startups"

// Create and configure Airtable instance
const configureAirtable = () => {
  if (!airtableApiKey || !airtableBaseId) {
    throw new Error("Missing Airtable environment variables")
  }

  try {
    Airtable.configure({
      apiKey: airtableApiKey,
    })

    return Airtable.base(airtableBaseId)
  } catch (error) {
    throw new Error("Error configuring Airtable")
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

// Get Airtable instance
export const getAirtableBase = () => {
  return configureAirtable()
}

// Get Airtable table
export const getStartupsTable = () => {
  const base = getAirtableBase()
  if (!base) return null
  return base(startupTableName)
}
