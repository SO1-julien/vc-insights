import Airtable from "airtable"
import type { Startup } from "./startups"

// Simple in-memory cache for related records
const relatedRecordCache: Record<string, any> = {}

// Initialize Airtable with environment variables
export const initAirtable = () => {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    console.error("Airtable API key or base ID is missing")
    return null
  }

  return new Airtable({ apiKey }).base(baseId)
}

// Fetch a record from a related table with caching
const fetchRelatedRecordName = async (base: any, tableName: string, recordId: string): Promise<string> => {
  const cacheKey = `${tableName}:${recordId}`
  // Return from cache if available
  if (relatedRecordCache[cacheKey]) {
    return relatedRecordCache[cacheKey]
  }

  try {
    const record = await base(tableName).find(recordId)
    const name = record.get("name") || "Unknown"
    // Store in cache
    relatedRecordCache[cacheKey] = name

    return name
  } catch (error) {
    console.error(`Error fetching related record from ${tableName}:`, error)
    return "Unknown"
  }
}

// Fetch multiple records from a related table with caching
const fetchRelatedRecordNames = async (base: any, tableName: string, recordIds: string[]): Promise<string[]> => {
  // Check which records we need to fetch (not in cache)
  const recordsToFetch = recordIds.filter((id) => !relatedRecordCache[`${tableName}:${id}`])

  if (recordsToFetch.length > 0) {
    try {
      // Create a formula to find records with the given IDs
      const formula = `OR(${recordsToFetch.map((id) => `RECORD_ID()='${id}'`).join(",")})`

      const records = await base(tableName)
        .select({
          filterByFormula: formula,
        })
        .all()

      // Store fetched records in cache
      records.forEach((record) => {
        relatedRecordCache[`${tableName}:${record.id}`] = record.get("name") || "Unknown"
      })
    } catch (error) {
      console.error(`Error fetching related records from ${tableName}:`, error)
      // Set default values for records that couldn't be fetched
      recordsToFetch.forEach((id) => {
        relatedRecordCache[`${tableName}:${id}`] = "Unknown"
      })
    }
  }

  // Return the names from cache in the same order as the input IDs
  return recordIds.map((id) => {
    const cached = relatedRecordCache[`${tableName}:${id}`]
    return cached || "Unknown"
  })
}

// Helper function to safely get related record name
export const getRelatedRecordName = async (base: any, record: any, fieldName: string): Promise<string> => {
  const field = record.get(fieldName)
  // If the field is an array of objects with an 'id' property, it's a related record
  if (Array.isArray(field) && field.length > 0) {
    return await fetchRelatedRecordName(base, fieldName, field[0])
  }

  // Return the field as is if it's already a string
  return field || ""
}

// Helper function to safely get array of related record names
export const getRelatedRecordNames = async (base: any, record: any, fieldName: string): Promise<string[]> => {
  const field = record.get(fieldName)
  // If the field is an array of objects with an 'id' property, fetch the related records
  if (Array.isArray(field) && field.length > 0) {
    return await fetchRelatedRecordNames(base, fieldName, field)
  }

  // Return the field as is if it's already an array of strings
  if (Array.isArray(field)) {
    return field
  }

  // Return an empty array if the field is not found or not in the expected format
  return []
}

// Convert Airtable record to Startup type
export const convertAirtableRecord = async (base: any, record: any): Promise<Startup> => {
  // Process all related records in parallel for better performance
  const [country, category, industry, fundingStage, productionDevelopmentStage, targetMarket, customers] = await Promise.all([
    getRelatedRecordName(base, record, "country"),
    getRelatedRecordName(base, record, "category"),
    getRelatedRecordName(base, record, "industry"),
    getRelatedRecordName(base, record, "fundingStage"),
    getRelatedRecordName(base, record, "productionDevelopmentStage"),
    getRelatedRecordNames(base, record, "targetMarket"),
    getRelatedRecordNames(base, record, "customers"),
  ])

  return {
    id: record.id,
    name: record.get("name") || "",
    country,
    category,
    industry,
    description: record.get("description") || "",
    revenue: Number(record.get("revenue")) || 0,
    fundraising: Number(record.get("fundraising")) || 0,
    yearFounded: Number(record.get("yearFounded")) || 2020,
    employees: Number(record.get("employees")) || 0,
    analysisRating: Number(record.get("analysisRating")) || 0,
    analysisContent: record.get("analysisContent") || "",
    fundingStage,
    productionDevelopmentStage,
    targetMarket,
    customers,
    ARR: Number(record.get("ARR")) || 0,
    grossMargin: Number(record.get("grossMargin")) || 0,
    logo: record.get("logo") || "/placeholder.svg?height=80&width=80",
    url: record.get("url") || "",
  }
}

// Fetch all startups from Airtable
export const fetchAllStartups = async () => {
  try {
    const base = initAirtable()
    if (!base) {
      throw new Error("Airtable connection not available")
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName).select().all()

    // Convert all records with related data
    const startups = await Promise.all(records.map((record) => convertAirtableRecord(base, record)))
    return startups
  } catch (error) {
    console.error("Error fetching startups from Airtable:", error)
    throw error
  }
}

// Fetch startups with a filter formula
export const fetchStartupsWithFilter = async (filterFormula: string) => {
  try {
    const base = initAirtable()
    if (!base) {
      throw new Error("Airtable connection not available")
    }

    const tableName = process.env.AIRTABLE_TABLE_NAME || "Startups"
    const records = await base(tableName)
      .select({
        filterByFormula: filterFormula,
      })
      .all()

    // Convert all records with related data
    const startups = await Promise.all(records.map((record) => convertAirtableRecord(base, record)))
    return startups
  } catch (error) {
    console.error("Error fetching startups with filter from Airtable:", error)
    throw error
  }
}

// Fetch a single startup by name
export const fetchStartupByName = async (name: string) => {
  try {
    const filterFormula = `{name} = "${name.replace(/"/g, '\\"')}"`
    const startups = await fetchStartupsWithFilter(filterFormula)
    return startups.length > 0 ? startups[0] : null
  } catch (error) {
    console.error("Error fetching startup by name from Airtable:", error)
    throw error
  }
}

// Fetch startups by category
export const fetchStartupsByCategory = async (category: string) => {
  try {
    // We need to search for records where the category name matches
    // This is more complex because category is a linked record
    // We'll need to fetch all records and filter on the client side
    const allStartups = await fetchAllStartups()
    return allStartups.filter((startup) => startup.category === category)
  } catch (error) {
    console.error("Error fetching startups by category from Airtable:", error)
    throw error
  }
}
