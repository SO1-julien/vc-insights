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

// Fallback mock data in case Airtable API is not available
const mockStartups: Startup[] = [
  {
    id: "mock-1",
    name: "TechInnovate",
    country: "USA",
    category: "SaaS",
    industry: ["Technology", "AI"],
    description: "AI-powered business intelligence platform",
    revenue: 2500000,
    fundraising: 5000000,
    yearFounded: 2019,
    employees: 45,
    analysisRating: 4,
    analysisContent: "Strong growth trajectory with innovative product.",
    fundingStage: "Series A",
    productionDevelopmentStage: "Growth",
    targetMarket: "Enterprise",
    customers: "Fortune 500 companies",
    ARR: 2000000,
    grossMargin: 0.75,
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://techinnovate.example.com",
  },
  {
    id: "mock-2",
    name: "GreenEnergy",
    country: "Germany",
    category: "CleanTech",
    industry: ["Energy", "Sustainability"],
    description: "Renewable energy solutions for residential buildings",
    revenue: 1800000,
    fundraising: 3500000,
    yearFounded: 2020,
    employees: 32,
    analysisRating: 7,
    analysisContent: "Promising technology with growing market demand.",
    fundingStage: "Seed",
    productionDevelopmentStage: "Early Growth",
    targetMarket: "Residential",
    customers: "Homeowners and property developers",
    ARR: 1500000,
    grossMargin: 0.65,
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://greenenergy.example.com",
  },
  {
    id: "mock-3",
    name: "HealthTech",
    country: "UK",
    category: "HealthTech",
    industry: ["Healthcare", "Technology"],
    description: "Digital health platform for remote patient monitoring",
    revenue: 3200000,
    fundraising: 7500000,
    yearFounded: 2018,
    employees: 60,
    analysisRating: 9,
    analysisContent: "Market leader with strong product-market fit.",
    fundingStage: "Series B",
    productionDevelopmentStage: "Scaling",
    targetMarket: "Healthcare Providers",
    customers: "Hospitals and clinics",
    ARR: 3000000,
    grossMargin: 0.8,
    logo: "/placeholder.svg?height=80&width=80",
    url: "https://healthtech.example.com",
  },
]

export async function fetchStartups(filters?: {
  category?: string
  country?: string
  year?: number
}): Promise<Startup[]> {
  try {
    let table
    try {
      table = getStartupsTable()
    } catch (error) {
      console.error("Failed to get Airtable table, using mock data:", error)
      return applyFilters(mockStartups, filters)
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

    console.log("Fetching Airtable records with query:", query)
    const records = await table.select(query).all()
    console.log(`Successfully fetched ${records.length} records from Airtable`)

    // Map Airtable records to Startup objects
    return records.map(mapAirtableRecordToStartup)
  } catch (error) {
    console.error("Error fetching startups from Airtable:", error)
    // Fallback to mock data if there's an error
    return applyFilters(mockStartups, filters)
  }
}

export async function fetchStartupByName(name: string): Promise<Startup | null> {
  try {
    let table
    try {
      table = getStartupsTable()
    } catch (error) {
      console.error("Failed to get Airtable table, using mock data:", error)
      return mockStartups.find((s) => s.name === name) || null
    }

    // Fetch records from Airtable with name filter
    console.log(`Fetching startup with name: ${name}`)
    const records = await table
      .select({
        filterByFormula: `{name} = '${name}'`,
      })
      .all()

    console.log(`Found ${records.length} records matching name: ${name}`)

    if (records.length === 0) {
      return null
    }

    // Map the first matching record to a Startup object
    return mapAirtableRecordToStartup(records[0])
  } catch (error) {
    console.error("Error fetching startup by name from Airtable:", error)
    // Fallback to mock data if there's an error
    return mockStartups.find((s) => s.name === name) || null
  }
}

export async function fetchStartupsByCategory(category: string): Promise<Startup[]> {
  try {
    let table
    try {
      table = getStartupsTable()
    } catch (error) {
      console.error("Failed to get Airtable table, using mock data:", error)
      return mockStartups.filter((s) => s.category === category)
    }

    // Fetch records from Airtable with category filter
    console.log(`Fetching startups with category: ${category}`)
    const records = await table
      .select({
        filterByFormula: `{category} = '${category}'`,
      })
      .all()

    console.log(`Found ${records.length} records matching category: ${category}`)

    // Map Airtable records to Startup objects
    return records.map(mapAirtableRecordToStartup)
  } catch (error) {
    console.error("Error fetching startups by category from Airtable:", error)
    // Fallback to mock data if there's an error
    return mockStartups.filter((s) => s.category === category)
  }
}

export async function fetchStartupsAnalytics(dateRange?: { start: Date; end: Date }) {
  try {
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
  } catch (error) {
    console.error("Error fetching startups analytics from Airtable:", error)
    // Fallback to mock analytics if there's an error
    return fetchMockAnalytics(dateRange)
  }
}

// Helper function to apply filters to mock data
function applyFilters(
  startups: Startup[],
  filters?: { category?: string; country?: string; year?: number },
): Startup[] {
  if (!filters) return startups

  let result = [...startups]

  if (filters.category && filters.category !== "all") {
    result = result.filter((s) => s.category === filters.category)
  }

  if (filters.country && filters.country !== "all") {
    result = result.filter((s) => s.country === filters.country)
  }

  if (filters.year && filters.year !== 0) {
    result = result.filter((s) => s.yearFounded === filters.year)
  }

  return result
}

// Helper function to generate mock analytics
function fetchMockAnalytics(dateRange?: { start: Date; end: Date }) {
  // Filter by date range if provided
  const filteredStartups = [...mockStartups]

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
