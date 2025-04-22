import { getStartupsTable, mapAirtableRecordToStartup } from "./airtable-client"

export type Startup = {
  id: string
  name: string
  country: string
  category: string
  industry: string[]
  description: string
  revenue: number
  fundraising: number
  yearFounded: number
  employees: number
  analysisRating: number
  analysisContent: string
  fundingStage: string
  productionDevelopmentStage: string
  targetMarket: string
  customers: string
  ARR: number
  grossMargin: number
  logo: string
  url: string
}

export async function fetchStartups(filters?: {
  category?: string
  country?: string
  year?: number
}): Promise<Startup[]> {
  const table = getStartupsTable()

  if (!table) {
    throw new Error("Airtable table not available")
  }

  // Build filter formula if filters are provided
  let filterFormula = ""

  if (filters) {
    const conditions = []

    if (filters.category) {
      conditions.push(`{category} = '${filters.category}'`)
    }

    if (filters.country) {
      conditions.push(`{country} = '${filters.country}'`)
    }

    if (filters.year) {
      conditions.push(`{yearFounded} = ${filters.year}`)
    }

    if (conditions.length > 0) {
      filterFormula = `AND(${conditions.join(", ")})`
    }
  }

  // Fetch records from Airtable
  const query: any = {}
  if (filterFormula) {
    query.filterByFormula = filterFormula
  }

  const records = await table.select(query).all()

  // Map Airtable records to Startup objects
  return records.map(mapAirtableRecordToStartup)
}

export async function fetchStartupByName(name: string): Promise<Startup | null> {
  const table = getStartupsTable()

  if (!table) {
    throw new Error("Airtable table not available")
  }

  // Fetch records from Airtable with name filter
  const records = await table
    .select({
      filterByFormula: `{name} = '${name}'`,
    })
    .all()

  if (records.length === 0) {
    return null
  }

  // Map the first matching record to a Startup object
  return mapAirtableRecordToStartup(records[0])
}

export async function fetchStartupsByCategory(category: string): Promise<Startup[]> {
  const table = getStartupsTable()

  if (!table) {
    throw new Error("Airtable table not available")
  }

  // Fetch records from Airtable with category filter
  const records = await table
    .select({
      filterByFormula: `{category} = '${category}'`,
    })
    .all()

  // Map Airtable records to Startup objects
  return records.map(mapAirtableRecordToStartup)
}

export async function fetchStartupsByFundingStage(stage: string): Promise<Startup[]> {
  const table = getStartupsTable()

  if (!table) {
    throw new Error("Airtable table not available")
  }

  // Fetch records from Airtable with funding stage filter
  const records = await table
    .select({
      filterByFormula: `{fundingStage} = '${stage}'`,
    })
    .all()

  // Map Airtable records to Startup objects
  return records.map(mapAirtableRecordToStartup)
}

export async function fetchStartupsByProductionStage(stage: string): Promise<Startup[]> {
  const table = getStartupsTable()

  if (!table) {
    throw new Error("Airtable table not available")
  }

  // Fetch records from Airtable with production stage filter
  const records = await table
    .select({
      filterByFormula: `{productionDevelopmentStage} = '${stage}'`,
    })
    .all()

  // Map Airtable records to Startup objects
  return records.map(mapAirtableRecordToStartup)
}

export async function fetchStartupsAnalytics(dateRange?: { start: Date; end: Date }) {
  // Fetch all startups first
  const startups = await fetchStartups()

  // Filter by date range if provided
  const filteredStartups = [...startups]

  // Group by funding stage
  const byFundingStage = filteredStartups.reduce(
    (acc, startup) => {
      acc[startup.fundingStage] = (acc[startup.fundingStage] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group by category
  const byCategory = filteredStartups.reduce(
    (acc, startup) => {
      if (!acc[startup.category]) {
        acc[startup.category] = {
          count: 0,
          totalRevenue: 0,
          totalEmployees: 0,
          totalARR: 0,
          totalGrossMargin: 0,
        }
      }

      acc[startup.category].count += 1
      acc[startup.category].totalRevenue += startup.revenue
      acc[startup.category].totalEmployees += startup.employees
      acc[startup.category].totalARR += startup.ARR
      acc[startup.category].totalGrossMargin += startup.grossMargin

      return acc
    },
    {} as Record<
      string,
      {
        count: number
        totalRevenue: number
        totalEmployees: number
        totalARR: number
        totalGrossMargin: number
      }
    >,
  )

  // Calculate averages for each category
  const categoryAnalytics = Object.entries(byCategory).map(([category, data]) => ({
    category,
    startups: data.count,
    averageRevenue: data.totalRevenue / data.count,
    averageEmployees: data.totalEmployees / data.count,
    averageARR: data.totalARR / data.count,
    averageGrossMargin: data.totalGrossMargin / data.count,
  }))

  // Total revenue across all startups
  const totalRevenue = filteredStartups.reduce((sum, startup) => sum + startup.revenue, 0)

  return {
    byFundingStage,
    categoryAnalytics,
    totalRevenue,
    totalStartups: filteredStartups.length,
  }
}
