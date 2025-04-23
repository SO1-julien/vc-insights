// Type definition for Startup
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
  created_at?: string
  updated_at?: string
}

// Function to fetch all startups
export async function fetchStartups(filters?: {
  category?: string
  country?: string
  year?: number
}): Promise<Startup[]> {
  try {
    // Fetch startups from API route
    const response = await fetch("/api/airtable/startups")

    if (!response.ok) {
      throw new Error(`Failed to fetch startups: ${response.statusText}`)
    }

    const startups = await response.json()

    // Apply filters if provided
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
  } catch (error) {
    console.error("Error fetching startups:", error)
    return []
  }
}

// Function to fetch a startup by name
export async function fetchStartupByName(name: string): Promise<Startup | null> {
  try {
    const response = await fetch(`/api/airtable/startups/${encodeURIComponent(name)}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch startup: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching startup by name:", error)
    return null
  }
}

// Function to fetch startups by category
export async function fetchStartupsByCategory(category: string): Promise<Startup[]> {
  try {
    const response = await fetch(`/api/airtable/startups/category/${encodeURIComponent(category)}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch startups by category: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching startups by category:", error)
    return []
  }
}

// Function to fetch analytics data
export async function fetchStartupsAnalytics(dateRange?: { start: Date; end: Date }) {
  try {
    // Fetch startups from API route
    const response = await fetch("/api/airtable/startups")

    if (!response.ok) {
      throw new Error(`Failed to fetch startups: ${response.statusText}`)
    }

    const startups = await response.json()

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
    console.error("Error fetching startups analytics:", error)
    return {
      byFundingStage: {},
      categoryAnalytics: [],
      totalRevenue: 0,
      totalStartups: 0,
    }
  }
}
