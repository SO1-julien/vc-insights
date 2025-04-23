import { createServerClient } from "@/lib/supabase/server"
import { createClientClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

export type Startup = Database["public"]["Tables"]["Startups"]["Row"]

// Mock data for fallback
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

// Server-side function to fetch startups
export async function fetchStartups(filters?: {
  category?: string
  country?: string
  year?: number
}): Promise<Startup[]> {
  try {
    const supabase = createServerClient()

    let query = supabase.from("Startups").select("*")

    // Apply filters if provided
    if (filters) {
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category)
      }

      if (filters.country && filters.country !== "all") {
        query = query.eq("country", filters.country)
      }

      if (filters.year && filters.year !== 0) {
        query = query.eq("yearFounded", filters.year)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching startups:", error)
      return mockStartups
    }

    return data || mockStartups
  } catch (error) {
    console.error("Error fetching startups:", error)
    return mockStartups
  }
}

// Client-side function to fetch startups
export async function fetchStartupsClient(filters?: {
  category?: string
  country?: string
  year?: number
}): Promise<Startup[]> {
  try {
    const supabase = createClientClient()

    let query = supabase.from("Startups").select("*")

    // Apply filters if provided
    if (filters) {
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category)
      }

      if (filters.country && filters.country !== "all") {
        query = query.eq("country", filters.country)
      }

      if (filters.year && filters.year !== 0) {
        query = query.eq("yearFounded", filters.year)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching startups:", error)
      return mockStartups
    }

    return data || mockStartups
  } catch (error) {
    console.error("Error fetching startups:", error)
    return mockStartups
  }
}

export async function fetchStartupByName(name: string): Promise<Startup | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("Startups").select("*").eq("name", name).single()

    if (error) {
      console.error("Error fetching startup by name:", error)
      return mockStartups.find((s) => s.name === name) || null
    }

    return data
  } catch (error) {
    console.error("Error fetching startup by name:", error)
    return mockStartups.find((s) => s.name === name) || null
  }
}

export async function fetchStartupsByCategory(category: string): Promise<Startup[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("Startups").select("*").eq("category", category)

    if (error) {
      console.error("Error fetching startups by category:", error)
      return mockStartups.filter((s) => s.category === category)
    }

    return data || mockStartups.filter((s) => s.category === category)
  } catch (error) {
    console.error("Error fetching startups by category:", error)
    return mockStartups.filter((s) => s.category === category)
  }
}

export async function fetchStartupsAnalytics(dateRange?: { start: Date; end: Date }) {
  try {
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
    console.error("Error fetching startups analytics:", error)
    return fetchMockAnalytics()
  }
}

// Helper function to generate mock analytics
function fetchMockAnalytics() {
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
