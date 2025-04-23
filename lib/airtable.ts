import Airtable from "airtable"
import type { Startup } from "./startups"

// Initialize Airtable with environment variables
const initAirtable = () => {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    console.error("Airtable API key or base ID is missing")
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

// Fetch all startups from Airtable
export const fetchStartupsFromAirtable = async (): Promise<Startup[]> => {
  try {
    const base = initAirtable()
    if (!base) {
      console.error("Airtable connection not available")
      return []
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName).select().all()

    return records.map(convertAirtableRecord)
  } catch (error) {
    console.error("Error fetching startups from Airtable:", error)
    return []
  }
}

// Fetch a single startup by name
export const fetchStartupByNameFromAirtable = async (name: string): Promise<Startup | null> => {
  try {
    const base = initAirtable()
    if (!base) {
      console.error("Airtable connection not available")
      return null
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName)
      .select({
        filterByFormula: `{name} = "${name.replace(/"/g, '\\"')}"`,
        maxRecords: 1,
      })
      .all()

    if (records.length === 0) {
      return null
    }

    return convertAirtableRecord(records[0])
  } catch (error) {
    console.error("Error fetching startup by name from Airtable:", error)
    return null
  }
}

// Fetch startups by category
export const fetchStartupsByCategoryFromAirtable = async (category: string): Promise<Startup[]> => {
  try {
    const base = initAirtable()
    if (!base) {
      console.error("Airtable connection not available")
      return []
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName)
      .select({
        filterByFormula: `{category} = "${category.replace(/"/g, '\\"')}"`,
      })
      .all()

    return records.map(convertAirtableRecord)
  } catch (error) {
    console.error("Error fetching startups by category from Airtable:", error)
    return []
  }
}
