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

// Helper function to safely get related record data
const getRelatedRecord = (record: any, fieldName: string) => {
  const field = record.get(fieldName)

  // If the field is an array of objects with an 'id' property, it's a related record
  if (Array.isArray(field) && field.length > 0 && typeof field[0] === "object" && field[0].id) {
    return {
      id: field[0].id,
      name: field[0].name || "",
    }
  }

  // Return a default object if the field is not found or not in the expected format
  return { id: "", name: field || "" }
}

// Helper function to safely get array of related records
const getRelatedRecords = (record: any, fieldName: string) => {
  const field = record.get(fieldName)

  // If the field is an array of objects with an 'id' property, extract the names
  if (Array.isArray(field) && field.length > 0 && typeof field[0] === "object" && field[0].id) {
    return field.map((item) => item.name || "")
  }

  // Return the field as is if it's already an array of strings
  if (Array.isArray(field)) {
    return field
  }

  // Return an empty array if the field is not found or not in the expected format
  return []
}

// Convert Airtable record to Startup type
const convertAirtableRecord = (record: any): Startup => {
  return {
    id: record.id,
    name: record.get("name") || "",
    country: getRelatedRecord(record, "country"),
    category: getRelatedRecord(record, "category"),
    industry: getRelatedRecords(record, "industry"),
    description: record.get("description") || "",
    revenue: Number(record.get("revenue")) || 0,
    fundraising: Number(record.get("fundraising")) || 0,
    yearFounded: Number(record.get("yearFounded")) || 2020,
    employees: Number(record.get("employees")) || 0,
    analysisRating: Number(record.get("analysisRating")) || 0,
    analysisContent: record.get("analysisContent") || "",
    fundingStage: getRelatedRecord(record, "fundingStage"),
    productionDevelopmentStage: getRelatedRecord(record, "productionDevelopmentStage"),
    targetMarket: getRelatedRecords(record, "targetMarket"),
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
        filterByFormula: `SEARCH("${category.replace(/"/g, '\\"')}", {category})`,
      })
      .all()

    return records.map(convertAirtableRecord)
  } catch (error) {
    console.error("Error fetching startups by category from Airtable:", error)
    return []
  }
}
