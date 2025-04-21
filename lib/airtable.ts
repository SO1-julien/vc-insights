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
}) {
  // In a real application, this would be an actual Airtable API call
  // For now, we'll return mock data
  const mockStartups: Startup[] = [
    {
      id: "1",
      name: "TechInnovate",
      country: "USA",
      category: "SaaS",
      industry: ["Technology", "AI"],
      description: "AI-powered business intelligence platform",
      revenue: 2500000,
      fundraising: 5000000,
      yearFounded: 2019,
      employees: 45,
      analysisRating: 8,
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
      id: "2",
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
      id: "3",
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

  // Apply filters if provided
  let filteredStartups = [...mockStartups]

  if (filters) {
    if (filters.category) {
      filteredStartups = filteredStartups.filter((s) => s.category === filters.category)
    }
    if (filters.country) {
      filteredStartups = filteredStartups.filter((s) => s.country === filters.country)
    }
    if (filters.year) {
      filteredStartups = filteredStartups.filter((s) => s.yearFounded === filters.year)
    }
  }

  return filteredStartups
}

export async function fetchStartupByName(name: string) {
  const startups = await fetchStartups()
  return startups.find((s) => s.name === name) || null
}

export async function fetchStartupsByCategory(category: string) {
  const startups = await fetchStartups()
  return startups.filter((s) => s.category === category)
}

export async function fetchStartupsByFundingStage(stage: string) {
  const startups = await fetchStartups()
  return startups.filter((s) => s.fundingStage === stage)
}

export async function fetchStartupsByProductionStage(stage: string) {
  const startups = await fetchStartups()
  return startups.filter((s) => s.productionDevelopmentStage === stage)
}

export async function fetchStartupsAnalytics(dateRange?: { start: Date; end: Date }) {
  const startups = await fetchStartups()

  // Group by funding stage
  const byFundingStage = startups.reduce(
    (acc, startup) => {
      acc[startup.fundingStage] = (acc[startup.fundingStage] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group by category
  const byCategory = startups.reduce(
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
  const totalRevenue = startups.reduce((sum, startup) => sum + startup.revenue, 0)

  return {
    byFundingStage,
    categoryAnalytics,
    totalRevenue,
    totalStartups: startups.length,
  }
}
