import Airtable from "airtable"
import type { Startup } from "./airtable"

// Initialize Airtable with your API key
const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableBaseId = process.env.AIRTABLE_BASE_ID
const startupTableName = process.env.AIRTABLE_TABLE_NAME || "Startups"

// Create and configure Airtable instance with better error handling
const configureAirtable = () => {
  if (!airtableApiKey) {
    throw new Error("AIRTABLE_API_KEY is not defined")
  }

  if (!airtableBaseId) {
    throw new Error("AIRTABLE_BASE_ID is not defined")
  }

  try {
    Airtable.configure({
      apiKey: airtableApiKey,
      endpointUrl: "https://api.airtable.com",
      apiVersion: "0.1.0",
      noRetryIfRateLimited: false,
    })

    return Airtable.base(airtableBaseId)
  } catch (error) {
    console.error("Error configuring Airtable:", error)
    throw new Error(`Failed to configure Airtable: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Map Airtable record to Startup type
export const mapAirtableRecordToStartup = (record: any): Startup => {
  try {
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
  } catch (error) {
    console.error("Error mapping Airtable record:", error, record)
    throw new Error(`Failed to map Airtable record: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Get Airtable instance (with error handling)
export const getAirtableBase = () => {
  try {
    return configureAirtable()
  } catch (error) {
    console.error("Failed to get Airtable base:", error)
    throw error
  }
}

// Get Airtable table
export const getStartupsTable = () => {
  try {
    const base = getAirtableBase()
    if (!base) {
      throw new Error("Airtable base is null")
    }
    return base(startupTableName)
  } catch (error) {
    console.error("Failed to get Airtable table:", error)
    throw error
  }
}
